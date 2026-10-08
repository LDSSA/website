# Contributing

Thank you for helping maintain the LDSA website.

1. Branch from `dev` using a name such as `feature/update-prep-course`.
2. Keep time-sensitive operational details in the LDSA wiki and link to them from the site.
3. Run `npm ci`, `npm run check` and `npm run format:check`.
4. Open a pull request into `dev` and explain the visible change and how it was checked.
5. Test the merged result on the protected Cloudflare `dev` deployment.
6. Promote tested changes with a pull request from `dev` to `main`.

Do not put subscriber exports, application data, API tokens or other secrets in the repository.

When changing a Flodesk form, preserve the form ID, field names and preference values unless the matching Flodesk configuration has also changed. Complete the account-level submission checks in `docs/operations/qa.md` before production promotion.
