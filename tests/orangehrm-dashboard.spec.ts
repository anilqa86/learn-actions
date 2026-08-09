import { test, expect } from '../fixtures/test-fixtures';

/**
 * Dashboard Tests — OrangeHRM Open Source Demo
 * Covers: widget presence, sidebar navigation, page titles, profile dropdown.
 *
 * All tests in this suite start from a logged-in dashboard state via beforeEach.
 */
test.describe('OrangeHRM - Dashboard Tests', () => {
  const VALID_USER = 'Admin';
  const VALID_PASS = 'admin123';

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(VALID_USER, VALID_PASS);
    await dashboardPage.waitForDashboard();
  });

  test('TC501 - should display at least one dashboard widget after login', async ({ dashboardPage }) => {
    const widgetCount = await dashboardPage.getDashboardWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);
  });

  test('TC502 - should show the user profile dropdown in the top bar', async ({ dashboardPage }) => {
    await expect(dashboardPage.userDropdown).toBeVisible();
    const name = await dashboardPage.getUserProfileName();
    expect(name.trim().length).toBeGreaterThan(0);
  });

  test('TC503 - should display the sidebar with core navigation modules', async ({ orangeNav }) => {
    const modules = await orangeNav.getMenuItemNames();
    const normalized = modules.map(m => m.trim().toLowerCase());

    // Core OrangeHRM modules expected to be present
    expect(normalized).toContain('dashboard');
    expect(normalized.some(m => m.includes('pim') || m.includes('employee'))).toBe(true);
    expect(normalized.some(m => m.includes('leave'))).toBe(true);
  });

  test('TC504 - should navigate to PIM module via sidebar', async ({ orangeNav, page }) => {
    await orangeNav.navigateTo('PIM');
    await page.waitForURL(/pim/, { timeout: 15000 });
    await expect(page).toHaveURL(/pim/);

    const title = await orangeNav.getPageTitle();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('TC505 - should navigate to Leave module via sidebar', async ({ orangeNav, page }) => {
    await orangeNav.navigateTo('Leave');
    await page.waitForURL(/leave/, { timeout: 15000 });
    await expect(page).toHaveURL(/leave/);
  });

  test('TC506 - should navigate to Recruitment module via sidebar', async ({ orangeNav, page }) => {
    await orangeNav.navigateTo('Recruitment');
    await page.waitForURL(/recruitment/, { timeout: 15000 });
    await expect(page).toHaveURL(/recruitment/);
  });

  test('TC507 - should show Logout option inside the profile dropdown', async ({ dashboardPage }) => {
    await dashboardPage.userDropdown.click();
    await expect(dashboardPage.logoutOption).toBeVisible();
    // Close without logging out by pressing Escape
    await dashboardPage.page.keyboard.press('Escape');
  });

  test('TC508 - should return to login page after logout from dashboard', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.logout();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.page).toHaveURL(/login/);
  });
});
