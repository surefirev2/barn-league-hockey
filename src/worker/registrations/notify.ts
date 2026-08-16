import type { Env } from "../env";
import { pdfFilename } from "./schema";
import { getRegistration, markEmailed } from "./store";

export async function handleRegistrationNotify(
  env: Env,
  registrationId: string,
): Promise<void> {
  const row = await getRegistration(env, registrationId);
  if (!row) {
    throw new Error(`registration ${registrationId} not found`);
  }
  const pdf = await env.REGISTRATION_PDFS.get(row.pdf_r2_key);
  if (!pdf) {
    throw new Error(`PDF missing for ${registrationId}`);
  }
  const filename = pdfFilename(row.last_name, row.first_name, row.id);
  await env.EMAIL.send({
    from: env.REGISTRATION_FROM_EMAIL,
    to: env.REGISTRATION_NOTIFY_EMAIL,
    subject: `Barn League registration: ${row.last_name}, ${row.first_name} (${row.id})`,
    text: `Registration ${row.id} for ${row.last_name}, ${row.first_name}. PDF attached.`,
    html: `<p>Registration <strong>${escapeHtml(row.id)}</strong> for ${escapeHtml(row.last_name)}, ${escapeHtml(row.first_name)}.</p><p>PDF attached.</p>`,
    attachments: [
      {
        filename,
        content: await pdf.arrayBuffer(),
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  });
  await markEmailed(env, row.id, new Date().toISOString());
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
