import type { Env } from "../env";
import type { ValidatedRegistration } from "./schema";

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
  emailed_at: string | null;
};

const INSERT_SQL = `INSERT INTO registrations (
  id, season_id, submitted_at, team_preference, first_name, last_name,
  date_of_birth, phone, email, emergency_name, emergency_phone, city,
  postal_code, highest_level, primary_position, ability_rating,
  participation, spare_interest, deposit_status, payload_json,
  pdf_r2_key
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

export async function markEmailed(
  env: Env,
  id: string,
  emailedAt: string,
): Promise<void> {
  await env.DB.prepare("UPDATE registrations SET emailed_at = ? WHERE id = ?")
    .bind(emailedAt, id)
    .run();
}
