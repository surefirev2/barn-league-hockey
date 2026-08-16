# ADR: Adult Hockey League Website Platform Architecture

**Status:** Accepted
**Date:** 2026-08-15

## Context

The adult hockey league requires a small public website whose primary characteristics are:

- predominantly static content;
- simple maintenance;
- Git as the source of truth for website content and application code;
- GitHub-based CI/CD;
- Cloudflare hosting;
- player registration;
- generation of one PDF registration record per player;
- an operator email of each registration PDF after persist.

The application is deliberately not intended to become a conventional server-rendered web application, CMS, SPA, or administration platform.

Infrastructure should be proportionate to the problem while leaving reasonable seams for future additions.

## Decision

The application will use:

| Concern | Decision |
|---|---|
| Static site generator | Astro |
| Application runtime | Cloudflare Worker |
| Static hosting | Cloudflare Workers Static Assets |
| Structured registration storage | Cloudflare D1 |
| Authoritative PDF storage | Cloudflare R2 |
| PDF generation | `pdf-lib` |
| Asynchronous notify | Cloudflare Queues |
| Operator PDF delivery | Cloudflare Email Sending |
| Source control | GitHub |
| CI/CD | GitHub Actions + Wrangler |
| Production deployment trigger | Merge/push to `main` |
| Local Cloudflare environment | Wrangler/Miniflare/workerd |
| CMS | None |
| Admin application | None |
| SSR | None unless a future requirement explicitly requires it |

Cloudflare recommends Workers Static Assets rather than Pages for new static/full-stack projects. Worker code and static assets can be deployed together as one unit, while asset requests are handled by the static asset infrastructure.

Astro will operate as a **static site generator only**. Astro does not require its Cloudflare adapter when used solely for static-site generation.

## Architectural Principle

The system has two layers:

```text
                    AUTHORITATIVE
             ┌────────────────────────┐
             │      Cloudflare        │
             │                        │
             │   D1          R2       │
             │ registration   PDFs    │
             └──────────┬─────────────┘
                        │
                     Queue
                        │
                        ▼
                    PROJECTION
             ┌────────────────────────┐
             │ Cloudflare Email       │
             │ Sending                │
             │                        │
             │ PDF to operator inbox  │
             └────────────────────────┘
```

**D1 and R2 are the system of record.**

Email is an operational projection for humans.

The application must be able to resend the PDF from D1 and R2 without loss of authoritative data.

Email Sending must therefore never be required to successfully complete a player registration.

## Static Site Architecture

Astro builds the public site into static HTML/CSS/assets:

```text
src/
├── pages/
├── components/
├── layouts/
└── content/

             │
        astro build
             │
             ▼

dist/
├── index.html
├── register/
│   └── index.html
├── rules/
│   └── index.html
├── css/
└── assets/
```

The Cloudflare Worker deployment includes `dist/` as Workers Static Assets.

Only API routes should execute application code:

```text
GET  /                    → static
GET  /rules/              → static
GET  /registration/       → static
GET  /assets/...          → static

POST /api/registrations   → Worker
```

The boundary between the static site and Worker should remain explicit.

Adding a new informational page should ordinarily require **zero backend work**.

## Registration Write Path

Conceptually:

```text
POST /api/registrations
          │
          ▼
      Validate
          │
          ▼
 Assign registration ID
          │
          ▼
     Generate PDF
       pdf-lib
          │
       ┌──┴──┐
       ▼     ▼
      D1     R2
       │     │
       └──┬──┘
          │
      Complete
          │
          ├──────────────► success response
          │
          └──────────────► notify queue
```

A registration is considered complete when its authoritative D1 record and R2 PDF have been successfully persisted.

Email notify is explicitly outside this success boundary.

Exact form fields, waiver semantics, signatures, duplicate-registration policy, validation rules, confirmation UX, and similar concerns are implementation details rather than architectural decisions.

## PDF Storage

`pdf-lib` will generate registration PDFs inside the Worker.

R2 contains the canonical copy.

A deterministic hierarchy should be used, for example:

```text
registrations/
└── 2026-27/
    ├── 01K....pdf
    ├── 01K....pdf
    └── 01K....pdf
```

Object names should primarily use immutable registration identifiers rather than human names.

The player's name may be included for convenience, but uniqueness must not depend upon it.

The R2 bucket remains private.

## Email Sending Projection

After authoritative persist, a queue consumer emails the R2 PDF to the configured operator address.

Attachment filenames are optimized for humans:

```text
Smith, Bob - 01K....pdf
Brown, Sally - 01K....pdf
```

The immutable registration ID remains in the filename and email subject for reconciliation.

From: `registrations@barnleaguehockey.ca` (must belong to an onboarded Email Service domain).
To: the operator inbox (`REGISTRATION_NOTIFY_EMAIL`).

The Worker authenticates via the `send_email` binding. No Google credentials.

## Operator list

