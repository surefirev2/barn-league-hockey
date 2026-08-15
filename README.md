# Barn League Hockey

Public website and registration system for an adult hockey league.

Production: [https://blh.hutch.fail](https://blh.hutch.fail)

## Local development

```bash
make tokens/mint   # fills .env from .env.bootstrap
npm install
npm run dev
```

Useful targets:

- `npm run check` — Prettier + `astro check`
- `npm test` — Vitest
- `npm run build` — static `dist/`
- `make tokens/mint` — mint a least-privilege Cloudflare deploy token into `.env`
- `make secrets/sync` — copy allowlisted `.env` keys to GitHub Actions secrets

## Deploy

GitHub Actions deploys from `main` via Wrangler to Workers Static Assets on `blh.hutch.fail`.

1. Fill `.env.bootstrap`, then `make tokens/mint` writes `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` to `.env`.
2. Run `make secrets/sync`.
3. Merge to `main`. The [deploy workflow](.github/workflows/deploy.yaml) runs `wrangler deploy`.

Do not enable Cloudflare Workers Builds. GitHub Actions is the deploy path.

## Roadmap

Product direction lives in [docs/roadmap](docs/roadmap/README.md):

- [PRD](docs/roadmap/prd.md) — what we are building, acceptance criteria, and deferred scope
- [ADR](docs/roadmap/adr.md) — accepted platform architecture (Astro, Workers Static Assets, D1/R2, queues, Google Drive projection)
- [Design handoff](docs/design/handoff.md) — one-pager, team vs individual registration, form fields ([PDF](docs/design/handoff.pdf))

## Development

- **Pre-commit:** [`.pre-commit-config.yaml`](.pre-commit-config.yaml) runs YAML/JSON checks and basic hygiene. Install hooks with `pre-commit install`.
