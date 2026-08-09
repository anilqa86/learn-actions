import { test, expect } from '../fixtures/test-fixtures';

/**
 * PIM (People Information Management) Tests — OrangeHRM Open Source Demo
 * Covers: employee list, search by name, search by ID, reset search, add employee.
 *
 * All tests start from a logged-in state. The add-employee test uses a
 * timestamp-based name to avoid duplicate conflicts on the shared demo server.
 */
test.describe('OrangeHRM - PIM Module Tests', () => {
  const VALID_USER = 'Admin';
  const VALID_PASS = 'admin123';

  test.beforeEach(async ({ loginPage, dashboardPage, pimPage }) => {
    await loginPage.open();
    await loginPage.login(VALID_USER, VALID_PASS);
    await dashboardPage.waitForDashboard();
    await pimPage.open();
  });

  test('TC601 - should display the Employee List page with search form', async ({ pimPage }) => {
    await expect(pimPage.searchButton).toBeVisible();
    await expect(pimPage.resetButton).toBeVisible();
    await expect(pimPage.addEmployeeButton).toBeVisible();
  });

  test('TC602 - should load employees in the table on default view', async ({ pimPage }) => {
    const rowCount = await pimPage.getTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('TC603 - should search for an employee by name and return results', async ({ pimPage }) => {
    // "Admin" is always present in the demo instance
    await pimPage.searchEmployee('Admin');
    const rowCount = await pimPage.getTableRowCount();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test('TC604 - should show no records for a non-existent employee name', async ({ pimPage }) => {
    await pimPage.searchEmployee('zzznobodyxyz99');
    // Wait a moment for results to update
    await pimPage.page.waitForTimeout(500);
    const rowCount = await pimPage.getTableRowCount();
    // Either 0 rows or the "No Records Found" card is shown
    const noRecords = pimPage.noRecordsText;
    const noRecordsVisible = await noRecords.isVisible().catch(() => false);
    expect(rowCount === 0 || noRecordsVisible).toBe(true);
  });

  test('TC605 - should reset search and restore the full employee list', async ({ pimPage }) => {
    // Narrow the list first
    await pimPage.searchEmployee('Admin');
    const narrowed = await pimPage.getTableRowCount();

    // Reset and verify the list is at least as large
    await pimPage.resetSearch();
    const full = await pimPage.getTableRowCount();
    expect(full).toBeGreaterThanOrEqual(narrowed);
  });

  test('TC606 - should open Add Employee form when Add Employee is clicked', async ({ pimPage }) => {
    await pimPage.clickAddEmployee();
    await expect(pimPage.firstNameInput).toBeVisible();
    await expect(pimPage.lastNameInput).toBeVisible();
    await expect(pimPage.saveButton).toBeVisible();
  });

  test('TC607 - should add a new employee and land on their Personal Details page', async ({ pimPage }) => {
    const timestamp = Date.now();
    const firstName = `Auto${timestamp}`;
    const lastName  = `Tester`;

    await pimPage.clickAddEmployee();
    await pimPage.fillAddEmployeeForm(firstName, lastName);
    await pimPage.submitAddEmployee();

    // After save the URL moves to the edit page for the new employee
    await expect(pimPage.page).toHaveURL(/pim\/editEmployee/);
    // The first-name input on the Personal Details page should show the saved value
    await expect(pimPage.firstNameInput).toHaveValue(firstName);
  });
});
