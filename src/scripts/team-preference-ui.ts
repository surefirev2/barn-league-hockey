import {
  parseTeamPreference,
  type TeamPreference,
} from "../lib/team-preference";

const TEAM_CTA_SELECTOR = "[data-team-cta]";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markTeam(team: TeamPreference | null): void {
  document.querySelectorAll<HTMLElement>(TEAM_CTA_SELECTOR).forEach((el) => {
    const pressed = Boolean(team && el.dataset.teamCta === team);
    el.setAttribute("aria-pressed", String(pressed));
  });
}

function setTeamPreference(team: TeamPreference): void {
  const url = new URL(window.location.href);
  url.searchParams.set("team", team);
  url.hash = "register";
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  markTeam(team);
}

function scrollToRegister(): void {
  document.getElementById("register")?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

function onReady(): void {
  const params = new URLSearchParams(window.location.search);
  markTeam(parseTeamPreference(params.get("team")));

  document
    .querySelectorAll<HTMLAnchorElement>(TEAM_CTA_SELECTOR)
    .forEach((el) => {
      el.addEventListener("click", (event) => {
        const team = parseTeamPreference(el.dataset.teamCta);
        if (!team) {
          return;
        }
        event.preventDefault();
        setTeamPreference(team);
        scrollToRegister();
      });
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onReady);
} else {
  onReady();
}
