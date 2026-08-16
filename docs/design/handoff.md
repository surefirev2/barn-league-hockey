# Barn League Hockey — Design Handoff

**Status:** Draft for implementation
**Date:** 2026-08-15
**Surface:** One public page. One registration form. One generated PDF.

This document tells design and engineering how the public site should look, read, and collect registrations. Product requirements stay in [docs/roadmap/prd.md](../roadmap/prd.md). Architecture stays in [docs/roadmap/adr.md](../roadmap/adr.md).

Paper originals are archived in [source/](source/).

---

## 1. Job to be done

A player on a phone, or a parent/partner filling it in at the kitchen table, should be able to:

1. Understand what The Barn League is.
2. Pick **Rockets**, **Shockers**, **Hornets**, or **join as an individual**.
3. Complete every field required for rostering, insurance, and the $100 deposit.
4. Leave with a registration ID and a clear "what happens next."

League admins should later receive the same record as a PDF in the operator inbox. That pipeline is an ADR concern. This spec only defines the player-facing page and the data the form must capture.

---

## 2. Product shape

The public site is a **single scrolling page**, not a multi-page brochure.

| PRD page name | One-pager treatment |
|---|---|
| Home | Hero |
| League information | Facts + what to expect |
| Registration | `#register` section on the same page |
| Rules / sportsmanship | Compact "How we play" block |
| Contact | Footer + deposit instructions |

Do not add a CMS, player login, or a separate `/register` app shell. In-page anchors are enough.

```text
/?team=rockets#register
/?team=shockers#register
/?team=hornets#register
/?team=individual#register
/#register
```

Clicking a team card sets `team` in the query string, scrolls to `#register`, and selects that path in the form. The player can still change it.

---

## 3. Brand

### 3.1 League (page chrome, individual path, default PDF)

The flyer is the league face: barn red, cream type, charcoal ice, wood grain, distressed display type. Translate that into **marketing sections**. Do not put distressed textures behind form fields.

| Token | Hex | Use |
|---|---|---|
| `barn-red` | `#9D1A1F` | Primary CTA, selected states, emphasis |
| `barn-red-deep` | `#7F1610` | Footer bar, hover on primary |
| `cream` | `#F0E8DD` | Display type on dark, paper surfaces |
| `ink` | `#140C08` | Page background, body on cream |
| `charcoal` | `#1D1210` | Secondary surfaces |
| `wood` | `#7F7261` | Hairline rules, muted icons |
| `ice` | `#F7F4F0` | Form canvas |
| `danger` | `#AC1011` | Validation errors |

### 3.2 Founding teams (cards + selected form accent + PDF letterhead)

Same insurance form, three crests. On the web: one form, team color as an accent only.

| Team | Primary | Accent | On |
|---|---|---|---|
| **Rockets** | `#0A0A0A` black | `#DF4000` orange | Black card, orange type/rules |
| **Shockers** | `#021F4B` navy | `#F15B00` orange | Navy card, orange type/rules |
| **Hornets** | `#0F2111` forest | `#E8C318` gold | Forest card, gold type/rules |
| **Individual** | League ink | `barn-red` | League card, no fake fourth crest |

Do not invent a fourth team identity for unassigned players.

### 3.3 Type

| Role | Face | Notes |
|---|---|---|
| Display / hero | **Barlow Condensed** ExtraBold | Athletic condensed. Not Inter, Helvetica, or Impact. |
| Tagline | **Fraunces** Italic 600 | "Real hockey. Real people. Real fun." and "Still love the game?" |
| Body / UI | **Source Sans 3** 400/600 | Form labels, paragraphs, buttons |
| Data | Source Sans 3 with `font-variant-numeric: tabular-nums` | Dates, phone, registration ID |

Load from a font CDN or self-host. Display type may be slightly tracking-out on the hero (`letter-spacing: 0.04em`). Body stays normal tracking.

### 3.4 Texture and decoration

- Hero: full-bleed rink / barn-roof photo, dark scrim, grain at ~8% opacity.
- Section rules: thin cream or wood lines with a star separator, as on the flyer.
- Team cards: flat color fields, crest if we have vector art, otherwise type-led crests. No glassmorphism, no purple gradients, no blob shapes.
- Form: quiet. Light canvas, 1px ink/15% borders, no wood grain on inputs.

### 3.5 Motion

Minimal-functional. Smooth-scroll to `#register` (respect `prefers-reduced-motion`). 150–250ms color/border transitions on cards and the primary button. No scroll-jacking, no hero parallax that hides the CTA on mobile.

---

## 4. Page map

