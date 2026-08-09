import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly header: Locator;
  readonly dashboardWidgets: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly profileName: Locator;

  constructor(page: Page) {
    super(page);
    this.header           = page.locator('.oxd-topbar-header-title span, h6.oxd-text');
    this.dashboardWidgets = page.locator('.orangehrm-dashboard-widget-header');
    this.userDropdown     = page.locator('.oxd-userdropdown-tab');
    this.logoutOption     = page.getByRole('menuitem', { name: 'Logout' });
    this.profileName      = page.locator('.oxd-userdropdown-name');
  }

  async waitForDashboard() {
    await this.page.waitForURL(/.*dashboard/, { timeout: 15000 });
    await this.waitForSpinner();
    await this.waitForVisible(this.userDropdown);
  }

  async getUserProfileName(): Promise<string> {
    return (await this.profileName.textContent()) ?? '';
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutOption.waitFor({ state: 'visible' });
    await this.logoutOption.click();
    await this.page.waitForURL(/.*login/, { timeout: 10000 });
  }

  async getDashboardWidgetCount(): Promise<number> {
    await this.waitForSpinner();
    return this.dashboardWidgets.count();
  }
}
