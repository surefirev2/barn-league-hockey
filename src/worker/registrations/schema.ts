import {
  TEAM_PREFERENCES,
  type TeamPreference,
} from "../../lib/team-preference";

export const SEASON_START_DATE = "2026-09-01";
export const ADULT_MIN_DOB = "2008-09-01";
export const MAX_SIGNATURE_BYTES = 200 * 1024;

export const HIGHEST_LEVELS = [
  "learn_to_play",
  "house_rec",
  "select_rep",
  "junior_senior_college",
] as const;

export const POSITIONS = [
  "forward",
  "defence",
  "goaltender",
  "no_preference",
] as const;

export const ABILITY_RATINGS = [
  "beginner",
  "recreational",
  "intermediate",
  "experienced",
  "advanced",
] as const;

export const PARTICIPATION = [
  "every_week",
  "most_weeks",
  "half_season",
  "spare",
] as const;

export const YES_NO = ["yes", "no"] as const;
export const DEPOSIT_STATUSES = ["paid", "pending"] as const;

export const ACK_FIELDS = [
  "ackAccuracy",
  "ackAdminUse",
  "ackDisclosure",
  "ackCoverage",
  "ackRisk",
  "ackBalancedTeams",
] as const;

export type HighestLevel = (typeof HIGHEST_LEVELS)[number];
export type Position = (typeof POSITIONS)[number];
export type AbilityRating = (typeof ABILITY_RATINGS)[number];
export type Participation = (typeof PARTICIPATION)[number];
export type YesNo = (typeof YES_NO)[number];
export type DepositStatus = (typeof DEPOSIT_STATUSES)[number];
export type AckField = (typeof ACK_FIELDS)[number];

export const TEAM_PATH_LABELS: Record<TeamPreference, string> = {
  rockets: "Rockets",
  shockers: "Shockers",
  hornets: "Hornets",
  individual: "Individual",
};

export const TEAM_LETTERHEAD: Record<TeamPreference, string> = {
  rockets: "ROCKETS BARN LEAGUE HOCKEY",
  shockers: "SHOCKERS BARN LEAGUE HOCKEY",
  hornets: "HORNETS BARN LEAGUE HOCKEY",
  individual: "BARN LEAGUE HOCKEY",
};

export const HIGHEST_LEVEL_LABELS: Record<HighestLevel, string> = {
  learn_to_play: "Learn to Play / Beginner",
  house_rec: "House League / Recreational",
  select_rep: "Select / Rep / Travel",
  junior_senior_college: "Junior / Senior / College / Other",
};

export const POSITION_LABELS: Record<Position, string> = {
  forward: "Forward",
  defence: "Defence",
  goaltender: "Goaltender",
  no_preference: "No preference",
};

export const ABILITY_LABELS: Record<AbilityRating, string> = {
  beginner: "Beginner",
  recreational: "Recreational",
  intermediate: "Intermediate",
  experienced: "Experienced",
  advanced: "Advanced",
};

export const PARTICIPATION_LABELS: Record<Participation, string> = {
  every_week: "Every week / Almost every week",
  most_weeks: "Most weeks",
  half_season: "Approximately half the season",
  spare: "Occasional / Spare player",
};

export const DEPOSIT_LABELS: Record<DepositStatus, string> = {
  paid: "Paid",
  pending: "Pending",
};

export type RegistrationInput = {
  teamPreference?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  dateOfBirth?: unknown;
  phone?: unknown;
  email?: unknown;
  emergencyName?: unknown;
  emergencyRelationship?: unknown;
  emergencyPhone?: unknown;
  emergencyEmail?: unknown;
  addressLine?: unknown;
  city?: unknown;
  province?: unknown;
  postalCode?: unknown;
  knowsSomeoneInLeague?: unknown;
  knownPlayerNames?: unknown;
  preferredTeammates?: unknown;
  highestLevel?: unknown;
  primaryPosition?: unknown;
  secondaryPosition?: unknown;
  yearsPlayed?: unknown;
  timeSinceRegular?: unknown;
  abilityRating?: unknown;
  participation?: unknown;
  spareInterest?: unknown;
  depositStatus?: unknown;
  ackAccuracy?: unknown;
  ackAdminUse?: unknown;
  ackDisclosure?: unknown;
  ackCoverage?: unknown;
  ackRisk?: unknown;
  ackBalancedTeams?: unknown;
  signatureName?: unknown;
  signatureImage?: unknown;
  signedAt?: unknown;
  turnstileToken?: unknown;
};

export type ValidatedRegistration = {
  teamPreference: TeamPreference;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyEmail: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  knowsSomeoneInLeague: YesNo;
  knownPlayerNames: string;
  preferredTeammates: string;
  highestLevel: HighestLevel;
  primaryPosition: Position;
  secondaryPosition: Position | "";
  yearsPlayed: string;
  timeSinceRegular: string;
  abilityRating: AbilityRating;
  participation: Participation;
  spareInterest: YesNo;
  depositStatus: DepositStatus;
  ackAccuracy: true;
  ackAdminUse: true;
  ackDisclosure: true;
  ackCoverage: true;
  ackRisk: true;
  ackBalancedTeams: true;
  signatureName: string;
  signatureImage: string;
  signedAt: string;
};

export type FieldError = {
  field: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; value: ValidatedRegistration }
  | { ok: false; errors: FieldError[] };

export { TEAM_PREFERENCES };
export type { TeamPreference };

export function pdfR2Key(seasonId: string, id: string): string {
  return `registrations/${seasonId}/${id}.pdf`;
}

export function pdfFilename(
  lastName: string,
  firstName: string,
  id: string,
): string {
  const last = lastName.replace(/[/\\]/g, " ").trim();
  const first = firstName.replace(/[/\\]/g, " ").trim();
  return `${last}, ${first} - ${id}.pdf`;
}
