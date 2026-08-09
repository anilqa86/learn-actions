import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName        = page.locator('.name');
    this.productPrice       = page.locator('.price-container');
    this.productDescription = page.locator('#more-information p');
    this.addToCartButton    = page.locator('a.btn', { hasText: 'Add to cart' });
  }

  /** Get product name text */
  async getName(): Promise<string> {
    await this.productName.waitFor({ state: 'visible' });
    return (await this.productName.textContent()) ?? '';
  }

  /** Get price text */
  async getPrice(): Promise<string> {
    await this.productPrice.waitFor({ state: 'visible' });
    return (await this.productPrice.textContent()) ?? '';
  }

  /**
   * Click "Add to cart" and accept the browser alert.
   * Returns the alert message text.
   */
  async addToCart(): Promise<string> {
    const dialogPromise = this.listenForDialog();
    await this.addToCartButton.click();
    return dialogPromise;
  }
}
