import { ulid } from "ulid";

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export function newRegistrationId(): string {
  return ulid();
}

export function isUlid(value: string): boolean {
  return ULID_PATTERN.test(value);
}
