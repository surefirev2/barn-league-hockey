# Barn League Hockey — Design System

Barn League Hockey is an adult recreational hockey league. Three founding teams — **Shockers**,
**Hornets**, **Rockets** — play Sundays at the **Palmerston Arena**, September 2026 through March
2027, with over 60 minutes of gameplay per game. It is built on 20+ years of hockey, friendship and
good competition, it welcomes goalies, full-season players and spares, and its sign-off is the whole
positioning in four words: **"We all work tomorrow."**

The league is not a product company. It has one public surface (a short one-page site) and a small
set of administrative documents (registration and insurance forms). This system is sized for exactly
that: enough primitives to build the page and the forms, and nothing else.

## Sources

Everything here was derived from five brand pieces the league supplied as JPEG images:

| File | What it is |
| --- | --- |
| `uploads/8310ab5d-2810-470d-b41c-3548961d3db3.jpeg` | Season recruitment poster — barn shield mark, season facts strip, "what to expect", fees |
| `uploads/f034f3b6-4d00-4ec9-8b2b-ca1c10f3d697.jpeg` | New player registration form — horizontal wordmark, deposit terms, contacts |
| `uploads/3da2fef2-789d-4300-bcff-b95b1a21575d.jpeg` | Shockers insurance registration form (navy / orange) |
| `uploads/23c96ca9-6fde-4c54-8a06-1f0c9082913f.jpeg` | Hornets insurance registration form (forest green / gold) |
| `uploads/273d930a-97d2-43b4-80c6-b3195dd3dbfb.jpeg` | Rockets insurance registration form (black / orange) |

No codebase, Figma file or font binaries were provided. There is no vector logo: the marks in
`assets/` are cropped from those images, so they are **raster only** and sit on dark backgrounds.
See "Open questions" at the bottom.

Contacts on the printed pieces: `barnleaguehockey@gmail.com` (general) and
`HughTylerShannon@gmail.com` (deposits).

---

## Content fundamentals

**Voice.** A guy who runs the league talking to guys who want to play in it. Plain, warm, a little
blunt. Never corporate, never markety, never precious about hockey.

**Person.** "We" for the league, "you" for the player. The league takes responsibility out loud:
*"We will consider requests when building teams, but cannot guarantee that players will be placed
together. Our priority is creating balanced and competitive teams."*

**Casing.** Display and label copy is **UPPERCASE**. Sentence-case is reserved for real paragraphs
and legal/acknowledgement text. Headlines are short caps phrases, not sentences:
*"ADULT REC HOCKEY LEAGUE"*, *"NEW PLAYER REGISTRATION FORM"*, *"WHAT TO EXPECT:"*.

**Rhythm.** The brand writes in triples and short fragments — *"Real hockey. Real people. Real
fun."*, *"Good hockey / Good people / Good laughs"*, *"3 founding teams. 1 league. Lots of great
hockey."* Punchlines land as a fragment on its own line.

**The house joke.** Self-aware, never mean: *"We all work tomorrow."*, *"and the stories after the
game are usually BETTER than the game itself!"* Use it once per page, at the end.

**Emphasis.** A single word or phrase flips to red inside an otherwise light line — *"1 LEAGUE."*,
*"BETTER than the game itself"*, *"YOUR SPOT IS NOT CONFIRMED UNTIL THE DEPOSIT IS RECEIVED."*
Never bold-and-red-and-italic at once; pick one.

**Numbers.** Written the short way: *$100 deposit*, *20+ years*, *over 60 minutes*, *September 2026
to 2027*. Dates in forms are always `YYYY-MM-DD`.

**Emoji: never.** The brand's punctuation is the ★ star and the ✔ tick, both taken from the
wordmark and the printed checklists. Question marks are used for warmth (*"Still love the game?"*)
and exclamation marks at most once per page.

