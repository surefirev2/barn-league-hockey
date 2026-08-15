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
});
