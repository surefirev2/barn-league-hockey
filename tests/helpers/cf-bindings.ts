import type { Env } from "../../src/worker/env";
import type { RegistrationRow } from "../../src/worker/registrations/store";

export class MemoryD1 {
  rows = new Map<string, RegistrationRow>();

  prepare(sql: string) {
    const normalized = sql.replace(/\s+/g, " ").trim();
    return {
      bind: (...values: unknown[]) => ({
        run: async () => {
          if (/^INSERT INTO registrations/i.test(normalized)) {
            const row = rowFromInsert(values);
            this.rows.set(row.id, row);
            return { success: true };
          }
          if (/^UPDATE registrations SET drive_file_id/i.test(normalized)) {
            const [driveFileId, exportedAt, id] = values;
            const row = this.rows.get(String(id));
            if (row) {
              row.drive_file_id = String(driveFileId);
              row.exported_at = String(exportedAt);
            }
            return { success: true };
          }
          throw new Error(`unsupported SQL: ${sql}`);
        },
        first: async () => {
          if (/SELECT \* FROM registrations WHERE id = \?/i.test(normalized)) {
            return this.rows.get(String(values[0])) ?? null;
          }
          return null;
        },
        all: async () => {
          if (
            /SELECT \* FROM registrations WHERE season_id = \?/i.test(
              normalized,
            )
          ) {
            const season = String(values[0]);
            const results = [...this.rows.values()]
              .filter((row) => row.season_id === season)
              .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
            return { results };
          }
          return { results: [] };
        },
      }),
    };
  }
}

function rowFromInsert(values: unknown[]): RegistrationRow {
  return {
    id: String(values[0]),
    season_id: String(values[1]),
    submitted_at: String(values[2]),
    team_preference: String(values[3]),
    first_name: String(values[4]),
    last_name: String(values[5]),
    date_of_birth: String(values[6]),
    phone: String(values[7]),
    email: String(values[8]),
    emergency_name: String(values[9]),
    emergency_phone: String(values[10]),
    city: String(values[11]),
    postal_code: String(values[12]),
    highest_level: String(values[13]),
    primary_position: String(values[14]),
    ability_rating: String(values[15]),
    participation: String(values[16]),
    spare_interest: String(values[17]),
    deposit_status: String(values[18]),
    payload_json: String(values[19]),
    pdf_r2_key: String(values[20]),
    drive_file_id: values[21] == null ? null : String(values[21]),
    exported_at: values[22] == null ? null : String(values[22]),
  };
}

export class MemoryR2 {
  objects = new Map<string, Uint8Array>();

  async put(key: string, value: ArrayBuffer | Uint8Array | string) {
    const bytes =
      typeof value === "string"
        ? new TextEncoder().encode(value)
        : value instanceof Uint8Array
          ? value
          : new Uint8Array(value);
    this.objects.set(key, bytes);
  }

  async get(key: string) {
    const data = this.objects.get(key);
    if (!data) {
      return null;
    }
    return {
      arrayBuffer: async () =>
        data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
    };
  }
}

export class MemoryQueue {
  messages: Array<{ registrationId: string }> = [];
  fail = false;

  async send(body: { registrationId: string }) {
    if (this.fail) {
      throw new Error("queue unavailable");
    }
    this.messages.push(body);
  }
}

export function testEnv(overrides: Partial<Env> = {}): Env & {
  DB: MemoryD1;
  REGISTRATION_PDFS: MemoryR2;
  REGISTRATION_EXPORT: MemoryQueue;
} {
  const env = {
    DB: new MemoryD1(),
    REGISTRATION_PDFS: new MemoryR2(),
    REGISTRATION_EXPORT: new MemoryQueue(),
    SEASON_ID: "2026-27",
    GOOGLE_SYNC_MODE: "off",
    GOOGLE_DRIVE_FOLDER_ID: "",
    GOOGLE_REGISTRATION_SHEET_ID: "",
    ...overrides,
  };
  return env as Env & {
    DB: MemoryD1;
    REGISTRATION_PDFS: MemoryR2;
    REGISTRATION_EXPORT: MemoryQueue;
  };
}
