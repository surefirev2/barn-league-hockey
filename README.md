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

Local Google export is off by default (`GOOGLE_SYNC_MODE=off`). Set it to `local` in `wrangler.jsonc` vars to write PDFs and a CSV under `.wrangler/google-drive/`.

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

### Worker secrets and Google projection

Cloudflare is the system of record (D1 + R2). Google Drive/Sheets are an async projection. A Google outage does not fail player submit.

1. Create a Google Cloud project and service account. Enable Drive API and Sheets API.
2. In a Shared Drive, create `Registration/2026-27/PDFs/` and a Sheet named `Registrations` (tab name **Registrations**).
3. Share the folder and Sheet with the service account (Content Manager). No domain-wide delegation.
4. Put IDs in `wrangler.jsonc` vars: `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_REGISTRATION_SHEET_ID`.
5. Set production sync: `"GOOGLE_SYNC_MODE": "live"` in `wrangler.jsonc` vars.
6. Secrets (not GitHub):

```bash
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

7. Cloudflare Turnstile: create a widget for barnleaguehockey.ca. Put the **site key** in `wrangler.jsonc` `vars.TURNSTILE_SITE_KEY`. Put the **secret key** with `wrangler secret put TURNSTILE_SECRET_KEY`. Local/dev skips verification when the secret is unset.

## Roadmap

Product direction lives in [docs/roadmap](docs/roadmap/README.md):

- [PRD](docs/roadmap/prd.md) — what we are building, acceptance criteria, and deferred scope
- [ADR](docs/roadmap/adr.md) — accepted platform architecture (Astro, Workers Static Assets, D1/R2, queues, Google Drive projection)
- [Design handoff](docs/design/handoff.md) — one-pager, team vs individual registration, form fields ([PDF](docs/design/handoff.pdf))

## Development

- **Pre-commit:** [`.pre-commit-config.yaml`](.pre-commit-config.yaml) runs YAML/JSON checks and basic hygiene. Install hooks with `pre-commit install`.
