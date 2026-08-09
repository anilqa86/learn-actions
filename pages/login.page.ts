import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorAlert    = page.locator('.oxd-alert-content-text, .oxd-alert--error p');
    this.logo          = page.locator('.orangehrm-login-logo img, .oxd-brand-banner img');
  }

  async open() {
    await this.goto('/');
    await this.waitForVisible(this.usernameInput);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorAlert.waitFor({ state: 'visible', timeout: 8000 });
    return (await this.errorAlert.textContent()) ?? '';
  }
}
