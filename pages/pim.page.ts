import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PimPage extends BasePage {
  // Search form
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Results table
  readonly tableRows: Locator;
  readonly noRecordsText: Locator;

  // Add employee
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInputField: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    // Search
    this.employeeNameInput = page.locator(
      '.oxd-autocomplete-text-input input'
    ).first();
    this.employeeIdInput   = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.searchButton      = page.getByRole('button', { name: 'Search' });
    this.resetButton       = page.getByRole('button', { name: 'Reset' });

    // Table
    this.tableRows     = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsText = page.locator('.oxd-table-card', { hasText: 'No Records Found' });

    // Add Employee form
    this.addEmployeeButton  = page.getByRole('button', { name: 'Add Employee' });
    this.firstNameInput     = page.locator('input[name="firstName"]');
    this.middleNameInput    = page.locator('input[name="middleName"]');
    this.lastNameInput      = page.locator('input[name="lastName"]');
    this.employeeIdInputField = page.locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.saveButton         = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.goto('web/index.php/pim/viewEmployeeList');
    await this.waitForSpinner();
    await this.waitForVisible(this.searchButton);
  }

  async searchEmployee(name: string) {
    await this.employeeNameInput.fill(name);
    await this.page.waitForTimeout(800); // Allow autocomplete
    await this.searchButton.click();
    await this.waitForSpinner();
  }

  async resetSearch() {
    await this.resetButton.click();
    await this.waitForSpinner();
  }

  async getTableRowCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return this.tableRows.count();
  }

  async getFirstRowName(): Promise<string> {
    const cell = this.tableRows.first().locator('.oxd-table-cell').nth(1);
    return (await cell.textContent()) ?? '';
  }

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
    await this.waitForVisible(this.firstNameInput);
  }

  async fillAddEmployeeForm(firstName: string, lastName: string, middleName = '') {
    await this.firstNameInput.fill(firstName);
    if (middleName) await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
  }

  async submitAddEmployee() {
    await this.saveButton.click();
    await this.waitForSpinner();
    // After save, lands on Personal Details page for the new employee
    await this.page.waitForURL(/.*pim\/editEmployee/, { timeout: 15000 });
  }
}
