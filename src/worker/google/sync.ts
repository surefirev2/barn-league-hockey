import type { Env } from "../env";
import { drivePdfFilename } from "../registrations/schema";
import {
  getRegistration,
  listSeasonRegistrations,
  markExported,
  sheetRow,
} from "../registrations/store";
import { getGoogleAdapter } from "./adapter";

export async function handleRegistrationExport(
  env: Env,
  registrationId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const row = await getRegistration(env, registrationId);
  if (!row) {
    throw new Error(`registration ${registrationId} not found`);
  }
  const pdf = await env.REGISTRATION_PDFS.get(row.pdf_r2_key);
  if (!pdf) {
    throw new Error(`PDF missing for ${registrationId}`);
  }
  const bytes = new Uint8Array(await pdf.arrayBuffer());
  const adapter = await getGoogleAdapter(env, fetchImpl);
  const filename = drivePdfFilename(row.last_name, row.first_name, row.id);
  const driveFileId = await adapter.upsertPdf(row.id, filename, bytes);
  await markExported(env, row.id, driveFileId, new Date().toISOString());
  const seasonRows = await listSeasonRegistrations(env, row.season_id);
  await adapter.rewriteSheet(seasonRows.map(sheetRow));
}
