import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class NavComponent extends BasePage {
  readonly homeLink: Locator;
  readonly cartLink: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutLink: Locator;
  readonly contactLink: Locator;
  readonly aboutUsLink: Locator;
  readonly welcomeUser: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink     = page.locator('.navbar-nav a.nav-link', { hasText: 'Home' });
    this.cartLink     = page.locator('#cartur');
    this.loginLink    = page.locator('#login2');
    this.signupLink   = page.locator('#signin2');
    this.logoutLink   = page.locator('#logout2');
    this.contactLink  = page.locator('a[data-target="#exampleModal"]');
    this.aboutUsLink  = page.locator('a[data-target="#video-about-us"]');
    this.welcomeUser  = page.locator('#nameofuser');
  }

  async openLoginModal() {
    await this.loginLink.click();
    await this.page.locator('#logInModal').waitFor({ state: 'visible' });
  }

  async openSignupModal() {
    await this.signupLink.click();
    await this.page.locator('#signInModal').waitFor({ state: 'visible' });
  }

  async getWelcomeText(): Promise<string> {
    await this.welcomeUser.waitFor({ state: 'visible', timeout: 8000 });
    return (await this.welcomeUser.textContent()) ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async clickCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('load');
  }
}
