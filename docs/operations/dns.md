# DNS baseline and cutover

Public records were captured on 2026-10-08 through DNS-over-HTTPS. Export the authoritative zone from the registrar immediately before cutover because the values below are a point-in-time safety record, not a substitute for the full zone.

## Captured baseline

| Name                           | Type  | Value                                                                  | Observed TTL |
| ------------------------------ | ----- | ---------------------------------------------------------------------- | ------------ |
| `lisbondatascience.org`        | A     | `192.64.119.34`                                                        | 1800         |
| `lisbondatascience.org`        | A     | `54.84.104.245`                                                        | 1800         |
| `www.lisbondatascience.org`    | CNAME | `unbouncepages.com.`                                                   | 60           |
| `lisbondatascience.org`        | NS    | `dns1.registrar-servers.com.`                                          | 1800         |
| `lisbondatascience.org`        | NS    | `dns2.registrar-servers.com.`                                          | 1800         |
| `lisbondatascience.org`        | MX 1  | `aspmx.l.google.com.`                                                  | 1800         |
| `lisbondatascience.org`        | MX 5  | `alt1.aspmx.l.google.com.`                                             | 1800         |
| `lisbondatascience.org`        | MX 5  | `alt2.aspmx.l.google.com.`                                             | 1800         |
| `lisbondatascience.org`        | MX 10 | `aspmx2.googlemail.com.`                                               | 1800         |
| `lisbondatascience.org`        | MX 10 | `aspmx3.googlemail.com.`                                               | 1800         |
| `lisbondatascience.org`        | TXT   | `v=spf1 a mx include:_spf.elasticemail.com ~all`                       | 1800         |
| `lisbondatascience.org`        | TXT   | `google-site-verification=fe3vJvPLBYVSEErYNCIPHTSrewzHJ-yopcfAyQz3OZg` | 1800         |
| `_dmarc.lisbondatascience.org` | TXT   | `v=DMARC1; p=none`                                                     | 300          |

No apex AAAA or CAA response was observed. DKIM selectors cannot be discovered exhaustively from public DNS and must be preserved from the authoritative zone export.

## Before cutover

1. Export every record from the authoritative DNS provider, including A, AAAA, CNAME, MX, TXT, CAA, SRV, SPF, DKIM and DMARC-related names.
2. Store the export privately with the migration archive.
3. Confirm the Cloudflare production Pages deployment passes all acceptance tests at its `pages.dev` URL.
4. Confirm `dev` remains behind Access and returns `X-Robots-Tag: noindex`.
5. Add and validate both custom domains in the Cloudflare Pages dashboard.
6. Record the exact rollback values and the person responsible for the change.

## Cutover

1. Replace only the records used for the website, following the target values displayed by Cloudflare Pages.
2. Do not edit MX, SPF, DKIM, DMARC or verification TXT records.
3. Make `www` canonical and redirect the apex to `https://www.lisbondatascience.org/`.
4. Verify DNS from more than one resolver, HTTPS certificate issuance and both hostnames.
5. Run the production section of [the QA checklist](qa.md).

## Rollback

If production has a material failure, restore the captured `www` CNAME to `unbouncepages.com.` and restore the prior apex website records. Leave email records untouched. Keep Unbounce active until the new production site has been stable for at least seven days.
