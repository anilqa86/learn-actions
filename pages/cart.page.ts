import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  // Cart table
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly totalPrice: Locator;

  // Place Order modal
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly orderNameInput: Locator;
  readonly orderCountryInput: Locator;
  readonly orderCityInput: Locator;
  readonly orderCardInput: Locator;
  readonly orderMonthInput: Locator;
  readonly orderYearInput: Locator;
  readonly orderPurchaseButton: Locator;
  readonly orderCloseButton: Locator;

  // Purchase confirmation
  readonly confirmationModal: Locator;
  readonly confirmationText: Locator;
  readonly confirmationOkButton: Locator;

  constructor(page: Page) {
    super(page);
    // Cart
    this.cartTable          = page.locator('#tbodyid');
    this.cartRows           = page.locator('#tbodyid tr');
    this.totalPrice         = page.locator('#totalp');
    this.placeOrderButton   = page.locator('button', { hasText: 'Place Order' });

    // Order modal
    this.orderModal         = page.locator('#orderModal');
    this.orderNameInput     = page.locator('#name');
    this.orderCountryInput  = page.locator('#country');
    this.orderCityInput     = page.locator('#city');
    this.orderCardInput     = page.locator('#card');
    this.orderMonthInput    = page.locator('#month');
    this.orderYearInput     = page.locator('#year');
    this.orderPurchaseButton = this.orderModal.locator('button', { hasText: 'Purchase' });
    this.orderCloseButton   = this.orderModal.locator('button', { hasText: 'Close' });

    // Confirmation SweetAlert
    this.confirmationModal   = page.locator('.sweet-alert');
    this.confirmationText    = page.locator('.sweet-alert p');
    this.confirmationOkButton = page.locator('.sweet-alert button', { hasText: 'OK' });
  }

  /** Navigate to the Cart page */
  async open() {
    await this.goto('cart.html');
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(1000);
  }

  /** Return all product names currently in the cart */
  async getCartItemNames(): Promise<string[]> {
    await this.page.waitForTimeout(800);
    const rows = this.cartRows;
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const nameCell = rows.nth(i).locator('td').nth(1);
      const text = await nameCell.textContent();
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  /** Get the total price string */
  async getTotal(): Promise<string> {
    return (await this.totalPrice.textContent()) ?? '';
  }

  /** Delete a cart row by product name */
  async deleteItem(productName: string) {
    const row = this.cartRows.filter({ hasText: productName });
    await row.locator('a', { hasText: 'Delete' }).click();
    await this.page.waitForTimeout(1000);
  }

  /** Open the Place Order modal */
  async openPlaceOrder() {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
  }

  /** Fill in the order form and click Purchase */
  async fillOrderForm(details: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }) {
    await this.orderNameInput.fill(details.name);
    await this.orderCountryInput.fill(details.country);
    await this.orderCityInput.fill(details.city);
    await this.orderCardInput.fill(details.card);
    await this.orderMonthInput.fill(details.month);
    await this.orderYearInput.fill(details.year);
  }

  /** Click Purchase button and wait for confirmation */
  async submitOrder() {
    await this.orderPurchaseButton.click();
    await this.confirmationModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** Get the confirmation message */
  async getConfirmationMessage(): Promise<string> {
    return (await this.confirmationText.textContent()) ?? '';
  }

  /** Click OK to dismiss confirmation */
  async confirmPurchase() {
    await this.confirmationOkButton.click();
    await this.page.waitForLoadState('load');
  }
}
