# Website architecture

## System shape

```text
GitHub repository
  ├─ feature/* pull requests ── CI ──> dev
  ├─ dev ── verified GitHub Action ──> protected Cloudflare preview
  └─ main ── verified GitHub Action ──> Cloudflare production
                                              │
                                              ├─ static HTML, CSS and images
                                              ├─ Flodesk form submissions
                                              ├─ LDSA Portal and Wiki links
                                              └─ privacy-enhanced YouTube embed
```

The site is generated at build time by Astro and deployed as static files. There is no application server, database, runtime JavaScript framework or server-side session. Cloudflare provides TLS, CDN caching, preview deployments, Access control, deployment history and Web Analytics.

All migration infrastructure uses free services and open-source tooling: Astro, Node.js, npm, GitHub Actions within the repository's included allowance, Cloudflare Pages, Cloudflare Web Analytics, and Cloudflare Access Free for the small LDSA testing group. The domain registration/renewal remains the only unavoidable website infrastructure cost. Do not add a paid hosting, build, monitoring, analytics, testing, or CDN dependency without an explicit architecture decision.

## Why Astro

Astro provides reusable components and typed content without shipping a client framework to visitors. Header, footer, metadata, FAQs and Flodesk markup have one maintained implementation. Pages remain ordinary semantic HTML in the build output, which keeps performance high and reduces the maintenance surface for volunteers.

## Why there is no Docker image

The deployable artifact is the deterministic `dist` directory. GitHub-hosted runners and Cloudflare Pages only need the locked Node.js toolchain to create it. A Docker image would add another dependency and patching surface without improving runtime parity because there is no container at runtime. The `.nvmrc`, `engines` field and `package-lock.json` already pin the relevant build environment.

## Content ownership

- Stable marketing and explanatory content lives in version-controlled Astro pages.
- Shared navigation, official links, FAQs and roster data live in `src/data/site.ts`.
- Batch dates, admissions rules and other frequently changing details live in the LDSA wiki and are linked from the website.
- Subscriber records and email automations remain in Flodesk.
- Applications remain in the LDSA Portal.

This separation prevents the website from becoming a second, stale source of truth for operational course details.

## Integration boundaries

Flodesk form identifiers, endpoints, preference values, configuration and runtime bundles are treated as public integration contracts and covered by the production-build test. A successful browser submission still requires Flodesk account verification because only Flodesk can prove which subscriber group and automation received the address.

External destinations use normal links. The YouTube video uses the privacy-enhanced domain and lazy loading. No third-party analytics script is included in the source; Cloudflare Web Analytics is enabled at the hosting layer.

## Security and privacy

Cloudflare `_headers` set a restrictive Content Security Policy, disable framing, narrow browser capabilities and prevent MIME sniffing. The policy allows only the Flodesk and YouTube origins needed by current features. Deployment credentials live in GitHub Secrets and are limited to Pages edit access. Preview access will be enforced by Cloudflare Access after the dashboard policy and CI service token in the Cloudflare runbook are configured.

The repository must never contain Unbounce lead exports, subscriber lists, Cloudflare tokens or other personal/secret data.
