CREATE TABLE registrations (
  id TEXT PRIMARY KEY,
  season_id TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  team_preference TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  emergency_name TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  highest_level TEXT NOT NULL,
  primary_position TEXT NOT NULL,
  ability_rating TEXT NOT NULL,
  participation TEXT NOT NULL,
  spare_interest TEXT NOT NULL,
  deposit_status TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  pdf_r2_key TEXT NOT NULL,
  drive_file_id TEXT,
  exported_at TEXT
);

CREATE INDEX idx_registrations_season ON registrations (season_id);
CREATE INDEX idx_registrations_season_email ON registrations (season_id, email);
