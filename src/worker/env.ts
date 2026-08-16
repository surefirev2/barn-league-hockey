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

export interface EmailAttachment {
  content: string | ArrayBuffer | ArrayBufferView;
  filename: string;
  type: string;
  disposition: "attachment" | "inline";
  contentId?: string;
}

export interface SendEmail {
  send(message: {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: EmailAttachment[];
  }): Promise<{ messageId: string }>;
}

export interface Env {
  ASSETS?: { fetch(request: Request): Promise<Response> };
  DB: { prepare(query: string): D1PreparedStatement };
  REGISTRATION_PDFS: RegistrationR2;
  REGISTRATION_EXPORT: RegistrationQueue;
  EMAIL: SendEmail;
  SEASON_ID: string;
  REGISTRATION_NOTIFY_EMAIL: string;
  REGISTRATION_FROM_EMAIL: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ADMIN_READ_TOKEN?: string;
}

export interface QueueMessage<T> {
  body: T;
  ack(): void;
  retry(): void;
}

export interface MessageBatch<T> {
  messages: QueueMessage<T>[];
}
