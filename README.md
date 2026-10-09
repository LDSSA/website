# LDSA Website

The official website of the [Lisbon Data Science Academy](https://www.lisbondatascience.org/). It is a static [Astro](https://astro.build/) site designed for Cloudflare Pages and maintained through the `feature/* → dev → main` workflow.

The hosting and delivery architecture uses free tooling and service tiers. Domain registration and renewal are the only expected website infrastructure cost.

- Production: `https://www.lisbondatascience.org/` (kept on Unbounce until the migration acceptance tests pass)
- Candidate production: `https://ldsa-website.pages.dev/`
- Integration preview: `https://dev.ldsa-website.pages.dev/`

## Local development

Use Node.js 24 or newer:

```bash
npm ci
npm run dev
```

The local server prints its URL, normally `http://localhost:4321/`.

Before opening a pull request, run:

```bash
npm run check
npm run format:check
```

`npm run check` type-checks the Astro source, builds the production site, validates internal links and local assets, rejects Unbounce dependencies, verifies the three preserved Flodesk endpoints, and confirms Cloudflare deployment files and the sitemap are present. After each Cloudflare deployment, GitHub Actions also checks the live routes, redirects, 404 page, security and indexing headers, sitemap, and deployed commit identity.

## Branches and deployment

- `feature/*`: one focused change; open a pull request into `dev`.
- `dev`: integration branch and protected Cloudflare preview.
- `main`: production branch. Merging here publishes the production build.
- `core_development`: temporary migration branch; its deployment is a preview.

Pull requests into `dev` or `main` run formatting, type checks, a clean production build, site contract checks and Lighthouse audits. Pushes to `core_development`, `dev`, or `main` run the same build checks before deploying through the Cloudflare Wrangler GitHub Action.

The deployment workflow requires:

- GitHub secret `CLOUDFLARE_API_TOKEN`, scoped to edit Cloudflare Pages.
- GitHub secret `CLOUDFLARE_ACCOUNT_ID`.
- Optional GitHub variable `CLOUDFLARE_PAGES_PROJECT`; it defaults to `ldsa-website`.

See [the Cloudflare runbook](docs/operations/cloudflare.md) for project creation, preview access, analytics and domain cutover.

## Repository structure

```text
src/
├── components/       shared navigation, footer, FAQ and Flodesk forms
├── data/             navigation, links and migrated content data
├── layouts/          metadata and global page shell
├── pages/            public routes
└── styles/           design system and responsive styles
public/               assets and Cloudflare Pages configuration
scripts/              build-time contract checks
migration/
├── raw/              public rendered-source snapshot from Unbounce
├── scripts/          migration audit helpers
└── *.md              public-evidence audit, inventories and decisions
docs/operations/      deployment, DNS, QA and maintenance runbooks
.github/workflows/    CI and deployment automation
```

## Updating content

Most page copy lives in `src/pages`. Shared links, FAQs and the preserved volunteer roster live in `src/data/site.ts`. Keep time-sensitive dates in the LDSA wiki where possible and link to that source of truth instead of duplicating values that will become stale.

Images in `public/images` are locally hosted copies of LDSA assets recovered from the public Unbounce site. Add descriptive `alt` text for meaningful images and use an empty `alt` only for decorative images.

## Flodesk forms

`src/components/FlodeskForm.astro` preserves the three production Flodesk form IDs and submission endpoints:

- General interest: `63f9e4e2f0116a4cabfef7db`
- Starters Academy: `615c9641c71e8685f183bd18`
- Prep Course: `6172e62fe625581864e3f857`

The homepage also preserves the `option1` and `option2` interest values used by the current form. Do not replace these IDs or option values without updating the form in Flodesk and completing the end-to-end tests in [the QA runbook](docs/operations/qa.md).

## DNS and production safety

Do not change the public DNS or cancel Unbounce until the Cloudflare preview passes the acceptance tests. Email-related MX and TXT records are outside the website migration and must remain intact. The captured DNS baseline and cutover sequence are in [the DNS runbook](docs/operations/dns.md).

## Contributing

Create a branch from `dev`, make a focused change, run the local checks, then open a pull request into `dev`. After the combined changes pass on the protected Cloudflare preview, open a pull request from `dev` into `main`.
