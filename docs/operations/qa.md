# Migration QA checklist

Record the tester, date, deployed commit and result for each test. Do not use real subscriber data; use controlled test addresses owned by LDSA.

## Automated checks

- [ ] `npm ci` completes from the lockfile.
- [ ] `npm run check` passes.
- [ ] `npm run format:check` passes.
- [ ] GitHub Actions CI passes on the pull request.
- [ ] Lighthouse meets the repository thresholds for all five maintained routes.
- [ ] Cloudflare deployment is associated with the expected commit and branch.

## Preview access and indexing

- [ ] Signed-out visitors cannot open the `dev` preview.
- [ ] Authorized LDSA testers can open it.
- [ ] Preview responses include `X-Robots-Tag: noindex`.
- [ ] The production candidate has a valid HTTPS certificate.

## Routes and redirects

- [ ] `/`
- [ ] `/starters-academy/`
- [ ] `/prep-course/`
- [ ] `/about-us/`
- [ ] `/jobs/`
- [ ] `/curriculum/` returns a 301 to `/starters-academy/#curriculum`.
- [ ] `/faq/` returns a 301 to `/starters-academy/#faq`.
- [ ] An unknown route renders the custom 404 page.

## Responsive and browser coverage

Test at 320, 375, 390, 768, 1024, 1440 and 1920 CSS pixels.

- [ ] Chrome on desktop and Android-sized viewport.
- [ ] Firefox on desktop.
- [ ] Edge on desktop.
- [ ] Safari on macOS and iOS, when available.
- [ ] Mobile navigation opens, closes and retains keyboard focus visibility.
- [ ] There is no horizontal overflow.
- [ ] Images preserve their aspect ratio and meaningful images have useful alternative text.
- [ ] Reduced-motion preference does not introduce unusable interactions.

## Links and integrations

- [ ] Portal link opens the LDSA Portal.
- [ ] Wiki and course links open the correct current pages.
- [ ] GitHub, LinkedIn, Instagram, Facebook and email links work.
- [ ] YouTube video loads and can be operated by keyboard.
- [ ] Job submission guide opens correctly.

## Flodesk end-to-end tests

Use a unique controlled address for each case, then verify the subscriber in the Flodesk account.

- [ ] General form with only Starters Academy selected reaches the expected segment.
- [ ] General form with only Prep Course selected reaches the expected segment.
- [ ] General form with both selected reaches both expected groups.
- [ ] Starters form reaches the Starters Academy group and triggers the expected confirmation/workflow.
- [ ] Prep form reaches the Prep Course group and triggers the expected confirmation/workflow.
- [ ] Invalid email feedback is understandable and keyboard accessible.
- [ ] A successful submission shows or redirects to the intended confirmation state.

## Production cutover checks

- [ ] `https://lisbondatascience.org/` redirects to the canonical `www` HTTPS hostname.
- [ ] `https://www.lisbondatascience.org/` serves the expected commit.
- [ ] Canonical and Open Graph URLs use the production hostname.
- [ ] `robots.txt` and `sitemap-index.xml` return 200.
- [ ] Security headers from `public/_headers` are present.
- [ ] Cloudflare Web Analytics records a controlled visit.
- [ ] Email delivery still works for the LDSA domain.
- [ ] Cloudflare shows no unexpected 404 or security errors.

After all production checks pass, monitor for seven days before taking the final Unbounce backup and cancelling the subscription.
