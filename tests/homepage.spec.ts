import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { DashboardPage } from './pages/dashboard.page';
const credentials = require('../credentials');

test.beforeEach(async ({ page }) => {
  // Login before each test
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.validUser.username, credentials.validUser.password);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.waitForInventory();
});

test('should be able to view and select a product', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.expectProductListVisible();
  const firstProductName = await dashboardPage.getFirstProductName();
  expect(firstProductName).toBeTruthy();
  await dashboardPage.clickFirstProduct();
  await dashboardPage.expectProductDetailsPage(firstProductName ?? '');
  await dashboardPage.addToCart('sauce-labs-backpack');
  await dashboardPage.expectCartBadge('1');
});

test('should be able to sort products', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.sortBy('hilo');
  const numericPrices = await dashboardPage.getAllProductPrices();
  const sortedPrices = [...numericPrices].sort((a, b) => b - a);
  expect(numericPrices).toEqual(sortedPrices);
});

test('should be able to add multiple products to cart', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.addToCart('sauce-labs-backpack');
  await dashboardPage.addToCart('sauce-labs-bike-light');
  await dashboardPage.expectCartBadge('2');
  await dashboardPage.goToCart();
  await dashboardPage.expectOnCartPage();
  const cartItems = await dashboardPage.getCartItemsCount();
  expect(cartItems).toBe(2);
});

test('should be able to filter products by name', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const productNames = await dashboardPage.getAllProductNames();
  expect(productNames.length).toBeGreaterThan(0);
  for (const name of productNames) {
    await dashboardPage.expectProductNameVisible(name);
  }
}); 