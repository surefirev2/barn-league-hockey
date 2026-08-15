import { SHEET_COLUMNS } from "../registrations/schema";

export interface GoogleSheetClient {
  replaceRows(headers: readonly string[], rows: string[][]): Promise<void>;
}

export function createLiveSheetClient(options: {
  token: string;
  spreadsheetId: string;
  fetchImpl?: typeof fetch;
}): GoogleSheetClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const auth = { Authorization: `Bearer ${options.token}` };
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(options.spreadsheetId)}`;

  return {
    async replaceRows(headers, rows) {
      const clear = await fetchImpl(`${base}/values/Registrations!A:Z:clear`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: "{}",
      });
      if (!clear.ok) {
        throw new Error(`Sheet clear failed (${clear.status})`);
      }
      const update = await fetchImpl(
        `${base}/values/Registrations!A1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: { ...auth, "Content-Type": "application/json" },
          body: JSON.stringify({ values: [headers, ...rows] }),
        },
      );
      if (!update.ok) {
        throw new Error(`Sheet update failed (${update.status})`);
      }
    },
  };
}

export { SHEET_COLUMNS };