Sticky top bar on desktop: wordmark, in-page links (League, Teams, Register), contact email. On small screens: wordmark + a persistent **Register** button.

### 4.1 Hero

Dark photo. League crest (barn-door shield with crossed sticks) centered or left-aligned on desktop, stacked on mobile.

Copy, from the flyer, in this order:

- Eyebrow left: `Built on 20+ years of hockey, friendship & good competition.`
- Eyebrow right (desktop): `3 founding teams. 1 league. Lots of great hockey.`
- Title: `ADULT REC HOCKEY LEAGUE`
- Tagline: `Real hockey. Real people. Real fun.`
- Primary button: `Register to play` → `#register`
- Secondary text button: `Meet the teams` → `#teams`

Do not add a fake "Watch the reel" or stock-photo player mosaic.

### 4.2 League facts

A six-cell **scoreboard**, not a SaaS feature grid. Two columns on mobile, three on desktop. Line icons, cream type on charcoal.

| Icon | Copy |
|---|---|
| Calendar | Season starts September 2026, runs through March 2027 |
| Arena | Sundays at Palmerston Arena |
| Crossed sticks | Over 60 minutes of gameplay per game |
| Goalie mask | Goalies always welcome |
| People | Full-season players and spares welcome |
| Handshake | Join a founding team, or register as an individual |

### 4.3 How we play

Heading: `What to expect`

- Competitive, respectful, and fun environment
- All skill levels welcome
- Strong focus on sportsmanship
- A league built for people who love the game
- We all work tomorrow.

Fees, from the flyer:

> Affordable league fees. Final cost is determined by total registration.

Then one line on the deposit (details live in the form):

> A $100 e-transfer deposit holds your spot.

### 4.4 Teams (`#teams`)

Four equal cards.

| Card | Kicker | Title | Button |
|---|---|---|---|
| Rockets | Founding team | Rockets | Register for the Rockets |
| Shockers | Founding team | Shockers | Register for the Shockers |
| Hornets | Founding team | Hornets | Register for the Hornets |
| Individual | No team yet | Join as an individual | Place me on a team |

Under every founding-team button, 14px muted note:

> We'll take the request. Balanced teams come first, so placement is not a guarantee.

Individual card note:

> Tell us who you know. We'll slot you where the league needs you.

### 4.5 Register (`#register`)

See §5–§8.

### 4.6 Footer

Dark bar. Envelope + `barnleaguehockey@gmail.com`. Motto in Fraunces italic: `We all work tomorrow.` No social icons unless the league actually uses them.

---

## 5. Registration UX

One form. Four entry paths. The path is a required field named `teamPreference`.

```text
Rockets | Shockers | Hornets | Individual
```

Visual: a 2×2 segmented control on mobile, 4-up on desktop, using team colors for the selected segment.

**Do not split this into four forms or four PDFs.** The insurance PDFs in `source/` are the same form with different letterheads. Digitally, letterhead follows `teamPreference` at PDF time.

### 5.1 Layout

Form sits on `ice` inside a max-width ~720px column, centered. Section headers are small all-caps Source Sans 3 with a 3px team-accent rule on the left.

Section order:

1. Path (team or individual)
2. Player information
3. Emergency contact and address
4. Connections
5. Hockey experience
6. Availability
7. Deposit
8. Acknowledgements and signature

Progress is the section list itself, not a wizard. Do not paginate unless a usability test says the single scroll is failing on mobile. Default is one scroll.

### 5.2 Success

On `POST /api/registrations` success, replace the form with a confirmation panel:

- `You're in.`
- Registration ID in tabular numerals (the immutable ID from the ADR)
- Team path they chose
- If deposit is `pending`: repeat e-transfer instructions
- Contact: `barnleaguehockey@gmail.com`
- Link: `Register someone else` (resets the form)

Do **not** promise a confirmation email. Player confirmation email is deferred in the PRD. Everything the player needs must be on this screen.

---

## 6. Field dictionary

Sources: [player registration](source/form-player-registration.pdf) and the three [insurance forms](source/form-insurance-shockers.pdf). Combined into one submit. Storage names are suggestions for D1; the Worker may map them.

All fields required unless marked optional.

### 6.1 Path

| Name | UI | Values | Notes |
|---|---|---|---|
| `teamPreference` | Segmented control | `rockets` `shockers` `hornets` `individual` | Required. Pre-filled from `?team=` |

Insurance paper fields `Current Team` and `Team Role / Position` are **not** separate inputs. They are `teamPreference` and `primaryPosition`.

### 6.2 Player information

