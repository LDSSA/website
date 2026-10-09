# Cloudflare Pages runbook

The repository uses GitHub Actions and Wrangler Direct Upload. This keeps the build and deployment checks in one auditable workflow instead of asking Cloudflare and GitHub to build the same commit independently.

The project must remain on free infrastructure. Cloudflare Pages serves this static site without Pages Functions, paid Workers, R2, or another billable runtime. Preview authentication uses the Cloudflare Zero Trust Free plan, which currently supports up to 50 users. Confirm that the dashboard still shows the Free plan whenever enabling a new Cloudflare product.

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

In Cloudflare Zero Trust, protect preview deployments with Access. Complete the service-token steps first so GitHub Actions can continue checking the protected deployment:

1. Open **Zero Trust → Access controls → Service credentials → Service Tokens**.
2. Create `github-actions-ldsa-preview-smoke`, choose an appropriate expiry, and copy its Client ID and Client Secret once.
3. In GitHub repository Actions secrets, add the values as `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`.
4. Open **Workers & Pages → ldsa-website → Settings → General** and select **Enable access policy**.
5. Manage the generated Access application and keep its interactive Allow policy limited to the LDSA Cloudflare account members or explicitly approved tester emails.
6. Add a second policy with action **Service Auth**, include only the `github-actions-ldsa-preview-smoke` service token, and save it. New Zero Trust organizations use strict service-token authentication, so an ordinary Allow policy is insufficient for CI.
7. Confirm the policy wildcard covers preview aliases but does not cover `ldsa-website.pages.dev` or a future production custom domain.
8. Re-run the `core_development` deployment workflow and confirm the post-deployment contract check passes.
9. Open the preview in a signed-out private browser and confirm Access blocks it, then sign in as an approved tester and confirm it opens.

The checker sends the service credentials only in Cloudflare Access request headers. Never put either value in repository variables, source files, logs, or chat. Record the token expiry and rotate the GitHub secrets before it expires.

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
