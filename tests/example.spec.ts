import { test, expect } from '@playwright/test';

const DEMO_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('TodoMVC Demo Automation', () => {
  test('should add new todo items and mark one completed', async ({ page }) => {
    await page.goto(DEMO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy milk');
    await input.press('Enter');
    await input.fill('Run Playwright CI');
    await input.press('Enter');

    const items = page.getByTestId('todo-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText('Buy milk');
    await expect(items.nth(1)).toContainText('Run Playwright CI');

    await items.nth(0).getByRole('checkbox').check();
    await expect(items.nth(0)).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  });

  test('should filter active and completed todos', async ({ page }) => {
    await page.goto(DEMO_URL);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task');
    await input.press('Enter');
    await input.fill('Done task');
    await input.press('Enter');

    const items = page.getByTestId('todo-item');
    await items.nth(1).getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Active task');

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Done task');
  });
});
