# Barn League Hockey

Public website and registration system for an adult hockey league.

Production: [https://barnleaguehockey.ca](https://barnleaguehockey.ca)

## Local development

```bash
make tokens/mint   # fills .env from .env.bootstrap
npm install
make dev           # Astro HMR + local Worker (D1, R2, Queue)
```

`make dev` depends on `make clean`, then runs Astro with HMR on [http://127.0.0.1:4321/](http://127.0.0.1:4321/) and the Worker on port 8788. `/api` is proxied, so registration works from the UI URL. Worker TypeScript reloads via Wrangler. UI-only Astro (no API): `make astro`. Production-like (no HMR): `make preview`. Port 8787 is skipped because Cursor’s local UI already binds it.

Preferred Docker path (Node 22, bind-mounted repo, local D1/R2/Queue — no Cloudflare account required):

```bash
make docker
# or: docker compose up
```

Serves the UI on [http://127.0.0.1:4321/](http://127.0.0.1:4321/). Override with `ASTRO_PORT=4322 make docker` or `ASTRO_PORT=4322 make dev`. The Worker/API port is `WORKER_PORT` (default 8788).

Useful targets:

- `make clean` — stop leftover astro/wrangler/workerd on `ASTRO_PORT` and `WORKER_PORT`, drop leftover Compose containers, remove `.wrangler/tmp` locks. Does not delete `.env`, `node_modules`, or D1 data
- `make clean-data` — `make clean` plus wipe `.wrangler/state` (local D1/R2/Queue). `make dev` re-applies migrations
- `make docker` / `make docker-down` — Compose `up` / `down`
- `npm run check` — Prettier + `astro check`
- `npm test` — Vitest
- `npm run build` — static `dist/`
- `make tokens/mint` — mint a least-privilege Cloudflare deploy token into `.env`
- `make secrets/sync` — copy allowlisted `.env` keys to GitHub Actions secrets

Local Google export is off by default. Copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` (gitignored). Wrangler loads that file over `wrangler.jsonc` vars, so `make dev` stays `GOOGLE_SYNC_MODE=off` even after production is `live`. To exercise the local Drive/CSV projection, set `GOOGLE_SYNC_MODE=local` in `.dev.vars`; files land under `.wrangler/google-drive/`.

## Deploy

GitHub Actions deploys from `main` via Wrangler to Workers Static Assets on **barnleaguehockey.ca**.

1. Fill `.env.bootstrap`, then `make tokens/mint` writes `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` to `.env`. Remint after changing token permissions.
2. Run `make secrets/sync`.
3. Merge to `main`. The [deploy workflow](.github/workflows/deploy.yaml) applies D1 migrations then `wrangler deploy`.

Do not enable Cloudflare Workers Builds. GitHub Actions is the deploy path.

### Custom domain DNS

Wrangler declares the apex custom domain (`barnleaguehockey.ca`). Before the first production deploy:

1. Add **barnleaguehockey.ca** to this Cloudflare account as a zone (change nameservers at the registrar, or CNAME-setup if using a partial zone).
2. After the zone is active, `wrangler deploy` attaches the Worker as the apex custom domain. No `www` hostname is configured.

Replace the placeholder D1 `database_id` in `wrangler.jsonc` after creating resources (once). The GitHub deploy token must include **D1 Write**, **Workers R2 Storage Write**, and **Queues Write** — remint with `make tokens/mint` then `make secrets/sync` if the token was created before those permissions existed.

```bash
npx wrangler d1 create barn-league-hockey
npx wrangler r2 bucket create barn-league-hockey-registrations
npx wrangler queues create registration-export
```

Paste the D1 UUID into `wrangler.jsonc` `d1_databases[0].database_id`.

### Operator read API (Cloudflare)

D1 + R2 are the system of record. There is no public admin UI. Operators can list the current season and download PDFs with a Worker secret:

```bash
npx wrangler secret put ADMIN_READ_TOKEN
```

Local: set `ADMIN_READ_TOKEN` in `.dev.vars`. Secret unset → `503`. Missing or wrong `Authorization: Bearer` → `401`.

```bash
# Season rows (no payload_json)
curl -sS -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  https://barnleaguehockey.ca/api/admin/registrations

# PDF for one registration
curl -sS -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  -o registration.pdf \
  https://barnleaguehockey.ca/api/admin/registrations/<ULID>/pdf
```

Do not put `ADMIN_READ_TOKEN` in GitHub Actions secrets or `wrangler.jsonc`.

### Google Cloud, Shared Drive, and Sheet (operator checklist)

Google Drive/Sheets are an **async queue projection**. A Google outage does not fail player submit. Production `wrangler.jsonc` stays `"GOOGLE_SYNC_MODE": "off"` until the four values below exist **and** the Worker secrets are stored. Shipping `live` before secrets makes the queue consumer throw and retry (8 attempts).

Do this in Google (this repo cannot create the project, folder, or Sheet):

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select a project (name it e.g. `barn-league-hockey`).
2. Enable APIs: **Google Drive API** and **Google Sheets API** (APIs & Services → Library).
3. Create a service account (IAM & Admin → Service Accounts). No domain-wide delegation. Skip optional keys until the next step.
4. Keys → Add key → JSON. Save the file locally (not in git). You need:
   - `client_email` — the service account email
   - `private_key` — PEM, including `-----BEGIN PRIVATE KEY-----`
5. In Google Drive, open or create a **Shared Drive**. Create folder `Registration/2026-27/PDFs/` (or equivalent). Copy the **folder** ID from the URL (`https://drive.google.com/drive/folders/<FOLDER_ID>`).
6. In that Shared Drive, create a Google Sheet named `Registrations`. Rename the first tab to **exactly** `Registrations` (the Worker clears/writes `Registrations!A:Z`). Copy the **spreadsheet** ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`).
7. Share **the folder and the Sheet** with the service account email as **Content Manager**. Sharing only the Sheet is not enough for PDF uploads.

Hand over (not GitHub, not `wrangler.jsonc` for the key):

| Value                 | Where it goes                                                |
| --------------------- | ------------------------------------------------------------ |
| Service account email | `npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL`       |
| PEM private key       | `npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` |
| Drive **folder** ID   | `wrangler.jsonc` vars `GOOGLE_DRIVE_FOLDER_ID`               |
| Sheet ID              | `wrangler.jsonc` vars `GOOGLE_REGISTRATION_SHEET_ID`         |

PEM newlines: if the dashboard/CLI flattens the key, store literal `\n` in the secret. The Worker already normalizes `\\n`.

### Turn Google projection on (after secrets exist)

Order matters:

```bash
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
npx wrangler secret put ADMIN_READ_TOKEN
```

Then put the folder and Sheet IDs in `wrangler.jsonc` vars, set `"GOOGLE_SYNC_MODE": "live"`, merge, and deploy. Keep `.dev.vars` on `GOOGLE_SYNC_MODE=off` so `make dev` never calls Google.

Optional Turnstile: create a widget for barnleaguehockey.ca. Site key → `wrangler.jsonc` `vars.TURNSTILE_SITE_KEY`. Secret → `npx wrangler secret put TURNSTILE_SECRET_KEY`. Local/dev skips verification when the secret is unset.

### Verify Google export and backfill

After `live` is deployed, submit one registration on production. Confirm:

- PDF appears in the Shared Drive folder (`Last, First - <ULID>.pdf`)
- Sheet tab **Registrations** is rewritten from D1
- Admin list shows `driveFileId` and `exportedAt` for that row

Rows already in D1 with an empty `drive_file_id` were not queued while mode was `off`. Enqueue them (idempotent Drive upsert keyed by `registrationId`):

```bash
curl -sS -X POST -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  https://barnleaguehockey.ca/api/admin/registrations/export-pending
```

Or enqueue one id:

```bash
curl -sS -X POST -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  https://barnleaguehockey.ca/api/admin/registrations/<ULID>/export
```

## Roadmap

Product direction lives in [docs/roadmap](docs/roadmap/README.md):

- [PRD](docs/roadmap/prd.md) — what we are building, acceptance criteria, and deferred scope
- [ADR](docs/roadmap/adr.md) — accepted platform architecture (Astro, Workers Static Assets, D1/R2, queues, Google Drive projection)
- [Design handoff](docs/design/handoff.md) — one-pager, team vs individual registration, form fields ([PDF](docs/design/handoff.pdf))

## Development

- **Pre-commit:** [`.pre-commit-config.yaml`](.pre-commit-config.yaml) runs YAML/JSON checks and basic hygiene. Install hooks with `pre-commit install`.