| Name | UI | Validation |
|---|---|---|
| `firstName` | Text | 1–80 chars |
| `lastName` | Text | 1–80 chars |
| `dateOfBirth` | Date | `YYYY-MM-DD`, adult (18+ on season start 2026-09-01) |
| `phone` | Tel | Required, store E.164 if parseable, else trimmed string |
| `email` | Email | Valid email |

Layout: first/last on one row, DOB/phone on one row, email full width.

### 6.3 Emergency contact and address

From the insurance form. Required for coverage.

| Name | UI | Validation |
|---|---|---|
| `emergencyName` | Text | 1–120 chars |
| `emergencyRelationship` | Text | 1–80 chars |
| `emergencyPhone` | Tel | Required |
| `emergencyEmail` | Email | Optional |
| `addressLine` | Text | 1–200 chars |
| `city` | Text | 1–80 chars |
| `province` | Text, default `ON` | 2–40 chars |
| `postalCode` | Text | Canadian `A1A 1A1` (accept with or without space, store canonical) |

Layout: name full width; relationship + phone on one row; email full width; address full width; city / province / postal on one row.

### 6.4 Connections

| Name | UI | Validation |
|---|---|---|
| `knowsSomeoneInLeague` | Yes / No | Required |
| `knownPlayerNames` | Text | Required if yes; hidden if no |
| `preferredTeammates` | Text | Optional |

Helper under preferred teammates (paper copy, lightly tightened):

> We'll consider requests. Balanced, competitive teams come first, so we can't guarantee placement.

### 6.5 Hockey experience

| Name | UI | Values |
|---|---|---|
| `highestLevel` | Single select | `learn_to_play` `house_rec` `select_rep` `junior_senior_college` |
| `primaryPosition` | Single select | `forward` `defence` `goaltender` `no_preference` |
| `secondaryPosition` | Single select | Same values, plus empty. Optional. |
| `yearsPlayed` | Text | Required, short (e.g. `12 years`) |
| `timeSinceRegular` | Text | Required, short (e.g. `2 seasons`) |
| `abilityRating` | Single select | `beginner` `recreational` `intermediate` `experienced` `advanced` |

Paper labels:

- Highest level: Learn to Play / Beginner; House League / Recreational; Select / Rep / Travel; Junior / Senior / College / Other
- Ability: Beginner; Recreational; Intermediate; Experienced; Advanced

Use radio groups, not dropdowns, so the full set is visible. Primary and secondary cannot be the same value unless both are `no_preference`.

### 6.6 Availability

| Name | UI | Values |
|---|---|---|
| `participation` | Single select | `every_week` `most_weeks` `half_season` `spare` |
| `spareInterest` | Yes / No | Required |

Paper labels for participation:

- Every week / Almost every week
- Most weeks
- Approximately half the season
- Occasional / Spare player

Spare question copy:

> Are you interested in being contacted as a spare when another team is short players?

### 6.7 Deposit

Payments are **out of scope** (PRD). The form still has to explain the $100 hold and record whether they already sent it.

| Name | UI | Values |
|---|---|---|
| `depositStatus` | Yes / Pending | Required. Labels: `Paid` / `Pending` |

Static copy in the section (not fields):

> **$100 deposit to secure your spot.**
> E-transfer $100 to `HughTylerShannon@gmail.com`.
> Use your full name as the e-transfer memo.

If `Pending`, the success screen repeats this. If `Paid`, success says the league will match the e-transfer to this registration ID.

### 6.8 Acknowledgements and signature

Show the five insurance statements as **individual required checkboxes**, then the registration accuracy line as a sixth. Do not hide them behind a single "I agree."

1. I confirm that the information provided on this form is accurate and complete.
2. I understand that this information will be used for league administration and to obtain insurance coverage for Barn League Hockey.
3. I authorize Barn League Hockey to collect, use, and disclose this information to our insurance provider as required for coverage.
4. I understand that insurance coverage is provided for registered players only and is subject to the terms and conditions of the league's insurance policy.
5. I agree to abide by all league rules and policies. I acknowledge that participation in hockey involves inherent risks of injury.
6. I understand this information will also be used to build balanced teams.

| Name | UI | Notes |
|---|---|---|
| `ackAccuracy` … `ackBalancedTeams` | Checkbox | All six required |
| `signatureName` | Text | Must match `firstName` + `lastName` ignoring extra whitespace and case |
| `signatureImage` | Canvas | Optional drawn signature, PNG, max ~200kb after compress |
| `signedAt` | Hidden | Set client-side ISO timestamp; server also stamps |

Submit label: `Submit registration`

Disable the button until the six acknowledgements are checked and required fields pass client validation. Still validate on the server.

