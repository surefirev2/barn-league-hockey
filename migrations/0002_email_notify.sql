ALTER TABLE registrations RENAME COLUMN exported_at TO emailed_at;
ALTER TABLE registrations DROP COLUMN drive_file_id;
