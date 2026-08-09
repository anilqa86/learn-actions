import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AuthModal extends BasePage {
  // --- Sign Up modal ---
  readonly signupModal: Locator;
  readonly signupUsernameInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupButton: Locator;
  readonly signupCloseButton: Locator;

  // --- Log In modal ---
  readonly loginModal: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    // Sign Up
    this.signupModal         = page.locator('#signInModal');
    this.signupUsernameInput = page.locator('#sign-username');
    this.signupPasswordInput = page.locator('#sign-password');
    this.signupButton        = this.signupModal.locator('button:has-text("Sign up")');
    this.signupCloseButton   = this.signupModal.locator('button:has-text("Close")');

    // Log In
    this.loginModal         = page.locator('#logInModal');
    this.loginUsernameInput = page.locator('#loginusername');
    this.loginPasswordInput = page.locator('#loginpassword');
    this.loginButton        = this.loginModal.locator('button:has-text("Log in")');
    this.loginCloseButton   = this.loginModal.locator('button:has-text("Close")');
  }

  /**
   * Fills in and submits the Sign Up form.
   * Returns the alert message (e.g. "Sign up successful." or "This user already exist.").
   */
  async signUp(username: string, password: string): Promise<string> {
    await this.signupUsernameInput.fill(username);
    await this.signupPasswordInput.fill(password);
    const dialogPromise = this.listenForDialog();
    await this.signupButton.click();
    return dialogPromise;
  }

  /**
   * Fills in and submits the Log In form.
   * The modal closes automatically on success and #nameofuser appears.
   */
  async logIn(username: string, password: string) {
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
    // Wait for modal to close and page to update
    await this.loginModal.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await this.page.waitForTimeout(800);
  }

  async closeSignupModal() {
    await this.signupCloseButton.click();
    await this.signupModal.waitFor({ state: 'hidden' });
  }

  async closeLoginModal() {
    await this.loginCloseButton.click();
    await this.loginModal.waitFor({ state: 'hidden' });
  }
}
