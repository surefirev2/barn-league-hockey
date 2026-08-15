export interface GoogleDriveClient {
  findByRegistrationId(registrationId: string): Promise<string | null>;
  createPdf(
    filename: string,
    bytes: Uint8Array,
    registrationId: string,
  ): Promise<string>;
  updatePdf(fileId: string, bytes: Uint8Array): Promise<void>;
}

export async function upsertDrivePdf(
  drive: GoogleDriveClient,
  registrationId: string,
  filename: string,
  bytes: Uint8Array,
): Promise<string> {
  const existing = await drive.findByRegistrationId(registrationId);
  if (existing) {
    await drive.updatePdf(existing, bytes);
    return existing;
  }
  return drive.createPdf(filename, bytes, registrationId);
}

function bytesBlob(bytes: Uint8Array, type?: string): Blob {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return type ? new Blob([copy], { type }) : new Blob([copy]);
}

export function createLiveDriveClient(options: {
  token: string;
  folderId: string;
  fetchImpl?: typeof fetch;
}): GoogleDriveClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const auth = { Authorization: `Bearer ${options.token}` };

  return {
    async findByRegistrationId(registrationId: string) {
      const query = `appProperties has { key='registrationId' and value='${registrationId}' } and trashed=false`;
      const url = new URL("https://www.googleapis.com/drive/v3/files");
      url.searchParams.set("q", query);
      url.searchParams.set("spaces", "drive");
      url.searchParams.set("supportsAllDrives", "true");
      url.searchParams.set("includeItemsFromAllDrives", "true");
      url.searchParams.set("fields", "files(id,name)");
      const response = await fetchImpl(url, { headers: auth });
      if (!response.ok) {
        throw new Error(`Drive search failed (${response.status})`);
      }
      const data = (await response.json()) as { files?: Array<{ id: string }> };
      return data.files?.[0]?.id ?? null;
    },

    async createPdf(filename, bytes, registrationId) {
      const metadata = JSON.stringify({
        name: filename,
        parents: [options.folderId],
        appProperties: { registrationId },
      });
      const boundary = "barnleaguehockey";
      const preamble = [
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        metadata,
        `--${boundary}`,
        "Content-Type: application/pdf",
        "",
        "",
      ].join("\r\n");
      const preambleBytes = new TextEncoder().encode(preamble);
      const closing = new TextEncoder().encode(`\r\n--${boundary}--`);
      const body = new Uint8Array(
        preambleBytes.byteLength + bytes.byteLength + closing.byteLength,
      );
      body.set(preambleBytes, 0);
      body.set(bytes, preambleBytes.byteLength);
      body.set(closing, preambleBytes.byteLength + bytes.byteLength);
      const response = await fetchImpl(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
        {
          method: "POST",
          headers: {
            ...auth,
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: bytesBlob(body),
        },
      );
      if (!response.ok) {
        throw new Error(`Drive create failed (${response.status})`);
      }
      const data = (await response.json()) as { id?: string };
      if (!data.id) {
        throw new Error("Drive create missing file id");
      }
      return data.id;
    },

    async updatePdf(fileId, bytes) {
      const response = await fetchImpl(
        `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=media&supportsAllDrives=true`,
        {
          method: "PATCH",
          headers: {
            ...auth,
            "Content-Type": "application/pdf",
          },
          body: bytesBlob(bytes, "application/pdf"),
        },
      );
      if (!response.ok) {
        throw new Error(`Drive update failed (${response.status})`);
      }
    },
  };
}
