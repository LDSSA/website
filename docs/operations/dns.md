# DNS baseline and Namecheap cutover

The selected architecture keeps Namecheap authoritative for `lisbondatascience.org`. Only the website records change: `www` points to Cloudflare Pages and Namecheap permanently redirects the apex to `www`. Mail, DKIM, SPF, DMARC and verification records remain at Namecheap.

This choice does not prevent a later move to Cloudflare authoritative DNS. Before a future nameserver change, recreate and verify the complete Namecheap zone in Cloudflare, then change the nameservers. DNS records are not copied automatically when nameservers change.

## Captured public baseline

These values were rechecked on 2026-10-11. Export the authoritative Namecheap zone immediately before cutover because public DNS cannot reveal every record, particularly unknown DKIM selectors.

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

No apex AAAA or CAA response was observed.

The existing Namecheap forwarding behavior was also recorded on 2026-10-11:

- plain HTTP at the apex returns a temporary `302` to `https://www.lisbondatascience.org`;
- apex paths are not preserved by the current forwarding rule;
- HTTPS at the apex is not reliably terminated by Namecheap forwarding;
- `www` serves the Unbounce site and returns the Unbounce page identifier `7f3394ee-2bc1-4e2a-bab8-b6f82f2f95a1`.

The initial cutover preserves this existing apex behavior rather than modifying it. A later move to Cloudflare authoritative DNS should replace it with a permanent HTTPS, path-preserving redirect.

## Private backup and rollback record

Immediately before cutover:

1. Export or manually record every Namecheap Advanced DNS entry, including A, AAAA, CNAME, MX, TXT, CAA, SRV, URL Redirect, Dynamic DNS and email-routing settings.
2. Capture every DKIM selector shown in Namecheap and the relevant mail provider.
3. Store the export and screenshots privately; never commit them if they include sensitive service details.
4. Confirm Google Workspace can send and receive mail.
5. Record the rollback values:
   - `www` CNAME: `unbouncepages.com.`
   - the two current apex A records shown above;
   - the existing apex redirect configuration, without editing it.
6. Keep the Unbounce account and its domain association intact. DNS rollback remains possible for as long as Unbounce continues serving that project; a suspended provider account cannot guarantee indefinite retention.

## Register the Pages hostname before changing DNS

1. Confirm the accepted `main` commit is healthy at `https://ldsa-website.pages.dev/`.
2. In Cloudflare, open **Workers & Pages → ldsa-website → Custom domains**.
3. Select **Set up a domain**.
4. Enter `www.lisbondatascience.org` and continue.
5. Keep the setup pending until Cloudflare displays the external-DNS instructions.

Do not create the CNAME first. Cloudflare Pages requires the custom hostname to be associated with the project before the external DNS record points to it.

## Namecheap cutover

In **Namecheap → Domain List → lisbondatascience.org → Manage → Advanced DNS**:

1. Change only the existing `www` record:

   | Type  | Host  | Value                     | TTL       |
   | ----- | ----- | ------------------------- | --------- |
   | CNAME | `www` | `ldsa-website.pages.dev.` | Automatic |

2. Leave the existing apex forwarding configuration and its Namecheap-managed A records unchanged.
3. Do not edit MX, SPF, DKIM, DMARC, CAA, SRV or verification records.
4. Save the `www` change and allow for its 60-second DNS TTL plus resolver caches.
5. Wait for Cloudflare Pages to show `www.lisbondatascience.org` as active and for its TLS certificate to become valid.

## Production verification

Verify from at least two networks or public resolvers:

1. `www.lisbondatascience.org` resolves through the Pages CNAME and serves the accepted commit over HTTPS.
2. The existing apex forwarding still sends HTTP requests to `https://www.lisbondatascience.org`; record the inherited HTTPS and path-preservation limitations as accepted until the future Cloudflare DNS migration.
3. All maintained routes, legacy redirects, the custom 404, assets, headers, canonical URLs, `robots.txt` and the sitemap pass.
4. Flodesk submits a controlled production subscription successfully.
5. Google Workspace sends and receives controlled messages, including a reply from an external mailbox.
6. The protected `dev` alias remains separate and private.

After the hostname is active, configure production-only Web Analytics using the Cloudflare runbook.

## Rollback

If production has a material failure:

1. Restore the `www` CNAME to `unbouncepages.com.`.
2. Leave the unchanged apex forwarding, mail and verification records untouched.
3. Verify the old public site and email before investigating the failed cutover.

This rollback changes routing only. It does not recreate an Unbounce project that Unbounce has removed, so retain the account, project, custom-domain association and any required provider access while rollback remains a business requirement.

## Future move to Cloudflare DNS

A future authoritative-DNS migration remains fully supported:

1. Add `lisbondatascience.org` as a Cloudflare zone on the Free plan.
2. Import and manually compare every Namecheap record, including all mail, DKIM, SPF, DMARC, CAA, SRV and verification records.
3. Keep mail-related hostnames DNS-only where applicable.
4. Validate the staged Cloudflare zone against the private export.
5. Replace the Namecheap nameservers with the two nameservers assigned by Cloudflare.
6. Verify website, email and domain-verification services throughout propagation.
7. Replace the inherited apex forwarding with a Cloudflare `301` redirect that preserves the path and query string over HTTPS.

The registrar can remain Namecheap even when Cloudflare becomes the authoritative DNS provider.
