# playwright-scheduled-ci

Sample Playwright end-to-end automation suite targeting [SauceDemo](https://www.saucedemo.com/) with 20 test cases, configured to run on a schedule via GitHub Actions with screenshots enabled and automatic report publishing to GitHub Pages.

## Test Suite (`tests/saucedemo.spec.ts` — 20 Test Cases)
1. **TC-01**: Login succeeds with `standard_user` and lands on inventory page
2. **TC-02**: Login fails with `locked_out_user` and displays locked out error
3. **TC-03**: Login fails with invalid credentials and displays mismatch error
4. **TC-04**: Login validation requires username when fields are empty
5. **TC-05**: Login validation requires password when only username is provided
6. **TC-06**: Login error banner can be dismissed
7. **TC-07**: Unauthenticated access to inventory redirects to login with error
8. **TC-08**: Inventory page displays all 6 products with default A-to-Z sorting
9. **TC-09**: Inventory sorts products Z to A
10. **TC-10**: Inventory sorts products by price low to high
11. **TC-11**: Inventory sorts products by price high to low
12. **TC-12**: Add and remove product from inventory updates cart badge
13. **TC-13**: Add multiple products including special-character slug updates cart badge
14. **TC-14**: Product detail page displays details, toggles cart, and navigates back
15. **TC-15**: Cart page lists added items, supports removal, and continues shopping
16. **TC-16**: Checkout step one validates required first name, last name, and postal code
17. **TC-17**: Checkout step one cancel returns to cart preserving items
18. **TC-18**: Checkout step two calculates item total, 8% tax, and grand total
19. **TC-19**: Complete end-to-end checkout flow clears cart and shows confirmation
20. **TC-20**: Sidebar menu supports Reset App State and Logout

## GitHub Actions Workflow (`.github/workflows/playwright.yml`)
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
