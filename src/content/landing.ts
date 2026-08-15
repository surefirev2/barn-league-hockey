import type { TeamPreference } from "../lib/team-preference";

export const landing = {
  title: "ADULT REC HOCKEY LEAGUE",
  tagline: "Real hockey. Real people. Real fun.",
  stillLove: "Still love the game? So do we.",
  motto: "We all work tomorrow.",
  storiesBefore: "The stories after the game are usually ",
  storiesAccent: "better",
  storiesAfter: " than the game itself.",
  email: "barnleaguehockey@gmail.com",
  depositInbox: "HughTylerShannon@gmail.com",
  eyebrows: {
    left: "Built on 20+ years of hockey, friendship & good competition.",
    right: "3 founding teams. 1 league. Lots of great hockey.",
  },
  cta: {
    register: "Register to play",
    meetTeams: "Meet the teams",
    startForm: "Start the form",
    headerRegister: "Register",
  },
  skipLink: "Skip to registration",
  facts: [
    {
      icon: "fa-calendar-days",
      eyebrow: "Season",
      headline: "Sept 2026 – Mar 2027",
      note: "Season starts September 2026, runs through March 2027",
    },
    {
      icon: "fa-warehouse",
      eyebrow: "Game day",
      headline: "Sundays",
      note: "Sundays at Palmerston Arena",
    },
    {
      icon: "fa-hockey-puck",
      eyebrow: "Ice time",
      headline: "Over 60 minutes",
      note: "Over 60 minutes of gameplay per game",
    },
    {
      icon: "fa-user-shield",
      eyebrow: "Between the pipes",
      headline: "Goalies always welcome",
      note: "Goalies always welcome",
    },
    {
      icon: "fa-users",
      eyebrow: "Roster",
      headline: "Players & spares",
      note: "Full-season players and spares welcome",
    },
    {
      icon: "fa-handshake",
      eyebrow: "Sign up",
      headline: "Team or solo",
      note: "Join a founding team, or register as an individual",
    },
  ],
  bands: {
    arena: "Sundays at Palmerston Arena",
    handshake: "Strong focus on sportsmanship",
    faceoff: "Still love the game? So do we.",
  },
  expect: {
    eyebrow: "How we play",
    heading: "What to expect",
    items: [
      "Competitive, respectful, and fun environment",
      "All skill levels welcome",
      "Strong focus on sportsmanship",
      "A league built for people who love the game",
      "We all work tomorrow.",
    ],
    feesHeading: "League fees",
    fees: "Affordable league fees. Final cost is determined by total registration.",
    deposit: "A $100 e-transfer deposit holds your spot.",
  },
  teams: {
    eyebrow: "Choose your path",
    heading: "Meet the teams",
    foundingNote:
      "We'll take the request. Balanced teams come first, so placement is not a guarantee.",
    individualNote:
      "Tell us who you know. We'll slot you where the league needs you.",
    paths: [
      {
        id: "rockets" as const,
        kicker: "Founding team",
        title: "Rockets",
        button: "Register for the Rockets",
        founding: true,
      },
      {
        id: "shockers" as const,
        kicker: "Founding team",
        title: "Shockers",
        button: "Register for the Shockers",
        founding: true,
      },
      {
        id: "hornets" as const,
        kicker: "Founding team",
        title: "Hornets",
        button: "Register for the Hornets",
        founding: true,
      },
      {
        id: "individual" as const,
        kicker: "No team yet",
        title: "Join as an individual",
        button: "Place me on a team",
        founding: false,
      },
    ],
  },
  register: {
    eyebrow: "One form, four paths",
    heading: "Register to play",
    intro:
      "Please complete all fields. This information helps us build balanced teams, communicate league information, and meet insurance requirements.",
    pathLabels: {
      rockets: "Rockets",
      shockers: "Shockers",
      hornets: "Hornets",
      individual: "Individual",
    } satisfies Record<TeamPreference, string>,
    deposit:
      "A $100 e-transfer deposit holds your spot. Send it to HughTylerShannon@gmail.com with your full name as the memo.",
  },
  footer: {
    eyebrow: "Questions or ready to join?",
    meta: "★ Barn League Hockey · Palmerston Arena · 2026–27",
  },
} as const;
