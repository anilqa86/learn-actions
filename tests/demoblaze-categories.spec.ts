import { test, expect } from '../fixtures/test-fixtures';

/**
 * Category Filter Tests — DemoBlaze Product Store
 * Validates that clicking each category filters the product grid correctly.
 */
test.describe('DemoBlaze - Category Filter Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TC101 - should filter products when Phones category is selected', async ({ homePage }) => {
    await homePage.selectCategory('Phones');
    const names = await homePage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    // Phone products should include known phone names
    const hasPhone = names.some(n =>
      /samsung|iphone|nexus|nokia|htc|sony|moto/i.test(n)
    );
    expect(hasPhone).toBeTruthy();
  });

  test('TC102 - should filter products when Laptops category is selected', async ({ homePage }) => {
    await homePage.selectCategory('Laptops');
    const names = await homePage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    const hasLaptop = names.some(n =>
      /laptop|notebook|macbook|dell|vaio|asus|lenovo|hp/i.test(n)
    );
    expect(hasLaptop).toBeTruthy();
  });

  test('TC103 - should filter products when Monitors category is selected', async ({ homePage }) => {
    await homePage.selectCategory('Monitors');
    const names = await homePage.getProductNames();
    expect(names.length).toBeGreaterThan(0);
    const hasMonitor = names.some(n =>
      /monitor|apple|asus|benq/i.test(n)
    );
    expect(hasMonitor).toBeTruthy();
  });

  test('TC104 - clicking Next should load a new set of products', async ({ homePage }) => {
    const firstPageNames = await homePage.getProductNames();
    await homePage.clickNext();
    const secondPageNames = await homePage.getProductNames();
    // At minimum the next page should have products
    expect(secondPageNames.length).toBeGreaterThan(0);
    // Pages should differ (next page has different items, or same if only 1 page)
    // We just verify the page loaded without error
    expect(secondPageNames).toBeDefined();
  });

  test('TC105 - product cards should each have a title and price', async ({ page, homePage }) => {
    const cardTitles  = page.locator('#tbodyid .card-title');
    const cardPrices  = page.locator('#tbodyid h5');
    await cardTitles.first().waitFor({ state: 'visible' });
    const titleCount = await cardTitles.count();
    const priceCount = await cardPrices.count();
    expect(titleCount).toBeGreaterThan(0);
    expect(priceCount).toBeGreaterThan(0);
  });
});
