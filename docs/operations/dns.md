# DNS baseline and Namecheap cutover

The selected architecture keeps Namecheap authoritative for `lisbondatascience.org`. Only the website records change: `www` points to Cloudflare Pages and Namecheap permanently redirects the apex to `www`. Mail, DKIM, SPF, DMARC and verification records remain at Namecheap.

This choice does not prevent a later move to Cloudflare authoritative DNS. Before a future nameserver change, recreate and verify the complete Namecheap zone in Cloudflare, then change the nameservers. DNS records are not copied automatically when nameservers change.

## Captured public baseline

These values were observed on 2026-10-08. Export the authoritative Namecheap zone immediately before cutover because public DNS cannot reveal every record, particularly unknown DKIM selectors.

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

## Private backup and rollback record

Immediately before cutover:

1. Export or manually record every Namecheap Advanced DNS entry, including A, AAAA, CNAME, MX, TXT, CAA, SRV, URL Redirect, Dynamic DNS and email-routing settings.
2. Capture every DKIM selector shown in Namecheap and the relevant mail provider.
3. Store the export and screenshots privately; never commit them if they include sensitive service details.
4. Confirm Google Workspace can send and receive mail.
5. Record the rollback values:
   - `www` CNAME: `unbouncepages.com.`
   - the two current apex A records shown above;
   - any existing apex redirect configuration.

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

2. Configure the apex redirect:

   | Type                | Host | Value                                | Redirect type |
   | ------------------- | ---- | ------------------------------------ | ------------- |
   | URL Redirect Record | `@`  | `https://www.lisbondatascience.org/` | Permanent 301 |

3. Remove only A, ALIAS, CNAME or URL Redirect records at host `@` that Namecheap identifies as conflicting with the new apex redirect. The observed apex A records are website/forwarding records, but compare them with the private zone export before removing them.
4. Do not edit MX, SPF, DKIM, DMARC, CAA, SRV or verification records.
5. Save the changes. Namecheap states that URL redirects normally begin working within about 30 minutes; resolver caches may take longer.
6. Wait for Cloudflare Pages to show `www.lisbondatascience.org` as active and for its TLS certificate to become valid.

## Production verification

Verify from at least two networks or public resolvers:

1. `www.lisbondatascience.org` resolves through the Pages CNAME and serves the accepted commit over HTTPS.
2. `lisbondatascience.org` returns a permanent redirect to `https://www.lisbondatascience.org/`.
3. Deep apex URLs preserve their path when redirected. If Namecheap does not preserve paths as required, stop and replace the forwarding method before accepting cutover.
4. All maintained routes, legacy redirects, the custom 404, assets, headers, canonical URLs, `robots.txt` and the sitemap pass.
5. Flodesk submits a controlled production subscription successfully.
6. Google Workspace sends and receives controlled messages, including a reply from an external mailbox.
7. The protected `dev` alias remains separate and private.

After the hostname is active, configure production-only Web Analytics using the Cloudflare runbook.

## Rollback

If production has a material failure:

1. Restore the `www` CNAME to `unbouncepages.com.`.
2. Remove the new apex URL Redirect Record and restore the prior apex website records or forwarding configuration from the private backup.
3. Leave all mail and verification records untouched.
4. Verify the old public site and email before investigating the failed cutover.

## Future move to Cloudflare DNS

A future authoritative-DNS migration remains fully supported:

1. Add `lisbondatascience.org` as a Cloudflare zone on the Free plan.
2. Import and manually compare every Namecheap record, including all mail, DKIM, SPF, DMARC, CAA, SRV and verification records.
3. Keep mail-related hostnames DNS-only where applicable.
4. Validate the staged Cloudflare zone against the private export.
5. Replace the Namecheap nameservers with the two nameservers assigned by Cloudflare.
6. Verify website, email and domain-verification services throughout propagation.

The registrar can remain Namecheap even when Cloudflare becomes the authoritative DNS provider.
