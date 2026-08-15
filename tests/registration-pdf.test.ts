import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { buildRegistrationPdf } from "../src/worker/pdf/registration-pdf";
import { validRegistration } from "./fixtures/registration";

function decodeUtf16Be(buf: Buffer): string {
  const start = buf[0] === 0xfe && buf[1] === 0xff ? 2 : 0;
  const chars: string[] = [];
  for (let i = start; i + 1 < buf.length; i += 2) {
    chars.push(String.fromCharCode((buf[i] << 8) | buf[i + 1]));
  }
  return chars.join("");
}

function decodePdfHex(text: string): string {
  let decoded = text;
  for (const match of text.matchAll(/<([0-9A-Fa-f]+)>/g)) {
    const hex = match[1];
    try {
      const buf = Buffer.from(hex, "hex");
      decoded +=
        hex.startsWith("FEFF") || hex.startsWith("feff")
          ? decodeUtf16Be(buf)
          : buf.toString("latin1");
    } catch {
      // ignore malformed hex
    }
  }
  return decoded;
}

function pdfPayload(bytes: Uint8Array): string {
  const latin1 = Buffer.from(bytes).toString("latin1");
  const parts = [latin1];
  const startMark = "stream\n";
  const endMark = "\nendstream";
  let cursor = 0;
  while (cursor < bytes.length) {
    const start = latin1.indexOf(startMark, cursor);
    if (start === -1) {
      break;
    }
    const dataStart = start + startMark.length;
    const end = latin1.indexOf(endMark, dataStart);
    if (end === -1) {
      break;
    }
    try {
      parts.push(inflateSync(bytes.subarray(dataStart, end)).toString("utf8"));
    } catch {
      // xref and other streams may not be zlib
    }
    cursor = end + endMark.length;
  }
  return decodePdfHex(parts.join("\n"));
}

describe("registration PDF", () => {
  it("writes a 2-page PDF whose bytes include the %PDF header and registration ID", async () => {
    const id = "01KZZREGISTRATIONTEST0001";
    const bytes = await buildRegistrationPdf({
      id,
      submittedAt: "2026-08-15T19:00:00.000Z",
      payload: validRegistration(),
    });
    const ascii = Buffer.from(bytes).toString("latin1");
    expect(ascii.startsWith("%PDF")).toBe(true);
    const text = pdfPayload(bytes);
    expect(text).toContain(id);
    expect(text).toContain("ROCKETS BARN LEAGUE HOCKEY");
    expect(text).toContain("Sally");
    expect(text).toContain("Brown");
  });
});
