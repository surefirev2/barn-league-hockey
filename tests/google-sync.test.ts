import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  upsertDrivePdf,
  type GoogleDriveClient,
} from "../src/worker/google/drive";
import { handleRegistrationExport } from "../src/worker/google/sync";
import { SHEET_COLUMNS } from "../src/worker/registrations/schema";
import { validPayload } from "./fixtures/registration";
import { testEnv } from "./helpers/cf-bindings";
import worker from "../src/worker/index";

class MemoryDrive implements GoogleDriveClient {
  files = new Map<
    string,
    { id: string; name: string; registrationId: string }
  >();
  creates = 0;
  updates = 0;

  async findByRegistrationId(registrationId: string) {
    for (const file of this.files.values()) {
      if (file.registrationId === registrationId) {
        return file.id;
      }
    }
    return null;
  }

  async createPdf(
    filename: string,
    _bytes: Uint8Array,
    registrationId: string,
  ) {
    this.creates += 1;
    const id = `drive-${this.creates}`;
    this.files.set(id, { id, name: filename, registrationId });
    return id;
  }

  async updatePdf(fileId: string): Promise<void> {
    if (!this.files.has(fileId)) {
      throw new Error("missing file");
    }
    this.updates += 1;
  }
}

describe("Google Drive upsert", () => {
  it("creates once then updates the same file for a registration ID", async () => {
    const drive = new MemoryDrive();
    const bytes = new Uint8Array([1, 2, 3]);
    const first = await upsertDrivePdf(
      drive,
      "01JTESTREGISTRATIONID0001",
      "Brown, Sally - 01JTESTREGISTRATIONID0001.pdf",
      bytes,
    );
    const second = await upsertDrivePdf(
      drive,
      "01JTESTREGISTRATIONID0001",
      "Brown, Sally - 01JTESTREGISTRATIONID0001.pdf",
      bytes,
    );
    expect(first).toBe(second);
    expect(drive.creates).toBe(1);
    expect(drive.updates).toBe(1);
  });
});

describe("Google projection adapters", () => {
  it("rebuilds the sheet from every D1 row in the season", async () => {
    const env = testEnv({ GOOGLE_SYNC_MODE: "local" });
    const dir = await mkdtemp(join(tmpdir(), "blh-google-"));
    env.GOOGLE_LOCAL_DIR = dir;

    const first = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    const second = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          validPayload({ firstName: "Sam", signatureName: "Sam Brown" }),
        ),
      }),
      env,
    );
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    const firstBody = (await first.json()) as { id: string };
    await handleRegistrationExport(env, firstBody.id);
    const csv = await readFile(join(dir, "Registrations.csv"), "utf8");
    const header = csv.split("\n")[0];
    expect(header).toBe(SHEET_COLUMNS.map((column) => `"${column}"`).join(","));
    expect(csv.split("\n").length).toBe(3);
  });

  it("no-ops export when GOOGLE_SYNC_MODE is off", async () => {
    const env = testEnv({ GOOGLE_SYNC_MODE: "off" });
    const created = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    const body = (await created.json()) as { id: string };
    await handleRegistrationExport(env, body.id);
    expect(env.DB.rows.get(body.id)?.exported_at).toBeTruthy();
    expect(env.DB.rows.get(body.id)?.drive_file_id).toBe("");
  });

  it("live adapter upserts Drive and rewrites the Sheet via mocked Google APIs", async () => {
    const pem = await testServiceAccountPem();
    const env = testEnv({
      GOOGLE_SYNC_MODE: "live",
      GOOGLE_DRIVE_FOLDER_ID: "folder-test",
      GOOGLE_REGISTRATION_SHEET_ID: "sheet-test",
      GOOGLE_SERVICE_ACCOUNT_EMAIL: "sa@example.com",
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: pem,
    });
    const created = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    const body = (await created.json()) as { id: string };
    const fetchImpl = mockGoogleFetch();
    await handleRegistrationExport(env, body.id, fetchImpl);
    expect(env.DB.rows.get(body.id)?.drive_file_id).toBe("drive-file-1");
    expect(env.DB.rows.get(body.id)?.exported_at).toBeTruthy();
    expect(
      fetchImpl.urls.some((url) => url.includes("oauth2.googleapis.com/token")),
    ).toBe(true);
    expect(
      fetchImpl.urls.some((url) => url.includes("upload/drive/v3/files")),
    ).toBe(true);
    expect(
      fetchImpl.urls.some((url) => url.includes("Registrations!A:Z:clear")),
    ).toBe(true);
  });
});

async function testServiceAccountPem(): Promise<string> {
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", pair.privateKey);
  const bytes = new Uint8Array(pkcs8);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const b64 = btoa(binary);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN PRIVATE KEY-----\n${lines}\n-----END PRIVATE KEY-----`;
}

function mockGoogleFetch(): typeof fetch & { urls: string[] } {
  const urls: string[] = [];
  const impl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    urls.push(url);
    if (url.includes("oauth2.googleapis.com/token")) {
      return Response.json({ access_token: "ya29.test" });
    }
    if (
      url.includes("googleapis.com/drive/v3/files") &&
      !url.includes("upload")
    ) {
      return Response.json({ files: [] });
    }
    if (url.includes("upload/drive/v3/files")) {
      return Response.json({ id: "drive-file-1" });
    }
    if (url.includes(":clear") || url.includes("/values/Registrations!A1")) {
      return new Response("{}", { status: 200 });
    }
    throw new Error(`unexpected fetch ${init?.method ?? "GET"} ${url}`);
  }) as typeof fetch & { urls: string[] };
  impl.urls = urls;
  return impl;
}
