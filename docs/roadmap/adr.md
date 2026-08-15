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
- a human-friendly shared location where league administrators can see all registration PDFs and a consolidated registration list.

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
| Asynchronous export | Cloudflare Queues |
| Human-facing document repository | Google Shared Drive |
| Consolidated registration list | Google Sheet |
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
             │ Google Shared Drive    │
             │                        │
             │ PDFs + Google Sheet    │
             └────────────────────────┘
```

**D1 and R2 are the system of record.**

Google Drive is an operational projection for humans.

The application must be able to reconstruct the Google Drive representation from D1 and R2 without loss of authoritative data.

Google Drive must therefore never be required to successfully complete a player registration.

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
          └──────────────► export queue
```

A registration is considered complete when its authoritative D1 record and R2 PDF have been successfully persisted.

Google synchronization is explicitly outside this success boundary.

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

## Google Shared Drive Projection

A Google Shared Drive will contain a dedicated application-managed area such as:

```text
Adult Hockey League/
└── Registration/
    └── 2026-27/
        ├── PDFs/
        │   ├── Smith, Bob - 01K....pdf
        │   ├── Brown, Sally - 01K....pdf
        │   └── ...
        │
        └── Registrations
            [Google Sheet]
```

Google's Drive API supports file creation in Shared Drives and requires Shared Drive-aware operations to specify support appropriately, including `supportsAllDrives=true` for relevant file operations.

### Google Authentication

Create a dedicated Google Cloud service account for the application.

Grant that identity access only to the registration folder and spreadsheet required by the application.

Google documents direct sharing of a specific Drive folder or Sheet with a service account as an alternative to administrative/domain-wide delegation.

The Worker will authenticate to the Google APIs using service-account credentials.

Sensitive key material is stored as a **Cloudflare Worker secret**, not committed to Git.

Expected configuration resembles:

```text
Non-secret configuration
------------------------
GOOGLE_DRIVE_FOLDER_ID
GOOGLE_REGISTRATION_SHEET_ID

Cloudflare secrets
------------------
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
```

Whether email is treated as a secret is not materially important; the private key is.

## Google Sheet Strategy

The Google Sheet is a **materialized view of D1**, not an independent database.

We explicitly reject:

```text
registration
    │
    └── append one Sheet row
```

as the core synchronization model.

Instead:

```text
D1 registrations
       │
       ▼
 build complete table
       │
       ▼
 overwrite/update Sheet dataset
```

At adult-league scale, regenerating the registration table is cheap and substantially easier to reason about.

It also gives administrators a predictable invariant:

> The Google Sheet represents the current authoritative registration set in D1.

A future CSV or `.xlsx` export can be generated from exactly the same projection code if desired.

## Asynchronous Export

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
    ├── ensure PDF exists in Shared Drive
    │
    └── refresh registration Sheet from D1
```

Synchronization must be **idempotent** because queue messages can be retried.

Google Drive files should therefore carry or otherwise be discoverable by the immutable registration ID.

For example:

```text
Drive appProperties:
    registrationId = 01K...
```

or an equivalent deterministic lookup mechanism.

## Failure Model

A Google API failure:

```text
Player registration
        │
        ├── D1 ✓
        ├── R2 ✓
        └── Google ✗
```

must result in:

```text
Player: SUCCESS

Queue:
    retry Google synchronization
```

not:

```text
Player: ERROR
```

The human-facing Drive projection may temporarily lag the authoritative database.

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
│       └── google-drive/
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
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
TURNSTILE_SECRET
...
```

This avoids unnecessarily exposing runtime credentials to the deployment pipeline.

## Consequences

### Positive

The public website remains almost entirely static.

Infrastructure remains serverless and operationally light.

There is no application server to patch or administer.

Google Drive gives nontechnical league administrators a familiar interface.

A Google outage cannot prevent registration.

D1 permits future exports/reporting without parsing PDFs.

R2 ensures registration documents are not dependent on Google Drive for persistence.

The Google Drive projection can be regenerated at any time.

Local development can reproduce the relevant Cloudflare bindings.

### Negative

The system contains duplicate storage of PDFs: R2 and Google Drive.

Google Drive synchronization is eventually consistent.

A queue introduces another Cloudflare primitive.

Google service-account credentials require initial administrative setup.

There is a small amount of integration code for Google OAuth/Drive/Sheets.

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
- email infrastructure;
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
Google Shared Drive projection
```

Keep **Cloudflare authoritative**, **Google human-friendly**, and **GitHub authoritative for delivery**.