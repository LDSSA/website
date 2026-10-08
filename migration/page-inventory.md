# Public page inventory

Captured on 2026-10-08 from the public `www.lisbondatascience.org` site. The Unbounce dashboard reportedly contains 14 published pages; only the seven routes below were public, linked, or indexed during this audit. Dashboard-only pages still require an account export before Unbounce can be cancelled.

| Current route        | Unbounce page ID                       | Status                      | Migration action                                      | Flodesk                                  |
| -------------------- | -------------------------------------- | --------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `/`                  | `7f3394ee-2bc1-4e2a-bab8-b6f82f2f95a1` | Current                     | Rebuilt at `/`                                        | General form `63f9e4e2f0116a4cabfef7db`  |
| `/starters-academy/` | `e32f0ae1-c188-40d7-b076-eb2635283791` | Current                     | Rebuilt at same route                                 | Starters form `615c9641c71e8685f183bd18` |
| `/prep-course/`      | `7fa562f1-64ad-49b9-9496-d134d3b71af0` | Current                     | Rebuilt at same route                                 | Prep form `6172e62fe625581864e3f857`     |
| `/about-us/`         | `26c2a69c-5711-4a20-b2af-daf4908b0628` | Current                     | Rebuilt at same route                                 | None                                     |
| `/jobs/`             | `19599627-f46b-430c-84cf-75e8a08edcbf` | Current                     | Rebuilt at same route                                 | None                                     |
| `/curriculum/`       | `c308f178-82db-40be-a34c-14ea378e1a33` | Legacy and materially stale | Permanent redirect to `/starters-academy/#curriculum` | None                                     |
| `/faq/`              | `8e322e94-da07-418c-86fd-2aed2693fb87` | Legacy and materially stale | Permanent redirect to `/starters-academy/#faq`        | None                                     |

The snapshot HTML is stored under `migration/raw/`. It is evidence and source material, not production code. It includes generated Unbounce markup and should never be copied into the final application.

## Content decisions

- Current course claims, open learning materials, external resources, video and contact links were retained.
- Dates, pricing and year-specific admission language that had already become stale were replaced with links to the LDSA wiki, the operational source of truth.
- The published volunteer roster was retained without mutable employer/title claims.
- Legacy Curriculum and FAQ content was consolidated into the maintained course pages so old URLs continue to resolve through 301 redirects.

## Still required from Unbounce

- Export the complete list of all 14 published pages and their URLs.
- Export `.unbounce` backups where available.
- Capture desktop and mobile screenshots of each dashboard page.
- Export any Unbounce leads to private storage; never commit lead data.
- Export Script Manager/global scripts and classify each one.
