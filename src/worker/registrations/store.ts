import type { Env } from "../env";
import {
  ABILITY_LABELS,
  DEPOSIT_LABELS,
  HIGHEST_LEVEL_LABELS,
  PARTICIPATION_LABELS,
  POSITION_LABELS,
  TEAM_PATH_LABELS,
  type ValidatedRegistration,
} from "./schema";

export type RegistrationRow = {
  id: string;
  season_id: string;
  submitted_at: string;
  team_preference: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  emergency_name: string;
  emergency_phone: string;
  city: string;
  postal_code: string;
  highest_level: string;
  primary_position: string;
  ability_rating: string;
  participation: string;
  spare_interest: string;
  deposit_status: string;
  payload_json: string;
  pdf_r2_key: string;
  drive_file_id: string | null;
  exported_at: string | null;
};

const INSERT_SQL = `INSERT INTO registrations (
  id, season_id, submitted_at, team_preference, first_name, last_name,
  date_of_birth, phone, email, emergency_name, emergency_phone, city,
  postal_code, highest_level, primary_position, ability_rating,
  participation, spare_interest, deposit_status, payload_json,
  pdf_r2_key, drive_file_id, exported_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export async function insertRegistration(
  env: Env,
  row: {
    id: string;
    seasonId: string;
    submittedAt: string;
    payload: ValidatedRegistration;
    pdfR2Key: string;
  },
): Promise<void> {
  const { payload } = row;
  await env.DB.prepare(INSERT_SQL)
    .bind(
      row.id,
      row.seasonId,
      row.submittedAt,
      payload.teamPreference,
      payload.firstName,
      payload.lastName,
      payload.dateOfBirth,
      payload.phone,
      payload.email,
      payload.emergencyName,
      payload.emergencyPhone,
      payload.city,
      payload.postalCode,
      payload.highestLevel,
      payload.primaryPosition,
      payload.abilityRating,
      payload.participation,
      payload.spareInterest,
      payload.depositStatus,
      JSON.stringify(payload),
      row.pdfR2Key,
      null,
      null,
    )
    .run();
}

export async function getRegistration(
  env: Env,
  id: string,
): Promise<RegistrationRow | null> {
  return env.DB.prepare("SELECT * FROM registrations WHERE id = ?")
    .bind(id)
    .first<RegistrationRow>();
}

export async function listSeasonRegistrations(
  env: Env,
  seasonId: string,
): Promise<RegistrationRow[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM registrations WHERE season_id = ? ORDER BY submitted_at ASC",
  )
    .bind(seasonId)
    .all<RegistrationRow>();
  return result.results;
}

export async function markExported(
  env: Env,
  id: string,
  driveFileId: string,
  exportedAt: string,
): Promise<void> {
  await env.DB.prepare(
    "UPDATE registrations SET drive_file_id = ?, exported_at = ? WHERE id = ?",
  )
    .bind(driveFileId, exportedAt, id)
    .run();
}

export function sheetRow(row: RegistrationRow): string[] {
  return [
    row.id,
    row.submitted_at,
    TEAM_PATH_LABELS[row.team_preference as keyof typeof TEAM_PATH_LABELS] ??
      row.team_preference,
    row.first_name,
    row.last_name,
    row.date_of_birth,
    row.phone,
    row.email,
    row.emergency_name,
    row.emergency_phone,
    row.city,
    row.postal_code,
    HIGHEST_LEVEL_LABELS[
      row.highest_level as keyof typeof HIGHEST_LEVEL_LABELS
    ] ?? row.highest_level,
    POSITION_LABELS[row.primary_position as keyof typeof POSITION_LABELS] ??
      row.primary_position,
    ABILITY_LABELS[row.ability_rating as keyof typeof ABILITY_LABELS] ??
      row.ability_rating,
    PARTICIPATION_LABELS[
      row.participation as keyof typeof PARTICIPATION_LABELS
    ] ?? row.participation,
    row.spare_interest,
    DEPOSIT_LABELS[row.deposit_status as keyof typeof DEPOSIT_LABELS] ??
      row.deposit_status,
    row.drive_file_id ?? "",
  ];
}
