import { Page, Locator, expect } from '@playwright/test';

class DashboardPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly productNames: Locator;
  readonly productSort: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly cartList: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.productNames = page.locator('.inventory_item_name');
    this.productSort = page.locator('[data-test="product_sort_container"]');
    this.productPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
  }

  async waitForInventory() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await this.inventoryList.waitFor();
  }

  async expectProductListVisible() {
    await expect(this.inventoryList).toBeVisible({ timeout: 10000 });
  }

  async getFirstProductName() {
    return await this.productNames.first().textContent();
  }

  async clickFirstProduct() {
    await this.productNames.first().click();
    await this.page.waitForSelector('.inventory_details_name');
  }

  async expectProductDetailsPage(productName: string) {
    await expect(this.page.locator('.inventory_details_name')).toHaveText(String(productName));
  }

  async addToCart(productId: string) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async expectCartBadge(count: string) {
    await this.cartBadge.waitFor();
    await expect(this.cartBadge).toHaveText(count);
  }

  async sortBy(option: string) {
    await this.productSort.waitFor();
    await this.productSort.selectOption(option);
    await this.page.waitForTimeout(1000);
  }

  async getAllProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
    await this.cartList.waitFor();
  }

  async expectOnCartPage() {
    await expect(this.page).toHaveURL(/.*cart.html/);
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async getAllProductNames() {
    await this.productNames.first().waitFor();
    return await this.productNames.allTextContents();
  }

  async expectProductNameVisible(name: string) {
    await expect(this.page.locator('.inventory_item_name', { hasText: name })).toBeVisible();
  }
}

export { DashboardPage }; 