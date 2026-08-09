import { test, expect } from '../fixtures/test-fixtures';

/**
 * Authentication Tests — OrangeHRM Open Source Demo
 * URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
 * Covers: Login page structure, valid login, invalid credentials, logout.
 *
 * Credentials: Admin / admin123 (default demo account)
 */
test.describe('OrangeHRM - Authentication Tests', () => {
  const VALID_USER = 'Admin';
  const VALID_PASS = 'admin123';

  test.describe('Login Page Structure', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
    });

    test('TC401 - should display login page with all key elements', async ({ loginPage }) => {
      await expect(loginPage.logo).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('TC402 - should have correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(/OrangeHRM/i);
    });

    test('TC403 - should show inline required-field errors for empty credentials', async ({ loginPage }) => {
      await loginPage.loginButton.click();
      // OrangeHRM shows per-field "Required" span elements, not a toast/alert
      const requiredErrors = loginPage.page.locator('.oxd-input-field-error-message');
      await requiredErrors.first().waitFor({ state: 'visible', timeout: 8000 });
      const errorCount = await requiredErrors.count();
      expect(errorCount).toBeGreaterThanOrEqual(2); // username + password fields
    });

    test('TC404 - should show error for invalid username and password', async ({ loginPage }) => {
      await loginPage.login('wronguser', 'wrongpass');
      const error = await loginPage.getErrorMessage();
      expect(error).toMatch(/invalid credentials/i);
    });

    test('TC405 - should show error for valid username with wrong password', async ({ loginPage }) => {
      await loginPage.login(VALID_USER, 'badpassword');
      const error = await loginPage.getErrorMessage();
      expect(error).toMatch(/invalid credentials/i);
    });
  });

  test.describe('Valid Login & Session', () => {
    test('TC406 - should log in successfully and land on dashboard', async ({ loginPage, dashboardPage }) => {
      await loginPage.open();
      await loginPage.login(VALID_USER, VALID_PASS);
      await dashboardPage.waitForDashboard();

      await expect(dashboardPage.userDropdown).toBeVisible();
      await expect(loginPage.page).toHaveURL(/dashboard/);
    });

    test('TC407 - should display the Admin username in the top-right profile dropdown', async ({ loginPage, dashboardPage }) => {
      await loginPage.open();
      await loginPage.login(VALID_USER, VALID_PASS);
      await dashboardPage.waitForDashboard();

      const profileName = await dashboardPage.getUserProfileName();
      expect(profileName.trim().length).toBeGreaterThan(0);
    });

    test('TC408 - should log out and redirect back to the login page', async ({ loginPage, dashboardPage }) => {
      await loginPage.open();
      await loginPage.login(VALID_USER, VALID_PASS);
      await dashboardPage.waitForDashboard();

      await dashboardPage.logout();

      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.page).toHaveURL(/login/);
    });

    test('TC409 - should not access dashboard without logging in', async ({ page }) => {
      await page.goto('web/index.php/dashboard/index');
      // Unauthenticated access should redirect to login
      await page.waitForURL(/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/login/);
    });
  });
});
