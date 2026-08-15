export const TEAM_PREFERENCES = [
  "rockets",
  "shockers",
  "hornets",
  "individual",
] as const;

export type TeamPreference = (typeof TEAM_PREFERENCES)[number];

export function parseTeamPreference(
  value: string | null | undefined,
): TeamPreference | null {
  if (value == null) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "") {
    return null;
  }

  return (TEAM_PREFERENCES as readonly string[]).includes(normalized)
    ? (normalized as TeamPreference)
    : null;
}
