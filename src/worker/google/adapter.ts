import type { Env } from "../env";
import { googleSyncMode } from "../env";
import { SHEET_COLUMNS } from "../registrations/schema";
import { googleAccessToken } from "./auth";
import {
  createLiveDriveClient,
  type GoogleDriveClient,
  upsertDrivePdf,
} from "./drive";
import { createLiveSheetClient, type GoogleSheetClient } from "./sheet";

export interface GoogleAdapter {
  upsertPdf(
    registrationId: string,
    filename: string,
    bytes: Uint8Array,
  ): Promise<string>;
  rewriteSheet(rows: string[][]): Promise<void>;
}

class OffAdapter implements GoogleAdapter {
  async upsertPdf(): Promise<string> {
    return "";
  }
  async rewriteSheet(): Promise<void> {}
}

class LocalAdapter implements GoogleAdapter {
  constructor(private readonly dir: string) {}

  async upsertPdf(
    registrationId: string,
    filename: string,
    bytes: Uint8Array,
  ): Promise<string> {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(this.dir, { recursive: true });
    await writeFile(`${this.dir}/${filename}`, bytes);
    await writeFile(`${this.dir}/${registrationId}.id`, filename);
    return `local:${registrationId}`;
  }

  async rewriteSheet(rows: string[][]): Promise<void> {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(this.dir, { recursive: true });
    const csv = [SHEET_COLUMNS, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    await writeFile(`${this.dir}/Registrations.csv`, csv);
  }
}

class LiveAdapter implements GoogleAdapter {
  constructor(
    private readonly drive: GoogleDriveClient,
    private readonly sheet: GoogleSheetClient,
  ) {}

  async upsertPdf(
    registrationId: string,
    filename: string,
    bytes: Uint8Array,
  ): Promise<string> {
    return upsertDrivePdf(this.drive, registrationId, filename, bytes);
  }

  async rewriteSheet(rows: string[][]): Promise<void> {
    await this.sheet.replaceRows(SHEET_COLUMNS, rows);
  }
}

export async function getGoogleAdapter(
  env: Env,
  fetchImpl: typeof fetch = fetch,
): Promise<GoogleAdapter> {
  const mode = googleSyncMode(env.GOOGLE_SYNC_MODE);
  if (mode === "off") {
    return new OffAdapter();
  }
  if (mode === "local") {
    return new LocalAdapter(env.GOOGLE_LOCAL_DIR ?? ".wrangler/google-drive");
  }
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !key) {
    throw new Error("live Google sync requires service account secrets");
  }
  if (!env.GOOGLE_DRIVE_FOLDER_ID || !env.GOOGLE_REGISTRATION_SHEET_ID) {
    throw new Error("live Google sync requires Drive folder and Sheet IDs");
  }
  const token = await googleAccessToken(email, key, fetchImpl);
  return new LiveAdapter(
    createLiveDriveClient({
      token,
      folderId: env.GOOGLE_DRIVE_FOLDER_ID,
      fetchImpl,
    }),
    createLiveSheetClient({
      token,
      spreadsheetId: env.GOOGLE_REGISTRATION_SHEET_ID,
      fetchImpl,
    }),
  );
}

export { upsertDrivePdf };
