import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import {
  ABILITY_LABELS,
  DEPOSIT_LABELS,
  HIGHEST_LEVEL_LABELS,
  PARTICIPATION_LABELS,
  POSITION_LABELS,
  TEAM_LETTERHEAD,
  TEAM_PATH_LABELS,
  type ValidatedRegistration,
} from "../registrations/schema";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const TEAM_COLORS = {
  rockets: rgb(0.875, 0.251, 0),
  shockers: rgb(0.945, 0.357, 0),
  hornets: rgb(0.91, 0.765, 0.094),
  individual: rgb(0.616, 0.102, 0.122),
} as const;

function decodePng(dataUrl: string): Uint8Array | null {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl);
  if (!match) {
    return null;
  }
  const binary = atob(match[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function drawHeader(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  id: string,
  payload: ValidatedRegistration,
): number {
  const color = TEAM_COLORS[payload.teamPreference];
  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - 36,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 3,
    color,
  });
  page.drawText(TEAM_LETTERHEAD[payload.teamPreference], {
    x: MARGIN,
    y: PAGE_HEIGHT - 58,
    size: 14,
    font: bold,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Registration ID: ${id}`, {
    x: MARGIN,
    y: PAGE_HEIGHT - 74,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
  return PAGE_HEIGHT - 96;
}

function drawLine(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  y: number,
  label: string,
  value: string,
): number {
  page.drawText(`${label}:`, {
    x: MARGIN,
    y,
    size: 10,
    font: bold,
    color: rgb(0, 0, 0),
  });
  const wrapped = wrap(value || "—", 86);
  let cursor = y;
  for (const line of wrapped) {
    page.drawText(line, {
      x: MARGIN + 130,
      y: cursor,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    cursor -= 14;
  }
  return cursor - 4;
}

function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines.length > 0 ? lines : ["—"];
}

export async function buildRegistrationPdf(options: {
  id: string;
  submittedAt: string;
  payload: ValidatedRegistration;
}): Promise<Uint8Array> {
  const { id, submittedAt, payload } = options;
  const doc = await PDFDocument.create();
  doc.setTitle(`Barn League Hockey registration ${id}`);
  doc.setSubject(id);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const page1 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = drawHeader(page1, font, bold, id, payload);
  const page1Fields: Array<[string, string]> = [
    ["Path", TEAM_PATH_LABELS[payload.teamPreference]],
    ["First name", payload.firstName],
    ["Last name", payload.lastName],
    ["Date of birth", payload.dateOfBirth],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Knows someone", payload.knowsSomeoneInLeague === "yes" ? "Yes" : "No"],
    ["Known players", payload.knownPlayerNames],
    ["Preferred teammates", payload.preferredTeammates],
    ["Highest level", HIGHEST_LEVEL_LABELS[payload.highestLevel]],
    ["Primary position", POSITION_LABELS[payload.primaryPosition]],
    [
      "Secondary position",
      payload.secondaryPosition
        ? POSITION_LABELS[payload.secondaryPosition]
        : "",
    ],
    ["Years played", payload.yearsPlayed],
    ["Time since regular", payload.timeSinceRegular],
    ["Ability", ABILITY_LABELS[payload.abilityRating]],
    ["Participation", PARTICIPATION_LABELS[payload.participation]],
    ["Spare interest", payload.spareInterest === "yes" ? "Yes" : "No"],
    ["Deposit", DEPOSIT_LABELS[payload.depositStatus]],
  ];
  for (const [label, value] of page1Fields) {
    y = drawLine(page1, font, bold, y, label, value);
  }

  const page2 = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = drawHeader(page2, font, bold, id, payload);
  const page2Fields: Array<[string, string]> = [
    ["Emergency name", payload.emergencyName],
    ["Relationship", payload.emergencyRelationship],
    ["Emergency phone", payload.emergencyPhone],
    ["Emergency email", payload.emergencyEmail],
    ["Address", payload.addressLine],
    ["City", payload.city],
    ["Province", payload.province],
    ["Postal code", payload.postalCode],
    ["Ack accuracy", "Yes"],
    ["Ack administration", "Yes"],
    ["Ack disclosure", "Yes"],
    ["Ack coverage", "Yes"],
    ["Ack risk", "Yes"],
    ["Ack balanced teams", "Yes"],
    ["Typed signature", payload.signatureName],
    ["Signed at", payload.signedAt || submittedAt],
    ["Submitted at", submittedAt],
  ];
  for (const [label, value] of page2Fields) {
    y = drawLine(page2, font, bold, y, label, value);
  }

  if (payload.signatureImage) {
    const pngBytes = decodePng(payload.signatureImage);
    if (pngBytes) {
      const image = await doc.embedPng(pngBytes);
      const width = 180;
      const height = (image.height / image.width) * width;
      page2.drawText("Drawn signature:", {
        x: MARGIN,
        y: y - 8,
        size: 10,
        font: bold,
        color: rgb(0, 0, 0),
      });
      page2.drawImage(image, {
        x: MARGIN + 130,
        y: y - height - 8,
        width,
        height,
      });
    }
  }

  return doc.save({ useObjectStreams: false });
}
