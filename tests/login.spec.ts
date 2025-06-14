import { test, expect } from '@playwright/test';
const credentials = require('../credentials');

test('successful login with valid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill(credentials.validUser.username);
  await page.locator('[data-test="password"]').fill(credentials.validUser.password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.shopping_cart_link')).toBeVisible({ timeout: 10000 });
});

test('failed login with invalid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill(credentials.invalidUser.username);
  await page.locator('[data-test="password"]').fill(credentials.invalidUser.password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
});

test('login with locked out user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill(credentials.lockedOutUser.username);
  await page.locator('[data-test="password"]').fill(credentials.lockedOutUser.password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});

test('login form validation', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
}); 