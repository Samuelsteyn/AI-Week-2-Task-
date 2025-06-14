import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly productNames: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productList = page.locator('.inventory_list');
    this.productNames = page.locator('.inventory_item_name');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart-"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async isLoaded() {
    await this.productList.waitFor({ state: 'visible' });
  }

  async selectProductByName(name: string) {
    await this.page.locator('.inventory_item_name', { hasText: name }).click();
  }

  async addToCartByTestId(testId: string) {
    await this.page.locator(`[data-test="add-to-cart-${testId}"]`).click();
  }

  async addToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }
} 