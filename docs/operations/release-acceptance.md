# Production candidate acceptance

## Development acceptance

- Date: 2026-10-11
- Environment: `https://dev.ldsa-website.pages.dev/`
- Accepted functional baseline: `a6af0374b16fc27dbeeac636d95ffc1c162f388d`
- Tester/owner: `cmm79`

The owner confirmed:

- the preview requires Cloudflare Access;
- `info@lisbondatascience.org` can authenticate and an unapproved address is denied;
- preview responses send `X-Robots-Tag: noindex`;
- all GitHub CI and deployment checks pass;
- Pages-managed Web Analytics is disabled and the preview contains no beacon or RUM request;
- Flodesk subscription forms submit successfully and create the expected subscriber records in Flodesk.

No subscriber addresses or other personal data are stored in this repository.

## Release decisions

- `main` is the production branch and `dev` is the private integration branch.
- Production DNS remains authoritative at Namecheap.
- `www.lisbondatascience.org` will point to `ldsa-website.pages.dev` only after the custom hostname is registered in the Pages dashboard.
- The existing Namecheap apex-to-`www` forwarding remains unchanged during the initial cutover.
- Browser Web Analytics will be enabled only for production after the final hostname is active.
- The existing Unbounce-hosted public site remains available until the DNS cutover.
- Unbounce will be retained as a rollback target after cutover; the migration does not cancel or delete its account, project or domain association.

## Production candidate

- Accepted production commit: `2dfa88d460235d97e1ab4ed982c70b15a2e4c7a5`
- Production workflow: <https://github.com/LDSSA/website/actions/runs/38138514741>
- Result: passed on 2026-10-11
- Public staging hostname: `https://ldsa-website.pages.dev/`

The public Pages hostname returns `200`, is not protected by Access and does not send `noindex`. Immutable deployment URLs remain private and send `noindex`.

## Remaining acceptance gates

- Export the complete Namecheap zone privately and record rollback values.
- Attach `www`, complete the Namecheap cutover and verify email.
- Enable and verify production-only Web Analytics.
- Monitor production for seven days before closing the migration.
