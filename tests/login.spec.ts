import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
const credentials = require('../credentials');

test('successful login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.validUser.username, credentials.validUser.password);
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.shopping_cart_link')).toBeVisible({ timeout: 10000 });
});

test('failed login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.invalidUser.username, credentials.invalidUser.password);
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('Username and password do not match');
});

test('login with locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.lockedOutUser.username, credentials.lockedOutUser.password);
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('locked out');
});

test('login form validation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('', '');
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('Username is required');
}); 