# Redirect map

Cloudflare Pages reads these rules from `public/_redirects`.

| Source                                               | Destination                     | Status | Reason                                |
| ---------------------------------------------------- | ------------------------------- | ------ | ------------------------------------- |
| `/curriculum` and `/curriculum/`                     | `/starters-academy/#curriculum` | 301    | Consolidated, maintained curriculum   |
| `/faq` and `/faq/`                                   | `/starters-academy/#faq`        | 301    | Consolidated, maintained FAQ          |
| `/home`                                              | `/`                             | 301    | Canonical homepage                    |
| `/index.html`                                        | `/`                             | 301    | Canonical homepage                    |
| `/comms-associate-position[/]`                       | `/about-us/`                    | 301    | Expired 2018 volunteer vacancy        |
| `/pythonzerotohero[/]`                               | `/prep-course/`                 | 301    | Historical predecessor course         |
| `/a-form_confirmation.html`                          | `/`                             | 301    | Retired Unbounce confirmation route   |
| `/b-form_confirmation.html`                          | `/`                             | 301    | Retired Unbounce confirmation route   |
| `/d-form_confirmation.html`                          | `/`                             | 301    | Retired homepage confirmation route   |
| `/comms-associate-position/a-form_confirmation.html` | `/about-us/`                    | 301    | Retired vacancy confirmation route    |
| `/curriculum/a-form_confirmation.html`               | `/starters-academy/`            | 301    | Retired curriculum confirmation route |

These rules cover every distinct public or archived same-domain route found during the public-evidence audit. Unknown, account-only Unbounce URLs cannot be recovered from the suspended account and are tracked as a documented limitation rather than a release blocker.
