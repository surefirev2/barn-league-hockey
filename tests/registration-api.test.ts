import { describe, expect, it } from "vitest";
import worker from "../src/worker/index";
import { isUlid } from "../src/worker/registrations/id";
import { validPayload } from "./fixtures/registration";
import { testEnv } from "./helpers/cf-bindings";

describe("POST /api/registrations", () => {
  it("persists D1 + R2, enqueues export, and returns 201 with a ULID", async () => {
    const env = testEnv();
    const response = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      id: string;
      teamPreference: string;
      depositStatus: string;
    };
    expect(isUlid(body.id)).toBe(true);
    expect(body.teamPreference).toBe("rockets");
    expect(body.depositStatus).toBe("pending");
    expect(env.DB.rows.has(body.id)).toBe(true);
    const row = env.DB.rows.get(body.id);
    expect(row?.pdf_r2_key).toBe(`registrations/2026-27/${body.id}.pdf`);
    expect(env.REGISTRATION_PDFS.objects.has(row?.pdf_r2_key ?? "")).toBe(true);
    expect(env.REGISTRATION_EXPORT.messages).toEqual([
      { registrationId: body.id },
    ]);
  });

  it("allows a second registration with the same email in the season", async () => {
    const env = testEnv();
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
    expect(env.DB.rows.size).toBe(2);
  });

  it("returns 400 on a bad payload", async () => {
    const env = testEnv();
    const response = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload({ email: "nope" })),
      }),
      env,
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("validation_failed");
    expect(env.DB.rows.size).toBe(0);
    expect(env.REGISTRATION_EXPORT.messages).toEqual([]);
  });

  it("still returns 201 when Google/queue projection cannot run", async () => {
    const env = testEnv({ GOOGLE_SYNC_MODE: "live" });
    env.REGISTRATION_EXPORT.fail = true;
    const response = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    expect(response.status).toBe(201);
    expect(env.DB.rows.size).toBe(1);
  });
});
