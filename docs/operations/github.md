# GitHub repository controls

Apply repository rulesets to `dev` and `main` after those branches exist.

## `dev`

- Require a pull request with at least one approval.
- Require the `Build and verify` status check.
- Require branches to be up to date before merging.
- Require conversation resolution.
- Block force pushes and deletion.
- Allow squash merging.

## `main`

- Require a pull request with at least one approval.
- Require the `Build and verify` status check.
- Require branches to be up to date before merging.
- Require conversation resolution.
- Block force pushes and deletion.
- Restrict the normal merge source to `dev` through team convention.
- Protect the `production` GitHub environment with a maintainer approval.

## Normal change flow

```text
feature/* → pull request → dev → protected Cloudflare preview
dev → acceptance testing → pull request → main → production deployment
```

Dependabot checks npm and GitHub Action dependencies monthly. Dependency pull requests follow the same CI and review rules.
