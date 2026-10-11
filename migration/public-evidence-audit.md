# Public website evidence audit

## Scope and method

The public LDSA site was re-audited on 2026-10-09 after the Unbounce account became unavailable. The audit used only free, public sources:

- direct HTTPS requests to the production hostname;
- rendered HTML, scripts, forms, links, metadata and response headers;
- `robots.txt` and sitemap checks;
- public search results;
- the Internet Archive CDX URL index;
- LDSA Wiki, Portal, GitHub and social links referenced by the site;
- the existing source snapshots in `migration/raw/`.

The live site does not expose a sitemap: `/sitemap.xml` returns 404. Its `robots.txt` only blocks Unbounce click-tracking paths. Search and archive discovery were therefore used in addition to navigation crawling.

## Recovered route set

| Route                                                | Live status on 2026-10-09            | Decision                                  |
| ---------------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `/`                                                  | 200                                  | Rebuilt                                   |
| `/starters-academy/`                                 | 200                                  | Rebuilt                                   |
| `/prep-course/`                                      | 200                                  | Rebuilt                                   |
| `/about-us/`                                         | 200                                  | Rebuilt                                   |
| `/jobs/`                                             | 200                                  | Rebuilt                                   |
| `/curriculum/`                                       | 200, materially stale                | Redirect to maintained curriculum section |
| `/faq/`                                              | 200, materially stale                | Redirect to maintained FAQ section        |
| `/comms-associate-position/`                         | 200, expired 2018 vacancy            | Redirect to About/Get involved            |
| `/pythonzerotohero/`                                 | 404, historically archived           | Redirect to Prep Course                   |
| `/d-form_confirmation.html`                          | 200, retired homepage confirmation   | Redirect to homepage                      |
| `/comms-associate-position/a-form_confirmation.html` | 200, retired vacancy confirmation    | Redirect to About                         |
| `/curriculum/a-form_confirmation.html`               | 200, retired curriculum confirmation | Redirect to Starters Academy              |
| `/a-form_confirmation.html`                          | 404, historically archived           | Redirect to homepage                      |
| `/b-form_confirmation.html`                          | 404, historically archived           | Redirect to homepage                      |

The Internet Archive also indexed HTTP/HTTPS and port variants of these URLs. Those are hostname/protocol variants rather than separate content routes.

## Public integration findings

Three Flodesk forms are present in the rendered production HTML:

| Page             | Form ID                    | Endpoint                                                         |
| ---------------- | -------------------------- | ---------------------------------------------------------------- |
| Homepage         | `63f9e4e2f0116a4cabfef7db` | `https://form.flodesk.com/forms/63f9e4e2f0116a4cabfef7db/submit` |
| Starters Academy | `615c9641c71e8685f183bd18` | `https://form.flodesk.com/forms/615c9641c71e8685f183bd18/submit` |
| Prep Course      | `6172e62fe625581864e3f857` | `https://form.flodesk.com/forms/6172e62fe625581864e3f857/submit` |

The homepage form sends the public preference values `option1` for Starters Academy and `option2` for Prep Course. The public embed loads `https://assets.flodesk.com/universal.mjs` for modern browsers and `https://assets.flodesk.com/universal.js` as the legacy fallback. Both resources returned HTTP 200 on the audit date. Each form endpoint advertised POST support without a test submission.

The public HTML also contains the old Google Analytics property `UA-113478482-1`, Unbounce runtime code, old jQuery code, YouTube, and normal outbound links. No Google Tag Manager, Meta Pixel, or LinkedIn Insight Tag was observed.

## Accepted limits

Public evidence cannot reveal unpublished pages, inactive experiment variants, disabled global scripts, lead records, historical analytics, or server-side integrations that produce no browser-visible effect. These unknown account-only items are accepted as unavailable and do not block migration. Production acceptance is based on:

- all recovered routes and redirects;
- maintained public content and metadata;
- visual and responsive QA;
- external-link checks;
- real Flodesk subscriber-routing tests;
- stakeholder review before DNS cutover.
