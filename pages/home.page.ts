import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  // Category sidebar links
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;

  // Product grid
  readonly productGrid: Locator;
  readonly productCards: Locator;

  // Pagination
  readonly nextButton: Locator;
  readonly prevButton: Locator;

  constructor(page: Page) {
    super(page);
    this.phonesCategory   = page.locator('#itemc', { hasText: 'Phones' });
    this.laptopsCategory  = page.locator('#itemc', { hasText: 'Laptops' });
    this.monitorsCategory = page.locator('#itemc', { hasText: 'Monitors' });
    this.productGrid      = page.locator('#tbodyid');
    this.productCards     = page.locator('#tbodyid .card');
    this.nextButton       = page.locator('#next2');
    this.prevButton       = page.locator('#prev2');
  }

  /** Navigate to home and wait for products to load */
  async open() {
    await this.goto('/');
    await this.productGrid.waitFor({ state: 'visible' });
    // Wait for at least one product card to appear
    await this.page.waitForFunction(() =>
      document.querySelectorAll('#tbodyid .card').length > 0,
      { timeout: 15000 }
    );
  }

  /** Click a category and wait for items to refresh */
  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    const map = {
      Phones: this.phonesCategory,
      Laptops: this.laptopsCategory,
      Monitors: this.monitorsCategory,
    };
    await map[category].click();
    // Wait for product grid to refresh
    await this.page.waitForTimeout(1500);
    await this.page.waitForFunction(() =>
      document.querySelectorAll('#tbodyid .card').length > 0,
      { timeout: 10000 }
    );
  }

  /** Return all visible product names on current page */
  async getProductNames(): Promise<string[]> {
    const titles = this.page.locator('#tbodyid .card-title');
    await titles.first().waitFor({ state: 'visible' });
    return titles.allTextContents();
  }

  /** Click on a product by its title text */
  async clickProduct(name: string) {
    await this.page.locator('#tbodyid .card-title a', { hasText: name }).first().click();
    await this.page.waitForLoadState('load');
  }

  /** Click on the first product card */
  async clickFirstProduct() {
    const first = this.productCards.first();
    await first.waitFor({ state: 'visible' });
    await first.locator('.card-title a').click();
    await this.page.waitForLoadState('load');
  }

  async clickNext() {
    await this.nextButton.click();
    await this.page.waitForTimeout(1500);
  }

  async clickPrevious() {
    await this.prevButton.click();
    await this.page.waitForTimeout(1500);
  }

  /** Count currently visible product cards */
  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
