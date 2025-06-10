import { test, expect } from '@playwright/test';

test('successful login with valid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.shopping_cart_link')).toBeVisible();
}); 