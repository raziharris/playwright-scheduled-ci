import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginAs(page: Page, username: string, password: string = 'secret_sauce') {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('SauceDemo Authentication', () => {
  test('TC-01: Login succeeds with standard_user and lands on inventory page', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('TC-02: Login fails with locked_out_user and displays locked out error', async ({ page }) => {
    await loginAs(page, 'locked_out_user');
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC-03: Login fails with invalid credentials and displays mismatch error', async ({ page }) => {
    await loginAs(page, 'invalid_user', 'wrong_pass');
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('TC-04: Login validation requires username when fields are empty', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username is required'
    );
  });

  test('TC-05: Login validation requires password when only username is provided', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Password is required'
    );
  });

  test('TC-06: Login error banner can be dismissed', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await page.locator('[data-test="error-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });

  test('TC-07: Unauthenticated access to inventory redirects to login with error', async ({ page }) => {
    await page.goto(`${BASE_URL}inventory.html`);
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });
});

test.describe('SauceDemo Inventory & Sorting', () => {
  test('TC-08: Inventory page displays all 6 products with default A-to-Z sorting', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(names).toHaveLength(6);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('TC-09: Inventory sorts products Z to A', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const names = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('TC-10: Inventory sorts products by price low to high', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const priceTexts = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-11: Inventory sorts products by price high to low', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const priceTexts = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

test.describe('SauceDemo Cart & Product Details', () => {
  test('TC-12: Add and remove product from inventory updates cart badge', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });

  test('TC-13: Add multiple products including special-character slug updates cart badge', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
  });

  test('TC-14: Product detail page displays details, toggles cart, and navigates back', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');

    await page.locator('[data-test="add-to-cart"]').click();
    await expect(page.locator('[data-test="remove"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-15: Cart page lists added items, supports removal, and continues shopping', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);

    await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});

test.describe('SauceDemo Checkout & Navigation', () => {
  test('TC-16: Checkout step one validates required first name, last name, and postal code', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

    await page.locator('[data-test="firstName"]').fill('Razi');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

    await page.locator('[data-test="lastName"]').fill('Harris');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
  });

  test('TC-17: Checkout step one cancel returns to cart preserving items', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
  });

  test('TC-18: Checkout step two calculates item total, 8% tax, and grand total', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Razi');
    await page.locator('[data-test="lastName"]').fill('Harris');
    await page.locator('[data-test="postalCode"]').fill('50000');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');
  });

  test('TC-19: Complete end-to-end checkout flow clears cart and shows confirmation', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Razi');
    await page.locator('[data-test="lastName"]').fill('Harris');
    await page.locator('[data-test="postalCode"]').fill('50000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-20: Sidebar menu supports Reset App State and Logout', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="reset-sidebar-link"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
