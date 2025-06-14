import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
const credentials = require('../credentials');

// Store browser context for cleanup
let browser;

test.beforeAll(async ({ browser: browserContext }) => {
  browser = browserContext;
});

test.afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test.describe('E2E Test Suite', () => {
  test.describe('Login Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
    });

    test('successful login with valid credentials', async ({ page }) => {
      await page.locator('[data-test="username"]').fill(credentials.validUser.username);
      await page.locator('[data-test="password"]').fill(credentials.validUser.password);
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });

    test('failed login with invalid credentials', async ({ page }) => {
      await page.locator('[data-test="username"]').fill(credentials.invalidUser.username);
      await page.locator('[data-test="password"]').fill(credentials.invalidUser.password);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    });

    test('login with locked out user', async ({ page }) => {
      await page.locator('[data-test="username"]').fill(credentials.lockedOutUser.username);
      await page.locator('[data-test="password"]').fill(credentials.lockedOutUser.password);
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    });

    test('login form validation', async ({ page }) => {
      await page.locator('[data-test="login-button"]').click();
      await expect(page.locator('[data-test="error"]')).toBeVisible();
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    });
  });

  test.describe('Product Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each product test
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill(credentials.validUser.username);
      await page.locator('[data-test="password"]').fill(credentials.validUser.password);
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL(/.*inventory.html/);
      await page.waitForSelector('.inventory_list');
    });

    test('add products to cart', async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addToCartByTestId('sauce-labs-backpack');
      await inventoryPage.addToCartByTestId('sauce-labs-bike-light');
      await expect(inventoryPage.cartBadge).toHaveText('2');
      await inventoryPage.openCart();
      await page.waitForSelector('.cart_list');
      await expect(page).toHaveURL(/.*cart.html/);
      const cartItems = await page.locator('.cart_item').count();
      expect(cartItems).toBe(2);
    });

    test('select and view a product', async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.isLoaded();
      const firstProductName = await inventoryPage.productNames.first().textContent();
      expect(firstProductName).toBeTruthy();
      await inventoryPage.productNames.first().click();
      await page.waitForSelector('.inventory_details_name');
      await expect(page.locator('.inventory_details_name')).toHaveText(String(firstProductName));
    });
  });

  // Final cleanup test to ensure browser closes
  test.describe('Cleanup', () => {
    test('close browser', async ({ context }) => {
      // Close the context which will close all pages
      await context.close();
    });
  });
}); 