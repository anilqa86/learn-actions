import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LeavePage extends BasePage {
  readonly applyLeaveButton: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly commentInput: Locator;
  readonly applyButton: Locator;
  readonly myLeaveListRows: Locator;

  constructor(page: Page) {
    super(page);
    this.applyLeaveButton   = page.getByRole('link', { name: 'Apply' });
    this.leaveTypeDropdown  = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Leave Type' })
      .locator('.oxd-select-text');
    this.fromDateInput      = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'From Date' })
      .locator('input');
    this.toDateInput        = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'To Date' })
      .locator('input');
    this.commentInput       = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Comments' })
      .locator('textarea');
    this.applyButton        = page.getByRole('button', { name: 'Apply' });
    this.myLeaveListRows    = page.locator('.oxd-table-body .oxd-table-row');
  }

  async openLeaveModule() {
    await this.goto('web/index.php/leave/viewLeaveModule');
    await this.waitForSpinner();
  }

  async openMyLeaveList() {
    await this.goto('web/index.php/leave/viewMyLeaveList');
    await this.waitForSpinner();
  }

  async getMyLeaveRowCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return this.myLeaveListRows.count();
  }
}