**Accessibility of copy.** Field labels are literal and complete (*"Emergency contact phone
number"*), hints sit in parentheses in sentence case (*"(YYYY-MM-DD)"*, *"(if applicable)"*), and
nothing important is communicated by colour alone — the red emphasis lines always also read as
plain sentences.

---

## Visual foundations

**The idea.** Printed rink-board signage: a distressed cream (bone) on near-black, one loud red, and
heavy condensed caps. Everything looks screen-printed onto something physical — a barn wall, a board,
a paper form.

**Colour.** Three families plus team scopes.
- **Ink** `#08080A → #8A8B90` — page darks, borders, type on light.
- **Bone** `#FBF7F1 → #B4A794` — the distressed cream of the wordmark; `--bone-200` is the default
  page background, `--paper #F4F3F1` is the form-document white.
- **Red** `#4E0B0D → #EF4A48` — `--red-600 #C8161C` is the primary; `--red-400` is the *only* red
  used for text on ink (the darker reds fail contrast on black).
- **Teams** live in `[data-team]` scopes and flip `--color-primary`: Shockers navy `#0A1F44` +
  orange `#E85A0C`; Hornets green `#0F2A12` + gold `#F2C10D` (with ink text on gold); Rockets black
  `#101010` + orange `#E24A0B`. League red never appears inside a team block, and team colours never
  appear on league-level pages.
- **Max two background tones per page**: ink and bone. Sections alternate between them; the red is
  punctuation only, roughly 5–10% of any screen.

**Type.** Three families, applied strictly by role.
- `--font-display` **Anton** — uppercase only, leading `0.9`, every headline and card title.
- `--font-label` **Oswald** 600 — caps eyebrows, buttons, field labels, nav. Tracking `.09em`
  (`.14em` at micro sizes).
- `--font-body` **Barlow** — all sentence-case copy at `1rem/1.55`. Its **bold italic caps** is the
  slogan voice (*"STILL LOVE THE GAME?"*, *"WE ALL WORK TOMORROW."*).
- `--font-condensed` **Barlow Condensed** — standings, times, fine print, table data.
- Nothing on screen goes below `0.6875rem`, body copy never below `0.9375rem`, and paragraphs are
  capped at a 64-character measure.

**Layout.** 1180px container, 24px gutter, 4px spacing base, 80px section rhythm (128px for the hero
and the closing section). Grids and flex with `gap` everywhere. Full-bleed bands — photo strips, the
fact rail, the brush banners — break the container edge-to-edge and are what gives a short page its
pacing. The site header is the only fixed element: sticky, 72px, `rgba(8,8,10,.92)` with a 6px
backdrop blur (the only blur in the system, and the only transparency other than photo scrims).

**Backgrounds.** Flat ink or flat bone, plus three textures, never gradients-as-decoration:
1. rink photography (`assets/photo-*.jpg`), always behind a protection gradient;
2. `assets/texture-barn-wood.jpg` for narrow header bands;
3. the `--grain` SVG noise overlay (`.bl-grain`, 16% over ink / 7% over bone) — the one thing that
   carries the "grungy" register in a browser.
Bluish-purple gradients, glassmorphism and glow effects are out of the system.

**Imagery.** Cool, high-contrast, low-light arena photography: desaturated ~25%, contrast +8%,
brightness −14% (`filter: grayscale(.25) contrast(1.08) brightness(.86)`), so any photo reads as one
tonal family with the ink palette. Bone type never sits on an unscrimmed photo — use
`--scrim-bottom` (bottom-up), `--scrim-full` (left-to-right for hero splits), or `--scrim-flat`
(62% wash) as a *protection gradient*. Capsules behind text are not used; the scrim always is.

**Corners, borders, shadows.** Radii are 0–4px (`--radius-1: 2px` is the default); the only pill in
the system is `Tag`, plus the icon discs. Borders carry structure: 1px hairline `rgba(8,8,10,.14)`
for quiet dividers, 2px ink for plates and tick-boxes, 3–4px for emphasis rules. Shadows come in two
flavours — **hard offset plates** `3px 3px 0 rgba(8,8,10,.9)` for anything that should look printed
(buttons, plate cards), and one **soft card shadow** for white content cards. No inner shadows except
a 1px top inset on form fields.

**Cards.** Four looks: `default` (white, 3px radius, hairline border, soft shadow), `plate` (2px ink
border + hard offset shadow), `paper` (bone fill for stacked info blocks), `dark` (ink fill on photo
sections). Coloured left-border accents are explicitly not part of this system.

**Motion.** Short and mechanical: 110ms for state changes, 180ms for hover lifts, 320ms max, all on
`cubic-bezier(.2,.7,.3,1)`. No bounces, no parallax, no entrance animations, no scroll reveals.
`prefers-reduced-motion` kills what little there is.

**Hover / press.** Plates *nudge into their shadow*: hover moves the button 1px down-right and
shrinks the shadow to 2px; press seats it flat at 3px with no shadow and the darkest red. Cards lift
2–3px with the `--shadow-lift`. Ghost actions darken and underline (2px, 4px offset). Icon buttons
scale to `.94` on press. Nav links go red on hover, and the current section keeps a 3px red underline.

**Focus.** Always a visible `3px solid var(--red-500)` ring at 2px offset; form fields additionally
turn their border red with a soft red halo. Never removed.

**Disabled.** `opacity: .42`, shadow removed, no transform, `cursor: not-allowed`.

---

## Iconography

- **System:** Font Awesome 6 Free **Solid**, loaded from CDN
  (`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css`) and wrapped by
  the `Icon` component. **This is a substitution** — the printed pieces use solid single-weight
  pictographs (a barn, crossed sticks, a goalie mask, a handshake, a beer mug) that were never
  supplied as vectors. FA Solid matches the fill style and weight; the barn is `warehouse` and the
  goalie mask is `user-shield`. If the league has the original icon set, drop the SVGs into
  `assets/icons/` and repoint `Icon`.
- **Treatment:** either a bare glyph in bone/ink, or — the signature — a **red disc** (`IconButton
  variant="solid" shape="circle"`, 46px) with a bone glyph, exactly as the forms and poster use it.
  Inside a team scope the disc takes the team accent.
- **Vocabulary:** `calendar-days`, `warehouse`, `hockey-puck`, `user-shield`, `users`, `handshake`,
  `dollar-sign`, `envelope`, `phone`, `user`, `shield-halved`, `trophy`, `beer-mug-empty`,
  `circle-check`, `star`, `arrow-right`, `bars`, `file-lines`.
- **Unicode as icons:** two, both from the wordmark — `★` in dividers, slogans and footers, and `✔`
  inside the red tick discs (`Checklist`, `Checkbox`). No other dingbats.
- **Emoji:** never.
- Icons are never the only label for an action: `IconButton` requires a `label`, and fact rails pair
  every glyph with caps text.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import` lines only.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills wrapper so this system can be used from Claude Code.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css` (Google Fonts substitution), `colors.css`, `typography.css`,
`spacing.css`, `effects.css` (radii, borders, shadows, scrims, grain, motion), `teams.css`
(`[data-team]` scopes), `base.css` (element defaults, `.bl-eyebrow`, `.bl-grain`).

**`assets/`** — `logo-barn-shield.png` (primary mark), `logo-barn-league-hockey.png` (horizontal
wordmark), `team-shockers.png`, `team-hornets.png`, `team-rockets.png`, `photo-faceoff.jpg`,
`photo-stick-puck.jpg`, `photo-ice-crowd.jpg`, `texture-barn-wood.jpg`.

**`components/`** — 20 primitives in three groups. Each has `<Name>.jsx`, `<Name>.d.ts` and
`<Name>.prompt.md`; group styling lives in `core/core.css`, `forms/forms.css`,
`display/display.css`, all reached through `components/components.css`.

- `core/` — **Button**, **IconButton**, **Badge**, **Tag**, **Icon**
- `forms/` — **Field**, **Input**, **Textarea**, **Select**, **Checkbox**, **RadioGroup**,
  **FormSection**
- `display/` — **Card**, **SectionHeader**, **BrushBanner**, **StatRail**, **Checklist**,
  **TeamCrest**, **StarRule**, **PhotoBand**

*Intentional additions* (not present as named components in the source, added because the source
demands them): **Icon** — a wrapper so no one hand-draws the pictographs; **Field** — the label /
hint / error scaffold every printed form field implies; **StarRule** and **BrushBanner** — the two
decorative devices used on every piece, componentised so they stay consistent.

**`ui_kits/`**
- `website/` — the one-page marketing site (`index.html`, `site.css`, `SiteHeader`, `Hero`,
  `SeasonFacts`, `WhatToExpect`, `Teams`, `RegisterSection`, `SiteFooter`). See its README.
- `forms/` — web recreations of the new player and insurance forms, with team editions
  (`index.html`, `forms.css`, `FormMasthead`, `PlayerRegistration`, `InsuranceRegistration`).

**`templates/`** — three starting points consuming projects can copy: `landing-page/` (the one-scroll
public site), `player-registration/` (the `#register` form, eight sections, six acknowledgements,
success panel) and `insurance-form/` (letter-size insurance record with team letterhead). Each folder
has its own `ds-base.js` that links `styles.css` and `_ds_bundle.js`; repoint the `base` line when the
folder is copied into a consuming project.

**`guidelines/`** — 21 specimen cards feeding the Design System tab, grouped **Colors** (red, ink,
bone, semantic, team scopes), **Type** (display, labels, body, condensed, pairing in use),
**Spacing** (scale, layout, corners & borders, shadows) and **Brand** (marks, crests, photography,
grain, brush bands, icon vocabulary, interaction states).

---

## Open questions for the league

1. **No vector logo.** All marks are cropped from JPEGs, so they carry their original dark
   backgrounds and can't be recoloured or used small. Please send the original AI/EPS/SVG artwork
   (shield, wordmark, three crests).
2. **No font files.** Display type is substituted with **Anton**, labels with **Oswald**, body with
   **Barlow**. If the flyers were set in licensed faces, send the files and `tokens/fonts.css` can be
   swapped to real `@font-face` rules.
3. **Icons substituted** with Font Awesome 6 Solid (see Iconography).
4. **No real photography.** The three photos in `assets/` are cropped from the flyers and are low
   resolution — fine for cards, not for a hero at full width. Real rink photos from Palmerston would
   replace them one-for-one.
5. **Invented copy** is limited to the season-section lead and the three team blurbs in the website
   kit; both are flagged in `ui_kits/website/README.md`.
