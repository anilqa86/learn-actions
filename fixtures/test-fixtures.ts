import { test as baseTest, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';

// ── DemoBlaze pages ────────────────────────────────────────────────────────────
import { NavComponent } from '../pages/nav.component';
import { AuthModal } from '../pages/auth.modal';
import { HomePage } from '../pages/home.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';

// ── OrangeHRM pages ────────────────────────────────────────────────────────────
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { PimPage } from '../pages/pim.page';
import { LeavePage } from '../pages/leave.page';
import { OrangeHRMNavComponent } from '../pages/orangehrm-nav.component';

// ── Fixture types ──────────────────────────────────────────────────────────────

type DemoBlazeFixtures = {
  basePage: BasePage;
  nav: NavComponent;
  authModal: AuthModal;
  homePage: HomePage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
};

type OrangeHRMFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  leavePage: LeavePage;
  orangeNav: OrangeHRMNavComponent;
};

// ── Combined test fixture ──────────────────────────────────────────────────────

export const test = baseTest.extend<DemoBlazeFixtures & OrangeHRMFixtures>({
  // DemoBlaze
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  nav: async ({ page }, use) => {
    await use(new NavComponent(page));
  },
  authModal: async ({ page }, use) => {
    await use(new AuthModal(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // OrangeHRM
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },
  orangeNav: async ({ page }, use) => {
    await use(new OrangeHRMNavComponent(page));
  },
});

export { expect };
