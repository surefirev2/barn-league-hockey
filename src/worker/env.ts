export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface RegistrationQueue {
  send(body: { registrationId: string }): Promise<void>;
}

export interface RegistrationR2Object {
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface RegistrationR2 {
  put(key: string, value: ArrayBuffer | Uint8Array | string): Promise<unknown>;
  get(key: string): Promise<RegistrationR2Object | null>;
}

export interface Env {
  ASSETS?: { fetch(request: Request): Promise<Response> };
  DB: { prepare(query: string): D1PreparedStatement };
  REGISTRATION_PDFS: RegistrationR2;
  REGISTRATION_EXPORT: RegistrationQueue;
  SEASON_ID: string;
  GOOGLE_SYNC_MODE: string;
  GOOGLE_DRIVE_FOLDER_ID: string;
  GOOGLE_REGISTRATION_SHEET_ID: string;
  GOOGLE_LOCAL_DIR?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
}

export interface QueueMessage<T> {
  body: T;
  ack(): void;
  retry(): void;
}

export interface MessageBatch<T> {
  messages: QueueMessage<T>[];
}

export type GoogleSyncMode = "off" | "local" | "live";

export function googleSyncMode(value: string | undefined): GoogleSyncMode {
  if (value === "local" || value === "live") {
    return value;
  }
  return "off";
}