The Google Sheet is not part of this system. Operators list the current season from D1:

```text
GET /api/admin/registrations
GET /api/admin/registrations/:id/pdf
```

A future CSV or `.xlsx` export can be generated from D1 if desired.

## Asynchronous Notify

A successful registration places a small message onto a Cloudflare Queue:

```json
{
  "registrationId": "01K..."
}
```

The message does **not** need to contain the full registration or PDF.

The consumer retrieves authoritative data from D1/R2.

Cloudflare Queues provides retry and delivery facilities specifically for offloading work from Worker requests, making it appropriate for this integration boundary.

Consumer behaviour:

```text
Queue event
    │
    ├── retrieve registration from D1
    ├── retrieve PDF from R2
    │
    ├── EMAIL.send PDF attachment
    │
    └── set emailed_at
```

Repeating a notify may send a second email (operator resend is explicit). The D1/R2 records remain unique.

## Failure Model

An Email Sending failure:

```text
Player registration
        │
        ├── D1 ✓
        ├── R2 ✓
        └── Email ✗
```

must result in:

```text
Player: SUCCESS

Queue:
    retry email notify
```

not:

```text
Player: ERROR
```

The operator inbox may temporarily lag the authoritative database.

That trade-off is intentional.

## Repository Layout

Recommended initial layout:

```text
/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── worker/
│       ├── index.ts
│       ├── registrations/
│       ├── pdf/
│       └── registrations/
│           └── notify.ts
│
├── migrations/
│   └── 0001_initial.sql
│
├── templates/
│   └── registration.pdf
│
├── public/
├── tests/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── wrangler.jsonc
```

Exact module boundaries may evolve without requiring an ADR amendment.

## Environment Model

Initially:

```text
local
production
```

A permanent staging environment is deliberately omitted.

Local Cloudflare development provides local versions of resources including D1 and R2, with local changes isolated from production.

If remote integration testing or stakeholder previews become valuable, a staging Worker can be introduced later.

## Database Migrations

D1 schema changes are represented by committed SQL migrations:

```text
migrations/
├── 0001_initial.sql
├── 0002_foo.sql
└── ...
```

Cloudflare's D1 migration mechanism tracks applied migrations and sequential migration files.

Normal deployment migrations should be backwards-compatible with the currently deployed Worker.

Prefer:

```text
add column
add table
add index
```

over immediate destructive changes.

Breaking schema changes should use expand/migrate/contract deployment steps.

## CI/CD

GitHub Actions is authoritative for CI/CD rather than Cloudflare's repository-triggered build system.

Cloudflare officially supports GitHub Actions deployment using Wrangler and an API token/account ID stored as GitHub secrets.

The production path is:

```text
feature branch
     │
     ▼
pull request
     │
     ├── install
     ├── lint
     ├── format check
     ├── typecheck
     ├── test
     └── build
             │
             ▼
          review
             │
             ▼
        merge main
             │
             ├── repeat CI
             ├── apply safe D1 migrations
             └── wrangler deploy
                       │
                       ▼
                   production
```

Cloudflare deploys Worker code and its associated static assets together.

## Secrets

GitHub Actions should contain only credentials necessary for deployment:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

Cloudflare recommends storing the API token in CI's secret store rather than the repository.

Runtime secrets belong in Cloudflare:

```text
ADMIN_READ_TOKEN
TURNSTILE_SECRET
...
```

This avoids unnecessarily exposing runtime credentials to the deployment pipeline.

## Consequences

### Positive

The public website remains almost entirely static.

Infrastructure remains serverless and operationally light.

There is no application server to patch or administer.

Email Sending gives league administrators the PDF in a familiar inbox.

An Email Service outage cannot prevent registration.

D1 permits future exports/reporting without parsing PDFs.

R2 ensures registration documents are not dependent on email for persistence.

The operator email can be resent from D1 and R2 at any time.

Local development can reproduce the relevant Cloudflare bindings.

### Negative

The operator inbox is eventually consistent with D1/R2.

A queue introduces another Cloudflare primitive.

Email Sending requires domain onboarding (SPF/DKIM/DMARC) and a paid Workers plan.

These costs are accepted because they keep the player-facing path reliable while providing the desired administrative workflow.

## Explicit Non-Goals

This ADR does not establish:

- a CMS;
- a league management system;
- scheduling;
- standings;
- payments;
- player authentication;
- administrator authentication;
- an admin dashboard;
- roster management;
- player confirmation email;
- registration field semantics;
- waiver/legal language;
- SSR;
- SPA architecture.

Those features should not be introduced merely because the chosen platform can support them.

## Decision Summary

Build the smallest useful system:

```text
Astro
   +
Workers Static Assets
   +
small Worker API
   +
D1 / R2
   +
pdf-lib
   +
Queue
   +
Email Sending projection
```

Keep **Cloudflare authoritative**, **email human-facing**, and **GitHub authoritative for delivery**.
