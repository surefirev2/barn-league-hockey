import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ADULT_MIN_DOB } from "../src/worker/registrations/schema";
import {
  canonicalizePhone,
  canonicalizePostalCode,
  validateRegistration,
} from "../src/worker/registrations/validate";
import { validPayload } from "./fixtures/registration";

describe("registration field dictionary", () => {
  it("accepts a complete payload and canonicalizes postal + phone", () => {
    const result = validateRegistration(validPayload());
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.postalCode).toBe("N0G 2P0");
    expect(result.value.phone).toBe("+15195551234");
    expect(result.value.emergencyPhone).toBe("+15195559999");
    expect(result.value.email).toBe("sally@example.com");
    expect(result.value.province).toBe("ON");
  });

  it("accepts postal codes that already have a space", () => {
    expect(canonicalizePostalCode("K1A 0B1")).toBe("K1A 0B1");
    expect(canonicalizePostalCode("k1a0b1")).toBe("K1A 0B1");
  });

  it("stores unparseable phones as the trimmed original", () => {
    expect(canonicalizePhone("ext 12")).toBe("ext 12");
  });

  it("accepts players who turn 18 on season start", () => {
    const result = validateRegistration(
      validPayload({ dateOfBirth: ADULT_MIN_DOB }),
    );
    expect(result.ok).toBe(true);
  });

  it("rejects players younger than 18 on 2026-09-01", () => {
    const result = validateRegistration(
      validPayload({ dateOfBirth: "2008-09-02" }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((error) => error.field === "dateOfBirth")).toBe(
      true,
    );
  });

  it("rejects a signature that does not match first + last", () => {
    const result = validateRegistration(
      validPayload({ signatureName: "Sally B." }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((error) => error.field === "signatureName")).toBe(
      true,
    );
  });

  it("accepts signatures ignoring extra whitespace and case", () => {
    const result = validateRegistration(
      validPayload({ signatureName: "  sally   BROWN " }),
    );
    expect(result.ok).toBe(true);
  });

  it("requires all six acknowledgements", () => {
    const result = validateRegistration(validPayload({ ackRisk: false }));
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((error) => error.field === "ackRisk")).toBe(true);
  });

  it("requires known player names when the player knows someone", () => {
    const result = validateRegistration(
      validPayload({ knowsSomeoneInLeague: "yes", knownPlayerNames: "" }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(
      result.errors.some((error) => error.field === "knownPlayerNames"),
    ).toBe(true);
  });

  it("rejects the same primary and secondary position", () => {
    const result = validateRegistration(
      validPayload({
        primaryPosition: "forward",
        secondaryPosition: "forward",
      }),
    );
    expect(result.ok).toBe(false);
  });

  it("allows matching positions when both are no preference", () => {
    const result = validateRegistration(
      validPayload({
        primaryPosition: "no_preference",
        secondaryPosition: "no_preference",
      }),
    );
    expect(result.ok).toBe(true);
  });

  it("does not reject duplicate emails at the field-dictionary layer", () => {
    const first = validateRegistration(validPayload());
    const second = validateRegistration(
      validPayload({ firstName: "Sam", signatureName: "Sam Brown" }),
    );
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = validateRegistration(
      validPayload({ email: "not-an-email" }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.errors.some((error) => error.field === "email")).toBe(true);
  });
});

describe("D1 registrations migration", () => {
  it("creates named sheet columns plus payload_json and pdf_r2_key", () => {
    const sql = readFileSync("migrations/0001_registrations.sql", "utf8");
    expect(sql).toContain("CREATE TABLE registrations");
    expect(sql).toContain("payload_json");
    expect(sql).toContain("pdf_r2_key");
    expect(sql).toContain("drive_file_id");
    expect(sql).toContain("exported_at");
    expect(sql).toContain("season_id");
    expect(sql).not.toContain("UNIQUE");
  });
});
