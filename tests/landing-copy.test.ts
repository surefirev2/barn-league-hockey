import { describe, expect, it } from "vitest";
import { landing } from "../src/content/landing";

describe("landing copy", () => {
  it("keeps the locked title and tagline", () => {
    expect(landing.title).toBe("ADULT REC HOCKEY LEAGUE");
    expect(landing.tagline).toBe("Real hockey. Real people. Real fun.");
  });

  it("keeps league and deposit inboxes", () => {
    expect(landing.email).toBe("barnleaguehockey@gmail.com");
    expect(landing.depositInbox).toBe("HughTylerShannon@gmail.com");
    expect(landing.register.deposit).toContain(landing.depositInbox);
  });

  it("keeps the four registration path labels", () => {
    expect(landing.register.pathLabels).toEqual({
      rockets: "Rockets",
      shockers: "Shockers",
      hornets: "Hornets",
      individual: "Individual",
    });
  });
});
