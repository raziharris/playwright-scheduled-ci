# playwright-scheduled-ci

Sample Playwright end-to-end automation project configured to run on a schedule via GitHub Actions, with screenshots enabled and automatic report publishing to GitHub Pages.

## What's Included
- `tests/example.spec.ts` — Playwright tests against the stable TodoMVC demo app (`https://demo.playwright.dev/todomvc/#/`) covering adding, completing, and filtering todos.
- `playwright.config.ts` — Playwright configuration (Chromium, `screenshot: 'on'` for all runs, HTML, JSON, GitHub, and list reporters).
- `.github/workflows/playwright.yml` — GitHub Actions workflow triggered:
  - **On schedule**: daily at `00:00 UTC` (`08:00 MYT`) via `cron: '0 0 * * *'`
  - **Manually**: via `workflow_dispatch` in the GitHub Actions tab
  - **On push**: to `main`

## Viewing Test Reports
1. **GitHub Pages (Live URL)**: View the latest published HTML report with screenshots at:
   `https://raziharris.github.io/playwright-scheduled-ci/`
2. **GitHub Actions Job Summary**: Open any run under the **Actions** tab to see the Markdown pass/fail summary table directly on the run page.
3. **Actions Artifact (ZIP)**: Scroll to **Artifacts** at the bottom of a run summary to download `playwright-report.zip`, then unzip and run:
   ```bash
   npx playwright show-report playwright-report
   ```

## Local Usage
```bash
npm install
npx playwright install chromium
npm test
```
