import { TEAM_PREFERENCES } from "../../lib/team-preference";
import {
  ABILITY_RATINGS,
  ACK_FIELDS,
  ADULT_MIN_DOB,
  DEPOSIT_STATUSES,
  HIGHEST_LEVELS,
  MAX_SIGNATURE_BYTES,
  PARTICIPATION,
  POSITIONS,
  YES_NO,
  type AbilityRating,
  type DepositStatus,
  type FieldError,
  type HighestLevel,
  type Participation,
  type Position,
  type RegistrationInput,
  type ValidatedRegistration,
  type ValidationResult,
  type YesNo,
} from "./schema";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function trim(value: unknown): string {
  return asString(value).trim();
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isIn<T extends string>(
  value: string,
  allowed: readonly T[],
): value is T {
  return (allowed as readonly string[]).includes(value);
}

function isTruthyAck(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

function validIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function canonicalizePostalCode(value: string): string | null {
  const compact = value.toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(compact)) {
    return null;
  }
  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

export function canonicalizePhone(value: string): string {
  const trimmed = value.trim();
  if (trimmed === "") {
    return trimmed;
  }
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (plus && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  return trimmed;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function lengthInRange(
  value: string,
  min: number,
  max: number,
  field: string,
  errors: FieldError[],
  label: string,
): void {
  if (value.length < min || value.length > max) {
    errors.push({
      field,
      message: `${label} must be ${min}–${max} characters.`,
    });
  }
}

function decodeSignaturePng(dataUrl: string): Uint8Array | null {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(dataUrl);
  if (!match) {
    return null;
  }
  try {
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

export function validateRegistration(
  input: RegistrationInput,
): ValidationResult {
  const errors: FieldError[] = [];

  const teamPreference = trim(input.teamPreference).toLowerCase();
  if (!isIn(teamPreference, TEAM_PREFERENCES)) {
    errors.push({
      field: "teamPreference",
      message: "Pick a registration path.",
    });
  }

  const firstName = trim(input.firstName);
  const lastName = trim(input.lastName);
  lengthInRange(firstName, 1, 80, "firstName", errors, "First name");
  lengthInRange(lastName, 1, 80, "lastName", errors, "Last name");

  const dateOfBirth = trim(input.dateOfBirth);
  if (!validIsoDate(dateOfBirth)) {
    errors.push({
      field: "dateOfBirth",
      message: "Enter date of birth as YYYY-MM-DD.",
    });
  } else if (dateOfBirth > ADULT_MIN_DOB) {
    errors.push({
      field: "dateOfBirth",
      message: "Players must be 18 or older on 2026-09-01.",
    });
  }

  const phoneRaw = trim(input.phone);
  if (phoneRaw === "") {
    errors.push({ field: "phone", message: "Enter a phone number." });
  }
  const phone = canonicalizePhone(phoneRaw);

  const email = trim(input.email).toLowerCase();
  if (!validEmail(email)) {
    errors.push({ field: "email", message: "Enter a valid email address." });
  }

  const emergencyName = trim(input.emergencyName);
  const emergencyRelationship = trim(input.emergencyRelationship);
  const emergencyPhoneRaw = trim(input.emergencyPhone);
  lengthInRange(
    emergencyName,
    1,
    120,
    "emergencyName",
    errors,
    "Emergency contact name",
  );
  lengthInRange(
    emergencyRelationship,
    1,
    80,
    "emergencyRelationship",
    errors,
    "Relationship",
  );
  if (emergencyPhoneRaw === "") {
    errors.push({
      field: "emergencyPhone",
      message: "Enter an emergency phone number.",
    });
  }
  const emergencyPhone = canonicalizePhone(emergencyPhoneRaw);

  const emergencyEmail = trim(input.emergencyEmail).toLowerCase();
  if (emergencyEmail !== "" && !validEmail(emergencyEmail)) {
    errors.push({
      field: "emergencyEmail",
      message: "Enter a valid emergency contact email, or leave it blank.",
    });
  }

  const addressLine = trim(input.addressLine);
  const city = trim(input.city);
  const province = trim(input.province) || "ON";
  lengthInRange(addressLine, 1, 200, "addressLine", errors, "Mailing address");
  lengthInRange(city, 1, 80, "city", errors, "City");
  lengthInRange(province, 2, 40, "province", errors, "Province");

  const postalCode = canonicalizePostalCode(trim(input.postalCode));
  if (!postalCode) {
    errors.push({
      field: "postalCode",
      message: "Enter a Canadian postal code (A1A 1A1).",
    });
  }

  const knowsSomeoneInLeague = trim(input.knowsSomeoneInLeague).toLowerCase();
  if (!isIn(knowsSomeoneInLeague, YES_NO)) {
    errors.push({
      field: "knowsSomeoneInLeague",
      message: "Tell us whether you know someone in the league.",
    });
  }
  const knownPlayerNames = trim(input.knownPlayerNames);
  if (knowsSomeoneInLeague === "yes" && knownPlayerNames === "") {
    errors.push({
      field: "knownPlayerNames",
      message: "List the player(s) you know.",
    });
  }
  const preferredTeammates = trim(input.preferredTeammates);

  const highestLevel = trim(input.highestLevel);
  if (!isIn(highestLevel, HIGHEST_LEVELS)) {
    errors.push({
      field: "highestLevel",
      message: "Select the highest level played.",
    });
  }

  const primaryPosition = trim(input.primaryPosition);
  if (!isIn(primaryPosition, POSITIONS)) {
    errors.push({
      field: "primaryPosition",
      message: "Select a primary position.",
    });
  }

  const secondaryRaw = trim(input.secondaryPosition);
  let secondaryPosition: Position | "" = "";
  if (secondaryRaw !== "") {
    if (!isIn(secondaryRaw, POSITIONS)) {
      errors.push({
        field: "secondaryPosition",
        message: "Select a valid secondary position, or leave it blank.",
      });
    } else {
      secondaryPosition = secondaryRaw;
      if (
        isIn(primaryPosition, POSITIONS) &&
        secondaryPosition === primaryPosition &&
        primaryPosition !== "no_preference"
      ) {
        errors.push({
          field: "secondaryPosition",
          message:
            "Secondary position must differ from primary, unless both are no preference.",
        });
      }
    }
  }

  const yearsPlayed = trim(input.yearsPlayed);
  const timeSinceRegular = trim(input.timeSinceRegular);
  lengthInRange(yearsPlayed, 1, 80, "yearsPlayed", errors, "Years played");
  lengthInRange(
    timeSinceRegular,
    1,
    80,
    "timeSinceRegular",
    errors,
    "Time since regular play",
  );

  const abilityRating = trim(input.abilityRating);
  if (!isIn(abilityRating, ABILITY_RATINGS)) {
    errors.push({
      field: "abilityRating",
      message: "Select your current ability.",
    });
  }

  const participation = trim(input.participation);
  if (!isIn(participation, PARTICIPATION)) {
    errors.push({
      field: "participation",
      message: "Select how often you plan to play.",
    });
  }

  const spareInterest = trim(input.spareInterest).toLowerCase();
  if (!isIn(spareInterest, YES_NO)) {
    errors.push({
      field: "spareInterest",
      message: "Tell us whether you want spare-player contact.",
    });
  }

  const depositStatus = trim(input.depositStatus).toLowerCase();
  if (!isIn(depositStatus, DEPOSIT_STATUSES)) {
    errors.push({ field: "depositStatus", message: "Select Paid or Pending." });
  }

  for (const field of ACK_FIELDS) {
    if (!isTruthyAck(input[field])) {
      errors.push({
        field,
        message: "All six acknowledgements are required.",
      });
    }
  }

  const signatureName = trim(input.signatureName);
  if (signatureName === "") {
    errors.push({
      field: "signatureName",
      message: "Type your full name to sign.",
    });
  } else if (
    firstName !== "" &&
    lastName !== "" &&
    normalizeName(signatureName) !== normalizeName(`${firstName} ${lastName}`)
  ) {
    errors.push({
      field: "signatureName",
      message: "Signature must match first and last name.",
    });
  }

  const signatureImage = trim(input.signatureImage);
  if (signatureImage !== "") {
    const bytes = decodeSignaturePng(signatureImage);
    if (!bytes) {
      errors.push({
        field: "signatureImage",
        message: "Drawn signature must be a PNG.",
      });
    } else if (bytes.byteLength > MAX_SIGNATURE_BYTES) {
      errors.push({
        field: "signatureImage",
        message: "Drawn signature is too large.",
      });
    }
  }

  const signedAt = trim(input.signedAt);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const value: ValidatedRegistration = {
    teamPreference: teamPreference as ValidatedRegistration["teamPreference"],
    firstName,
    lastName,
    dateOfBirth,
    phone,
    email,
    emergencyName,
    emergencyRelationship,
    emergencyPhone,
    emergencyEmail,
    addressLine,
    city,
    province,
    postalCode: postalCode as string,
    knowsSomeoneInLeague: knowsSomeoneInLeague as YesNo,
    knownPlayerNames,
    preferredTeammates,
    highestLevel: highestLevel as HighestLevel,
    primaryPosition: primaryPosition as Position,
    secondaryPosition,
    yearsPlayed,
    timeSinceRegular,
    abilityRating: abilityRating as AbilityRating,
    participation: participation as Participation,
    spareInterest: spareInterest as YesNo,
    depositStatus: depositStatus as DepositStatus,
    ackAccuracy: true,
    ackAdminUse: true,
    ackDisclosure: true,
    ackCoverage: true,
    ackRisk: true,
    ackBalancedTeams: true,
    signatureName,
    signatureImage,
    signedAt,
  };

  return { ok: true, value };
}
