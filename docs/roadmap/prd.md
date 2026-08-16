# PRD: Adult Hockey League Static Website & Registration System

## Product Objective

Provide a low-maintenance public website for an adult hockey league that allows visitors to obtain league information and allows players to submit registrations.

Every completed registration must result in:

1. an authoritative structured registration record;
2. an authoritative PDF registration document;
3. eventual delivery of the PDF to the operator inbox via Cloudflare Email Sending.

The system should strongly favour static content and straightforward operations over application sophistication.

## Product Principles

### Static by default

Informational functionality belongs in Astro-generated HTML whenever possible.

Adding informational content must not require server-side application logic.

### Infrastructure proportional to usage

This is a hockey league website, not a general-purpose league SaaS platform.

Do not introduce:

- user accounts without a requirement;
- CMS infrastructure without a requirement;
- admin applications without a requirement;
- SSR without a requirement;
- Kubernetes/containers;
- long-running servers;
- general workflow engines.

### Durable before convenient

D1 and R2 preserve authoritative registration information.

Email exists for administrator convenience.

### Repository-driven

Application code, static content, infrastructure configuration, PDF templates, migrations, tests, and CI configuration are version-controlled.

## Functional Scope

### Public Website

The system shall support static league content including, as required:

```text
home
registration
rules
league information
contact information
other informational pages
```

The specific information architecture is an implementation/content concern.

### Player Registration

The site shall expose a registration form.

On valid submission the system shall create an immutable registration identifier.

Exact form fields, waiver language, signature mechanism, duplicate handling, validation details, and user confirmation behaviour may be established during implementation.

### PDF Generation

Each successfully completed registration shall have a PDF generated with `pdf-lib`.

The PDF shall be associated with the immutable registration identifier.

The PDF generation implementation may:

- populate an existing PDF template; or
- programmatically construct a PDF.

The registration is not considered fully persisted until the authoritative PDF is present in R2.

### Structured Record

Registration data shall be stored in D1.

The data model should preserve enough structured information to support:

```text
registration listing
CSV/export generation
lookup by registration ID
operational reconciliation
```

without extracting information from PDFs.

### Operator email

After authoritative persistence, the application shall enqueue notify work.

A background consumer shall email the registration PDF to the configured operator address.

Attachment filenames may be optimized for humans:

```text
Last, First - Registration ID.pdf
```

The immutable registration ID must nevertheless remain available for reconciliation.

The operator list is D1 via the admin API, not a Google Sheet.

## Reliability Requirements

### Registration success

Email Sending availability shall not be part of the synchronous registration success criteria.

Required:

```text
D1 succeeds
R2 succeeds
PDF succeeds
    ↓
registration succeeds
```

Not required synchronously:

```text
Email send succeeds
```

### Notify retry

Failed email notify shall be retryable without player action.

Cloudflare Queues provides retry/delivery mechanisms.

### Idempotency

Repeating a notify may send another email. D1 and R2 records remain unique. Operator resend is explicit (`POST .../:id/email`).

## Security Requirements

Registration PDFs and structured registration data are private.

The R2 registration bucket shall not be public.

Runtime secrets shall not be stored in Git.

Appropriate basic abuse protection shall be applied to public registration submission.

## Operational Requirements

League administrators shall not need Cloudflare knowledge for normal access to completed registrations.

Their normal workflow should be:

```text
Inbox
   │
   └── open attached PDF
```

Cloudflare administration remains a technical/operator concern. The admin API lists D1 rows and downloads PDFs.

## Performance Requirements

Static content should be served as Cloudflare static assets rather than invoking application logic.

Cloudflare Workers Static Assets deploys assets alongside Worker code and handles them through Cloudflare's static asset infrastructure.

No performance optimization beyond conventional static-site practices is expected to be necessary at league scale.

## Maintainability Requirements

A developer shall be able to:

```text
git clone
npm install
npm run dev
```

and obtain a useful local development environment without creating production cloud resources.

D1 and R2 shall have local equivalents during development using Cloudflare's local tooling.

Email notify shall be unit-tested with a mock `EMAIL.send`. Local Wrangler may not serialize binary PDF attachments.

## Deployment Requirements

Pull requests must pass automated validation before merge.

Production deploys occur from `main`.

Deployments use GitHub Actions and Wrangler.

Cloudflare documents GitHub Actions as a supported external CI/CD path for Worker deployments.

Database migrations are committed alongside application code and executed deliberately as part of deployment.

## Acceptance Criteria

The product is considered viable when:

- the public site is generated by Astro;
- the generated site is deployed through Workers Static Assets;
- informational page requests do not ordinarily execute application code;
- a player can submit a valid registration;
- a successful submission creates a D1 registration record;
- a successful submission creates a valid PDF using `pdf-lib`;
- the canonical PDF is stored privately in R2;
- email notify occurs outside the request path;
- the PDF eventually arrives in the operator inbox;
- a transient Email Sending failure does not make an otherwise valid player registration fail;
- email notify can safely retry;
- the site can be developed with local Cloudflare resources;
- pull requests automatically lint, typecheck, test, and build;
- merging to `main` deploys production through GitHub Actions;
- no runtime credentials are committed to Git.

## Deferred Scope

Possible future work includes:

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

None should be anticipated architecturally beyond maintaining clean service boundaries.
