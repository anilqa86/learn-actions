import { test, expect } from '../fixtures/test-fixtures';

/**
 * Leave Module Tests — OrangeHRM Open Source Demo
 * Covers: module navigation, My Leave List, Apply Leave form structure.
 *
 * Note: Submitting a real leave request on the shared demo server is avoided
 * to prevent polluting the shared dataset. Tests validate navigation,
 * form presence, and read-only list interactions instead.
 */
test.describe('OrangeHRM - Leave Module Tests', () => {
  const VALID_USER = 'Admin';
  const VALID_PASS = 'admin123';

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(VALID_USER, VALID_PASS);
    await dashboardPage.waitForDashboard();
  });

  test('TC701 - should navigate to the Leave module from the sidebar', async ({ orangeNav, page }) => {
    await orangeNav.navigateTo('Leave');
    await page.waitForURL(/leave/, { timeout: 15000 });
    await expect(page).toHaveURL(/leave/);
  });

  test('TC702 - should open My Leave List and display the table', async ({ leavePage }) => {
    await leavePage.openMyLeaveList();
    await expect(leavePage.page).toHaveURL(/viewMyLeaveList/);
  });

  test('TC703 - should show zero or more leave rows in My Leave List', async ({ leavePage }) => {
    await leavePage.openMyLeaveList();
    const rowCount = await leavePage.getMyLeaveRowCount();
    // Count can be 0 on a fresh demo account — just verify it is a valid number
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC704 - should open the Apply Leave page when Apply link is clicked', async ({ leavePage }) => {
    await leavePage.openLeaveModule();
    await leavePage.applyLeaveButton.click();
    await leavePage.page.waitForURL(/applyLeave/, { timeout: 10000 });
    await leavePage.waitForSpinner();

    // The Admin demo account has no leave balance, so the page renders a
    // "No Leave Types with Leave Balance" message instead of a form.
    // Either outcome is valid — confirm the page loaded successfully.
    const noBalanceMsg = leavePage.page.locator('text=No Leave Types with Leave Balance');
    const leaveTypeDropdownVisible = await leavePage.leaveTypeDropdown.isVisible().catch(() => false);
    const noBalanceMsgVisible      = await noBalanceMsg.isVisible().catch(() => false);

    expect(leaveTypeDropdownVisible || noBalanceMsgVisible).toBe(true);
  });

  test('TC705 - should display My Leave List page when navigated directly', async ({ leavePage }) => {
    await leavePage.openMyLeaveList();
    await expect(leavePage.page).toHaveURL(/viewMyLeaveList/);

    // The page title should be visible
    const title = leavePage.page.locator('h6.oxd-text--h6, .oxd-topbar-header-breadcrumb h6');
    await title.first().waitFor({ state: 'visible', timeout: 8000 });
    const titleText = (await title.first().textContent()) ?? '';
    expect(titleText.trim().length).toBeGreaterThan(0);
  });

  test('TC706 - should display the Leave Entitlement page when navigated directly', async ({ leavePage, page }) => {
    await leavePage.goto('web/index.php/leave/viewLeaveEntitlements');
    await leavePage.waitForSpinner();
    await expect(page).toHaveURL(/leaveEntitlements|viewLeaveEntitlement/);

    // Page should load without error
    const heading = page.locator('h6.oxd-text--h6, .oxd-topbar-header-breadcrumb h6');
    await heading.first().waitFor({ state: 'visible', timeout: 8000 });
    expect((await heading.first().textContent())?.trim().length).toBeGreaterThan(0);
  });

  test('TC707 - should display Leave Reports menu item in Leave module', async ({ orangeNav, page }) => {
    await orangeNav.navigateTo('Leave');
    await page.waitForURL(/leave/, { timeout: 15000 });

    // Reports sub-menu item should be accessible from the Leave top nav
    const reportsLink = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Reports' });
    await reportsLink.waitFor({ state: 'visible', timeout: 8000 });
    await expect(reportsLink).toBeVisible();
  });
});
