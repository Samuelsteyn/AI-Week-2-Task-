import { test, expect } from '@playwright/test';

test.describe('Basic Tests', () => {
  test('basic test', async ({ page }) => {
    // Navigate to a website
    await page.goto('https://playwright.dev/');
    
    // Verify the title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Click on the "Get Started" link
    await page.getByRole('link', { name: 'Get Started' }).click();
    
    // Verify we're on the getting started page
    await expect(page).toHaveURL(/.*intro/);
  });
}); 