import { describe, expect, it } from "vitest";

describe("worker", () => {
  it("exports fetch", async () => {
    const mod = await import("../src/worker/index.ts");
    expect(typeof mod.default.fetch).toBe("function");
  });
});
