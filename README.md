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

Copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` (gitignored) for local secrets such as `ADMIN_READ_TOKEN`. Wrangler loads that file over `wrangler.jsonc` vars. Local `make dev` includes the `EMAIL` binding; binary PDF attachments may not serialize in the local simulator — unit tests cover the send payload.

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

### Cloudflare Email Sending (operator checklist)

After each registration is stored in D1/R2, a queue emails the PDF to `chutchic@gmail.com`. An Email Service outage does not fail player submit. The consumer retries (max 8).

Onboard the sending domain **before** the email consumer ships, or the queue throws `E_SENDER_NOT_VERIFIED` / `E_SENDER_DOMAIN_NOT_AVAILABLE` and retries.

1. Open [Compute → Email Service → Email Sending](https://dash.cloudflare.com/?to=/:account/email-service/sending).
2. **Onboard Domain** → `barnleaguehockey.ca`. Cloudflare adds SPF/DKIM/DMARC (and bounce MX on `cf-bounce`).
3. A paid Workers plan is required.

From: `registrations@barnleaguehockey.ca`. To: `chutchic@gmail.com` (`wrangler.jsonc` vars `REGISTRATION_FROM_EMAIL` / `REGISTRATION_NOTIFY_EMAIL`).

Optional Turnstile: create a widget for barnleaguehockey.ca. Site key → `wrangler.jsonc` `vars.TURNSTILE_SITE_KEY`. Secret → `npx wrangler secret put TURNSTILE_SECRET_KEY`. Local/dev skips verification when the secret is unset.

After this Worker is live, leftover Google secrets are unused:

```bash
npx wrangler secret delete GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret delete GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
```

### Verify email notify and backfill

After Email Sending is onboarded and this Worker is deployed, submit one registration on production. Confirm the inbox at `chutchic@gmail.com` (check spam once). Admin list shows `emailedAt` for that row.

Rows already in D1 with a null `emailed_at` can be queued:

```bash
curl -sS -X POST -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  https://barnleaguehockey.ca/api/admin/registrations/email-pending
```

Or enqueue one id (always resends):

```bash
curl -sS -X POST -H "Authorization: Bearer $ADMIN_READ_TOKEN" \
  https://barnleaguehockey.ca/api/admin/registrations/<ULID>/email
```

## Roadmap

Product direction lives in [docs/roadmap](docs/roadmap/README.md):

- [PRD](docs/roadmap/prd.md) — what we are building, acceptance criteria, and deferred scope
- [ADR](docs/roadmap/adr.md) — accepted platform architecture (Astro, Workers Static Assets, D1/R2, queues, Email Sending projection)
- [Design handoff](docs/design/handoff.md) — one-pager, team vs individual registration, form fields ([PDF](docs/design/handoff.pdf))

## Development

- **Pre-commit:** [`.pre-commit-config.yaml`](.pre-commit-config.yaml) runs YAML/JSON checks and basic hygiene. Install hooks with `pre-commit install`.