---

## 7. Validation, abuse, and empty states

- Client validation on blur and on submit. Inline error text under the field, `barn-red`, no toast-only errors.
- Server repeats every rule. Never trust the client for age, email, or acknowledgements.
- Duplicate email in the same season: allow submit (families share devices) but the Worker may flag it. Do not silently drop the second registration. Exact duplicate policy can land in implementation; UI copy if rejected: `This email already has a registration for 2026-27. Email barnleaguehockey@gmail.com if you need a change.`
- Turnstile or equivalent on submit (PRD: basic abuse protection). Invisible if possible.
- Network failure: keep the form filled, show `We couldn't save that. Check your connection and try again.` Never clear the form on a 5xx.

---

## 8. Generated PDF

One PDF per successful registration (PRD). Combine the two paper forms into a single document.

Suggested pages:

1. **League registration** — path, player info, connections, experience, availability, deposit status, registration ID.
2. **Insurance** — player info, emergency/address, six acknowledgements, signature name, drawn signature if present, date.

Letterhead:

- Team path → that team's colors and name (`ROCKETS BARN LEAGUE HOCKEY`, etc.)
- Individual → league letterhead (`BARN LEAGUE HOCKEY`)

Attachment filename: `Last, First - {registrationId}.pdf`
Object in R2: identifier-first, season prefix.

The PDF is a legal-ish record, not a flyer. High contrast, no photo hero, no grain. Include the registration ID in the header of every page.

---

## 9. Content inventory (locked copy)

Use this copy unless a human edits it. Do not substitute generic sports-league marketing.

**Taglines**

- Still love the game? So do we.
- Real hockey. Real people. Real fun.
- We all work tomorrow.

**Value line (hero supporting, optional)**

From the player form, not the flyer:

- Good hockey. Good people. Good laughs. Friendly competition.
- And the stories after the game are usually better than the game itself.

**Contact**

- League: `barnleaguehockey@gmail.com`
- Deposit e-transfer: `HughTylerShannon@gmail.com`

**Instructional bar (form top)**

> Please complete all fields. This information helps us build balanced teams, communicate league information, and meet insurance requirements.

---

## 10. Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Small | < 640px | Sticky Register CTA. Team cards stack. Form single column. Hero type scales down, no truncated headlines. |
| Medium | 640–960px | Facts 2×3. Team cards 2×2. |
| Large | > 960px | Facts 6-across or 3×2. Team cards 4-across. Form stays 720px; page margins grow. |

Touch targets ≥ 44px. Radio/checkbox labels are the hit area, not the 16px control.

---

## 11. Accessibility

- One `h1`: the league title in the hero.
- Team names are visible text, not color alone. Selected path also has a check or `Selected` label.
- Form errors referenced with `aria-describedby`. Focus the first invalid field on failed submit.
- Contrast: cream on barn-red and cream on navy/forest/black must pass WCAG AA for large type. Body text is ink on ice, not cream on wood photo.
- Signature canvas has a keyboard alternative: the typed `signatureName` is sufficient to submit.

---

## 12. What this is not

Do not add, even if it would look finished:

- Payment processing (e-transfer is manual)
- Account creation
- Live schedule, standings, or roster pages
- Admin UI
- Player confirmation email
- A separate insurance form step
- CMS-managed pages
- Dark-mode toggle as a v1 requirement (the page is already dark marketing + light form)

---

## 13. Source artifacts

| File | What it is |
|---|---|
| [source/flyer-the-barn-league.pdf](source/flyer-the-barn-league.pdf) | League positioning, season facts, motto |
| [source/form-player-registration.pdf](source/form-player-registration.pdf) | Player, connections, experience, availability, deposit |
| [source/form-insurance-rockets.pdf](source/form-insurance-rockets.pdf) | Insurance fields + Rockets letterhead |
| [source/form-insurance-shockers.pdf](source/form-insurance-shockers.pdf) | Insurance fields + Shockers letterhead |
| [source/form-insurance-hornets.pdf](source/form-insurance-hornets.pdf) | Insurance fields + Hornets letterhead |

PNGs of the same art sit next to the PDFs.

---

## 14. Open questions

Implementation can start without these. Flag before launch.

1. Adult cutoff: 18 as of 2026-09-01, or a different date?
2. Keep the deposit inbox `HughTylerShannon@gmail.com`, or a league-only address?
3. Legal review of the six acknowledgement lines.
4. Do returning players need a "I already have a jersey / number" field? Not on paper today.
5. Vector crests: the attached art is raster. Someone still needs SVG wordmarks for the three teams and the league shield.
