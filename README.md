# playwright-scheduled-ci

Sample Playwright end-to-end automation project configured to run on a schedule via GitHub Actions.

## What's Included
- `tests/example.spec.ts` — Sample Playwright tests against the stable TodoMVC demo app (`https://demo.playwright.dev/todomvc/#/`) covering adding, completing, and filtering todos
- `playwright.config.ts` — Playwright configuration (Chromium, HTML + list reporters)
- `.github/workflows/playwright.yml` — GitHub Actions workflow triggered:
  - **On schedule**: daily at `00:00 UTC` (`08:00 MYT`) via `cron: '0 0 * * *'`
  - **Manually**: via `workflow_dispatch` in the GitHub Actions tab
  - **On push**: to `main`

## Local Usage
```bash
npm install
npx playwright install chromium
npm test
```
