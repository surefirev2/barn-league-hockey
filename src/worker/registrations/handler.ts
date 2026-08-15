import type { Env } from "../env";
import { buildRegistrationPdf } from "../pdf/registration-pdf";
import { newRegistrationId } from "./id";
import { pdfR2Key, type RegistrationInput } from "./schema";
import { insertRegistration } from "./store";
import { verifyTurnstile } from "./turnstile";
import { validateRegistration } from "./validate";

const SAVE_ERROR =
  "We couldn't save that. Check your connection and try again.";

export async function handlePostRegistration(
  request: Request,
  env: Env,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_json", message: "Send a JSON registration payload." },
      { status: 400 },
    );
  }

  const input = (body ?? {}) as RegistrationInput;
  const allowed = await verifyTurnstile(
    env,
    input.turnstileToken,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!allowed) {
    return Response.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const result = validateRegistration(input);
  if (!result.ok) {
    return Response.json(
      { error: "validation_failed", fields: result.errors },
      { status: 400 },
    );
  }

  const id = newRegistrationId();
  const submittedAt = new Date().toISOString();
  const payload = {
    ...result.value,
    signedAt: result.value.signedAt || submittedAt,
  };
  const key = pdfR2Key(env.SEASON_ID, id);

  try {
    const pdf = await buildRegistrationPdf({ id, submittedAt, payload });
    await env.REGISTRATION_PDFS.put(key, pdf);
    await insertRegistration(env, {
      id,
      seasonId: env.SEASON_ID,
      submittedAt,
      payload,
      pdfR2Key: key,
    });
  } catch (error) {
    console.error("registration persist failed", error);
    return Response.json(
      { error: "save_failed", message: SAVE_ERROR },
      { status: 500 },
    );
  }

  try {
    await env.REGISTRATION_EXPORT.send({ registrationId: id });
  } catch (error) {
    console.error("registration enqueue failed", error);
  }

  return Response.json(
    {
      id,
      teamPreference: payload.teamPreference,
      depositStatus: payload.depositStatus,
    },
    { status: 201 },
  );
}
