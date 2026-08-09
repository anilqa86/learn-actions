import { test, expect } from '../fixtures/test-fixtures';

/**
 * Authentication Tests — DemoBlaze Product Store
 * Covers: Sign Up, Log In, Welcome greeting, and Log Out flows.
 *
 * Uses a unique timestamp-based username so tests are idempotent
 * even when run multiple times against the shared demo server.
 */
test.describe('DemoBlaze - Authentication Tests', () => {
  // Unique credentials shared within this describe block
  const timestamp  = Date.now();
  const username   = `testuser_${timestamp}`;
  const password   = 'TestPass123!';

  test('TC201 - should open Sign Up modal and register a new user', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openSignupModal();

    await expect(authModal.signupModal).toBeVisible();
    await expect(authModal.signupModal.locator('.modal-title')).toContainText('Sign up');

    const alertMsg = await authModal.signUp(username, password);
    expect(alertMsg).toMatch(/successful|already exist/i);
  });

  test('TC202 - should open Log In modal and log in with registered credentials', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openLoginModal();

    await expect(authModal.loginModal).toBeVisible();
    await expect(authModal.loginModal.locator('.modal-title')).toContainText('Log in');

    await authModal.logIn(username, password);

    // Verify welcome label shows the logged-in username
    const welcomeText = await nav.getWelcomeText();
    expect(welcomeText.toLowerCase()).toContain(username.toLowerCase());
  });

  test('TC203 - should show welcome greeting with username after login', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openLoginModal();
    await authModal.logIn(username, password);

    const welcomeText = await nav.getWelcomeText();
    expect(welcomeText).toContain('Welcome');
    expect(welcomeText.toLowerCase()).toContain(username.toLowerCase());
  });

  test('TC204 - should log out successfully', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openLoginModal();
    await authModal.logIn(username, password);

    // Verify logged in
    expect(await nav.isLoggedIn()).toBe(true);

    // Log out
    await nav.clickLogout();
    await homePage.page.waitForTimeout(1000);

    // Log in link should be visible again
    await expect(nav.loginLink).toBeVisible();
  });

  test('TC205 - should show alert for login with wrong password', async ({ homePage, nav, authModal, page }) => {
    await homePage.open();
    await nav.openLoginModal();

    // Set up dialog listener before clicking
    const dialogPromise = authModal.listenForDialog();
    await authModal.loginUsernameInput.fill('nonexistentuser_xyz');
    await authModal.loginPasswordInput.fill('WrongPass!');
    await authModal.loginButton.click();
    const alertMsg = await dialogPromise;

    expect(alertMsg).toBeTruthy();
    // The app shows "User does not exist." or similar
    expect(alertMsg.length).toBeGreaterThan(0);
  });

  test('TC206 - should close Sign Up modal without registering', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openSignupModal();
    await expect(authModal.signupModal).toBeVisible();
    await authModal.closeSignupModal();
    await expect(authModal.signupModal).not.toBeVisible();
  });

  test('TC207 - should close Log In modal without logging in', async ({ homePage, nav, authModal }) => {
    await homePage.open();
    await nav.openLoginModal();
    await expect(authModal.loginModal).toBeVisible();
    await authModal.closeLoginModal();
    await expect(authModal.loginModal).not.toBeVisible();
  });
});
