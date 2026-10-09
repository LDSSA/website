# Cloudflare Pages runbook

The repository uses GitHub Actions and Wrangler Direct Upload. This keeps the build and deployment checks in one auditable workflow instead of asking Cloudflare and GitHub to build the same commit independently.

## 1. Create the Pages project

In the LDSA Cloudflare account, create a Pages project named `ldsa-website` using Direct Upload. Do not attach the production domain yet.

If Wrangler is authenticated locally, the equivalent command is:

```bash
npx wrangler pages project create ldsa-website --production-branch main
```

The build output is `dist`. The GitHub deployment workflow sends `core_development`, `dev` and `main` with their real branch names, so Cloudflare creates stable branch aliases. The intended test URL is `https://dev.ldsa-website.pages.dev/`; the temporary migration branch uses its own preview alias.

After uploading, the workflow tests the immutable deployment URL and confirms its routes, redirects, custom 404 page, security headers, indexing policy, branch and commit. It records the branch and commit in a non-cached `deployment.json` file generated only in CI.

## 2. Create the deployment token

Create a Cloudflare API token limited to the LDSA account with `Cloudflare Pages: Edit`. Add these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optionally set the repository variable `CLOUDFLARE_PAGES_PROJECT` if the project name is not `ldsa-website`.

Never commit tokens or put them in shell history. The workflow passes them directly from GitHub Secrets to the official Cloudflare action.

## 3. Protect preview deployments

In Cloudflare Zero Trust, protect preview deployments with Access:

1. Open **Workers & Pages → ldsa-website → Settings**.
2. Enable the preview access policy.
3. Allow only the LDSA team identity group or approved email addresses.
4. Confirm the production `*.pages.dev` deployment is not accidentally covered by the preview-only policy.
5. Open `https://dev.ldsa-website.pages.dev/` in a signed-out browser and confirm Cloudflare Access blocks it.

The automated deployment check must also be allowed through Access. Create a Cloudflare Access service token and an Allow policy for it, then add its values as GitHub repository secrets named `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`. The checker sends those credentials only as Cloudflare Access request headers. Do this at the same time as enabling the preview access policy; the secrets are unnecessary while previews are public.

Cloudflare preview deployments should also send `X-Robots-Tag: noindex`. Verify the live response header before sharing the preview URL.

## 4. Enable observability

Enable Cloudflare Web Analytics for the Pages project. After the first real visits, verify page views and Core Web Vitals appear. Keep analytics privacy-first and do not add visitor profiling scripts without a separate review.

Use the Cloudflare dashboard to monitor:

- deployment history and failures;
- Web Analytics and Core Web Vitals;
- 404 requests after cutover;
- bandwidth and cache status;
- security events.

## 5. GitHub environments

Create two GitHub environments:

- `preview`: no approval requirement; used by `core_development` and `dev`.
- `production`: require an LDSA maintainer approval and restrict deployments to `main`.

The required approval provides a final gate after online acceptance testing and before production deployment. It does not change DNS; domain cutover remains a separate controlled step.

## 6. Custom domains

Only after [the QA checklist](qa.md) passes, add:

- `www.lisbondatascience.org` as the production custom domain;
- `lisbondatascience.org`, redirected permanently to `https://www.lisbondatascience.org/`.

Follow [the DNS runbook](dns.md). Do not alter mail or domain-verification records.
