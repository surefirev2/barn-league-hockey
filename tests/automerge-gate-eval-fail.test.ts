import { describe, expect, it } from "vitest";

/** Temporary intentional failure for automerge-gate evaluation — remove after eval. */
describe("automerge-gate evaluation", () => {
  it("intentionally fails so auto-merge stays blocked", () => {
    expect(true).toBe(false);
  });
});
