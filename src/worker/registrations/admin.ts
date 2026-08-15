import { googleSyncMode, type Env } from "../env";
import { isUlid } from "./id";
import { getRegistration, listSeasonRegistrations } from "./store";

const PDF_PATH = /^\/api\/admin\/registrations\/([0-9A-HJKMNP-TV-Z]{26})\/pdf$/;

export async function handleAdminRequest(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/admin/")) {
    return null;
  }

  const denied = authorizeAdmin(request, env);
  if (denied) {
    return denied;
  }

  if (request.method === "GET" && url.pathname === "/api/admin/registrations") {
    return listRegistrations(env);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/registrations/export-pending"
  ) {
    return enqueuePendingExports(env);
  }

  const exportMatch = url.pathname.match(
    /^\/api\/admin\/registrations\/([0-9A-HJKMNP-TV-Z]{26})\/export$/,
  );
  if (request.method === "POST" && exportMatch) {
    return enqueueOneExport(env, exportMatch[1] ?? "");
  }

  const pdfMatch = url.pathname.match(PDF_PATH);
  if (request.method === "GET" && pdfMatch) {
    return streamRegistrationPdf(env, pdfMatch[1] ?? "");
  }

  return new Response("Not found", { status: 404 });
}

async function enqueuePendingExports(env: Env): Promise<Response> {
  const blocked = syncMustBeOn(env);
  if (blocked) {
    return blocked;
  }
  const rows = await listSeasonRegistrations(env, env.SEASON_ID);
  const pending = rows.filter(
    (row) => row.drive_file_id == null || row.drive_file_id === "",
  );
  const enqueued: string[] = [];
  for (const row of pending) {
    await env.REGISTRATION_EXPORT.send({ registrationId: row.id });
    enqueued.push(row.id);
  }
  return Response.json({ enqueued });
}

async function enqueueOneExport(env: Env, id: string): Promise<Response> {
  const blocked = syncMustBeOn(env);
  if (blocked) {
    return blocked;
  }
  if (!isUlid(id)) {
    return new Response("Not found", { status: 404 });
  }
  const row = await getRegistration(env, id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }
  await env.REGISTRATION_EXPORT.send({ registrationId: id });
  return Response.json({ enqueued: [id] });
}

function syncMustBeOn(env: Env): Response | null {
  if (googleSyncMode(env.GOOGLE_SYNC_MODE) === "off") {
    return Response.json(
      {
        error: "google_sync_off",
        message: "Set GOOGLE_SYNC_MODE to local or live before enqueueing.",
      },
      { status: 409 },
    );
  }
  return null;
}

function authorizeAdmin(request: Request, env: Env): Response | null {
  const secret = env.ADMIN_READ_TOKEN;
  if (!secret) {
    return Response.json(
      { error: "admin_unconfigured", message: "ADMIN_READ_TOKEN is not set." },
      { status: 503 },
    );
  }
  const header = request.headers.get("Authorization");
  const prefix = "Bearer ";
  const token = header?.startsWith(prefix) ? header.slice(prefix.length) : "";
  if (!timingSafeEqual(token, secret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

async function listRegistrations(env: Env): Promise<Response> {
  const rows = await listSeasonRegistrations(env, env.SEASON_ID);
  return Response.json({
    registrations: rows.map((row) => ({
      id: row.id,
      seasonId: row.season_id,
      submittedAt: row.submitted_at,
      teamPreference: row.team_preference,
      firstName: row.first_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      phone: row.phone,
      email: row.email,
      emergencyName: row.emergency_name,
      emergencyPhone: row.emergency_phone,
      city: row.city,
      postalCode: row.postal_code,
      highestLevel: row.highest_level,
      primaryPosition: row.primary_position,
      abilityRating: row.ability_rating,
      participation: row.participation,
      spareInterest: row.spare_interest,
      depositStatus: row.deposit_status,
      pdfR2Key: row.pdf_r2_key,
      driveFileId: row.drive_file_id,
      exportedAt: row.exported_at,
    })),
  });
}

async function streamRegistrationPdf(env: Env, id: string): Promise<Response> {
  if (!isUlid(id)) {
    return new Response("Not found", { status: 404 });
  }
  const row = await getRegistration(env, id);
  if (!row) {
    return new Response("Not found", { status: 404 });
  }
  const object = await env.REGISTRATION_PDFS.get(row.pdf_r2_key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(await object.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${id}.pdf"`,
    },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
