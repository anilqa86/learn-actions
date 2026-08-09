import { test, expect } from '../fixtures/test-fixtures';

/**
 * Smoke Tests — DemoBlaze Product Store
 * Validates core page structure, navigation bar, carousel, and product grid load.
 */
test.describe('DemoBlaze - Smoke Tests', { 'tag': ['@p1', '@regression'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TC001 - should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('STORE');
  });

  test('TC002 - should display "PRODUCT STORE" brand in navbar', async ({ page }) => {
    const brand = page.locator('.navbar-brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('PRODUCT STORE');
  });

  test('TC003 - should display navbar links: Home, Cart, Log in, Sign up', async ({ nav }) => {
    await expect(nav.homeLink).toBeVisible();
    await expect(nav.cartLink).toBeVisible();
    await expect(nav.loginLink).toBeVisible();
    await expect(nav.signupLink).toBeVisible();
  });

  test('TC004 - should show Contact and About Us links', async ({ nav }) => {
    await expect(nav.contactLink).toBeVisible();
    await expect(nav.aboutUsLink).toBeVisible();
  });

  test('TC005 - should display at least one product card on initial load', async ({ homePage }) => {
    const count = await homePage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC006 - should display CATEGORIES sidebar with Phones, Laptops, Monitors', async ({ page }) => {
    await expect(page.locator('#cat')).toContainText('CATEGORIES');
    await expect(page.locator('#itemc', { hasText: 'Phones' })).toBeVisible();
    await expect(page.locator('#itemc', { hasText: 'Laptops' })).toBeVisible();
    await expect(page.locator('#itemc', { hasText: 'Monitors' })).toBeVisible();
  });

  test('TC007 - should display Next and Previous pagination buttons', async ({ homePage }) => {
    await expect(homePage.nextButton).toBeVisible();
    await expect(homePage.prevButton).toBeVisible();
  });
});
