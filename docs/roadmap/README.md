# Roadmap

Product source of truth for Barn League Hockey: a static public website plus player registration.

| Document | Role |
|---|---|
| [PRD](prd.md) | What we are building, acceptance criteria, and deferred scope |
| [ADR](adr.md) | Accepted platform architecture (2026-08-15) |
| [Design handoff](../design/handoff.md) | One-pager IA, brand, and registration fields |

Build the smallest useful system: Astro static site, Workers Static Assets, a small Worker API, D1/R2 as the system of record, `pdf-lib` registration PDFs, a Cloudflare Queue, and Email Sending of each PDF to the operator.

## Now

- Public one-pager (hero, league facts, teams, register, contact)
- Register for Rockets, Shockers, Hornets, or as an individual
- Player registration with an immutable ID
- Authoritative D1 record + private R2 PDF before success
- Asynchronous email of the registration PDF to the operator
- Local Wrangler development, GitHub Actions CI, deploy from `main`

## Later

Not in current scope. Do not design the architecture around them:

```text
payments
player confirmation email
admin UI
CSV/XLSX scheduled exports
teams and rosters
schedules
standings
player login
registration editing
remote preview deployments
```
