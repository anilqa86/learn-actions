import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to a path relative to baseURL */
  async goto(path: string = '') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Wait for the OXD spinner/loader to disappear */
  async waitForSpinner() {
    const spinner = this.page.locator('.oxd-loading-spinner');
    try {
      await spinner.waitFor({ state: 'visible', timeout: 2000 });
      await spinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch {
      // Spinner may not appear for fast responses
    }
  }

  /** Wait for a locator to be visible */
  async waitForVisible(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /** Helper: get toast/alert message text */
  async getToastMessage(): Promise<string> {
    const toast = this.page.locator('.oxd-toast-content span:nth-child(2), .oxd-toast');
    await toast.first().waitFor({ state: 'visible', timeout: 5000 });
    return (await toast.first().textContent()) ?? '';
  }

  /**
   * Register a one-time listener for the next browser dialog (alert/confirm/prompt).
   * Automatically accepts the dialog and resolves with its message.
   */
  listenForDialog(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }
}
