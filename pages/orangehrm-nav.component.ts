import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class OrangeHRMNavComponent extends BasePage {
  readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebarMenu = page.locator('.oxd-nav-item');
  }

  /** Click a top-level sidebar navigation item by name */
  async navigateTo(moduleName: string) {
    const menuItem = this.page
      .locator('.oxd-main-menu-item', { hasText: moduleName })
      .first();
    await menuItem.waitFor({ state: 'visible' });
    await menuItem.click();
    await this.waitForSpinner();
  }

  /** Get all visible sidebar menu item names */
  async getMenuItemNames(): Promise<string[]> {
    const items = this.page.locator('.oxd-main-menu-item span');
    await items.first().waitFor({ state: 'visible' });
    return items.allTextContents();
  }

  /** Check if a specific module is visible in the sidebar */
  async isModuleVisible(moduleName: string): Promise<boolean> {
    return this.page
      .locator('.oxd-main-menu-item', { hasText: moduleName })
      .isVisible();
  }

  /** Get the current page breadcrumb/header title */
  async getPageTitle(): Promise<string> {
    const title = this.page.locator('h6.oxd-text--h6, .oxd-topbar-header-breadcrumb h6');
    await title.first().waitFor({ state: 'visible', timeout: 8000 });
    return (await title.first().textContent()) ?? '';
  }
}
