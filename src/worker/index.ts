import type { Env, MessageBatch } from "./env";
import { handleRegistrationExport } from "./google/sync";
import { handleAdminRequest } from "./registrations/admin";
import { handlePostRegistration } from "./registrations/handler";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/config") {
      return Response.json({
        turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? "",
      });
    }
    if (request.method === "POST" && url.pathname === "/api/registrations") {
      return handlePostRegistration(request, env);
    }
    const admin = await handleAdminRequest(request, env);
    if (admin) {
      return admin;
    }
    if (url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response("Not found", { status: 404 });
  },

  async queue(
    batch: MessageBatch<{ registrationId: string }>,
    env: Env,
  ): Promise<void> {
    for (const message of batch.messages) {
      await handleRegistrationExport(env, message.body.registrationId);
      message.ack();
    }
  },
};
