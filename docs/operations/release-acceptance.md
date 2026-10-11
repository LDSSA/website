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
- Namecheap will provide a permanent apex-to-`www` redirect.
- Browser Web Analytics will be enabled only for production after the final hostname is active.
- The existing Unbounce-hosted public site remains available until the DNS cutover.

## Remaining acceptance gates

- Promote the release-preparation changes from `dev` to `main` and verify the public Pages production hostname.
- Export the complete Namecheap zone privately and record rollback values.
- Attach `www`, complete the Namecheap cutover and verify email.
- Enable and verify production-only Web Analytics.
- Monitor production for seven days before closing the migration.
