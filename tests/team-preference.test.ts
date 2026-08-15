import { describe, expect, it } from "vitest";
import {
  parseTeamPreference,
  TEAM_PREFERENCES,
} from "../src/lib/team-preference";

describe("parseTeamPreference", () => {
  it.each(TEAM_PREFERENCES)("accepts %s", (team) => {
    expect(parseTeamPreference(team)).toBe(team);
  });

  it("accepts mixed-case values", () => {
    expect(parseTeamPreference("Rockets")).toBe("rockets");
    expect(parseTeamPreference(" HORNETS ")).toBe("hornets");
  });

  it("returns null for invalid values", () => {
    expect(parseTeamPreference("penguins")).toBeNull();
    expect(parseTeamPreference("team=rockets")).toBeNull();
  });

  it("returns null when missing", () => {
    expect(parseTeamPreference(null)).toBeNull();
    expect(parseTeamPreference(undefined)).toBeNull();
    expect(parseTeamPreference("")).toBeNull();
    expect(parseTeamPreference("   ")).toBeNull();
  });
});
