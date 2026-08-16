import { describe, expect, it } from "vitest";
import worker from "../src/worker/index";
import { handleRegistrationNotify } from "../src/worker/registrations/notify";
import { pdfFilename } from "../src/worker/registrations/schema";
import { validPayload } from "./fixtures/registration";
import { testEnv } from "./helpers/cf-bindings";

describe("registration email notify", () => {
  it("emails the R2 PDF to the operator and sets emailed_at", async () => {
    const env = testEnv();
    const created = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    const body = (await created.json()) as { id: string };
    await handleRegistrationNotify(env, body.id);
    expect(env.EMAIL.sent).toHaveLength(1);
    const message = env.EMAIL.sent[0];
    expect(message.to).toBe("chutchic@gmail.com");
    expect(message.from).toBe("registrations@barnleaguehockey.ca");
    expect(message.subject).toContain(body.id);
    expect(message.attachments[0]?.type).toBe("application/pdf");
    expect(message.attachments[0]?.filename).toBe(
      pdfFilename("Brown", "Sally", body.id),
    );
    expect(env.DB.rows.get(body.id)?.emailed_at).toBeTruthy();
  });

  it("throws when the PDF is missing from R2", async () => {
    const env = testEnv();
    const created = await worker.fetch(
      new Request("https://barnleaguehockey.ca/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload()),
      }),
      env,
    );
    const body = (await created.json()) as { id: string };
    const row = env.DB.rows.get(body.id);
    if (row) {
      env.REGISTRATION_PDFS.objects.delete(row.pdf_r2_key);
    }
    await expect(handleRegistrationNotify(env, body.id)).rejects.toThrow(
      /PDF missing/,
    );
    expect(env.EMAIL.sent).toEqual([]);
  });
});
