import type { Env } from "../env";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  env: Env,
  token: unknown,
  ip: string | null,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true;
  }
  if (typeof token !== "string" || token.trim() === "") {
    return false;
  }
  const body = new URLSearchParams();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (ip) {
    body.set("remoteip", ip);
  }
  const response = await fetch(SITEVERIFY, { method: "POST", body });
  if (!response.ok) {
    return false;
  }
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}
