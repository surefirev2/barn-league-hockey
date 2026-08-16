import { describe, expect, it } from "vitest";
import worker from "../src/worker/index";
import { validPayload } from "./fixtures/registration";
import { testEnv } from "./helpers/cf-bindings";

const ADMIN_TOKEN = "test-admin-read-token";

async function submitRegistration(
  env: ReturnType<typeof testEnv>,
  overrides: Parameters<typeof validPayload>[0] = {},
) {
  const response = await worker.fetch(
    new Request("https://barnleaguehockey.ca/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload(overrides)),
    }),
    env,
  );
  expect(response.status).toBe(201);
  return (await response.json()) as { id: string };
}

describe("GET /api/admin/registrations", () => {
  it("returns 503 when ADMIN_READ_TOKEN is unset", async () => {
    const env = testEnv();
    const response = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/admin/registrations"),
      env,
    );
    expect(response.status).toBe(503);
  });

  it("returns 401 when the bearer token is missing or wrong", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const missing = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/admin/registrations"),
      env,
    );
    const wrong = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/admin/registrations", {
        headers: { Authorization: "Bearer nope" },
      }),
      env,
    );
    expect(missing.status).toBe(401);
    expect(wrong.status).toBe(401);
  });

  it("lists season rows from D1 without payload_json", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const created = await submitRegistration(env);
    const response = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/admin/registrations", {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      }),
      env,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      registrations: Array<Record<string, unknown>>;
    };
    expect(body.registrations).toHaveLength(1);
    expect(body.registrations[0]?.id).toBe(created.id);
    expect(body.registrations[0]?.email).toBe("sally@example.com");
    expect(body.registrations[0]?.teamPreference).toBe("rockets");
    expect(body.registrations[0]).not.toHaveProperty("payload_json");
    expect(body.registrations[0]).not.toHaveProperty("payloadJson");
    expect(body.registrations[0]).toHaveProperty("emailedAt");
    expect(body.registrations[0]).not.toHaveProperty("driveFileId");
    expect(body.registrations[0]).not.toHaveProperty("exportedAt");
  });
});

describe("GET /api/admin/registrations/:id/pdf", () => {
  it("streams the R2 PDF for an authenticated operator", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const created = await submitRegistration(env);
    const response = await worker.fetch(
      new Request(
        `https://barnleaguehockey.ca/api/admin/registrations/${created.id}/pdf`,
        { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } },
      ),
      env,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    const bytes = new Uint8Array(await response.arrayBuffer());
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe("%PDF");
  });

  it("returns 404 when the registration is missing", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const response = await worker.fetch(
      new Request(
        "https://barnleaguehockey.ca/api/admin/registrations/01ARZ3NDEKTSV4RRFFQ69G5FAV/pdf",
        { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } },
      ),
      env,
    );
    expect(response.status).toBe(404);
  });

  it("returns 401 without a valid bearer token", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const created = await submitRegistration(env);
    const response = await worker.fetch(
      new Request(
        `https://barnleaguehockey.ca/api/admin/registrations/${created.id}/pdf`,
      ),
      env,
    );
    expect(response.status).toBe(401);
  });
});

describe("POST /api/admin/registrations email backfill", () => {
  it("enqueues D1 rows that have not been emailed", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const created = await submitRegistration(env);
    env.REGISTRATION_EXPORT.messages = [];
    const response = await worker.fetch(
      new Request(
        "https://barnleaguehockey.ca/api/admin/registrations/email-pending",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        },
      ),
      env,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { enqueued: string[] };
    expect(body.enqueued).toEqual([created.id]);
    expect(env.REGISTRATION_EXPORT.messages).toEqual([
      { registrationId: created.id },
    ]);
  });

  it("enqueues a single registration by id", async () => {
    const env = testEnv({ ADMIN_READ_TOKEN: ADMIN_TOKEN });
    const created = await submitRegistration(env);
    env.REGISTRATION_EXPORT.messages = [];
    const response = await worker.fetch(
      new Request(
        `https://barnleaguehockey.ca/api/admin/registrations/${created.id}/email`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        },
      ),
      env,
    );
    expect(response.status).toBe(200);
    expect(env.REGISTRATION_EXPORT.messages).toEqual([
      { registrationId: created.id },
    ]);
  });
});
