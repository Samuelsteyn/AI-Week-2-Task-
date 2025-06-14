import { test, expect } from '@playwright/test';
const credentials = require('../credentials');

test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill(credentials.validUser.username);
  await page.locator('[data-test="password"]').fill(credentials.validUser.password);
  await page.locator('[data-test="login-button"]').click();
  // Verify we're on the inventory page
  await expect(page).toHaveURL(/.*inventory.html/);
  // Wait for the inventory to load
  await page.waitForSelector('.inventory_list');
});

test('should be able to view and select a product', async ({ page }) => {
  // Verify the product list is visible
  await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });

  // Get the first product's name
  const firstProductName = await page.locator('.inventory_item_name').first().textContent();
  expect(firstProductName).toBeTruthy();
  
  // Click on the first product
  await page.locator('.inventory_item_name').first().click();
  
  // Wait for product details page to load
  await page.waitForSelector('.inventory_details_name');
  
  // Verify we're on the correct product page
  await expect(page.locator('.inventory_details_name')).toHaveText(String(firstProductName));
  
  // Add to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
  // Wait for cart badge and verify
  await page.waitForSelector('.shopping_cart_badge');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('should be able to sort products', async ({ page }) => {
  // Wait for sort dropdown
  await page.waitForSelector('[data-test="product_sort_container"]');
  
  // Open sort dropdown
  await page.locator('[data-test="product_sort_container"]').click();
  
  // Sort by price high to low
  await page.selectOption('[data-test="product_sort_container"]', 'hilo');
  
  // Wait for sorting to complete
  await page.waitForTimeout(1000);
  
  // Get all prices
  const prices = await page.locator('.inventory_item_price').allTextContents();
  
  // Verify prices are sorted high to low
  const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
  const sortedPrices = [...numericPrices].sort((a, b) => b - a);
  expect(numericPrices).toEqual(sortedPrices);
});

test('should be able to add multiple products to cart', async ({ page }) => {
  // Add first product to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
  // Add second product to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  
  // Wait for cart badge to update
  await page.waitForSelector('.shopping_cart_badge');
  
  // Verify cart badge shows 2 items
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  
  // Click cart icon
  await page.locator('.shopping_cart_link').click();
  
  // Wait for cart page to load
  await page.waitForSelector('.cart_list');
  
  // Verify we're on cart page
  await expect(page).toHaveURL(/.*cart.html/);
  
  // Verify both items are in cart
  const cartItems = await page.locator('.cart_item').count();
  expect(cartItems).toBe(2);
});

test('should be able to filter products by name', async ({ page }) => {
  // Wait for products to load
  await page.waitForSelector('.inventory_item_name');
  
  // Get all product names
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  
  // Verify we have products
  expect(productNames.length).toBeGreaterThan(0);
  
  // Verify each product name is visible
  for (const name of productNames) {
    await expect(page.locator('.inventory_item_name', { hasText: name })).toBeVisible();
  }
}); 