import { test, expect } from '../fixtures/test-fixtures';

/**
 * Cart & Order Tests — DemoBlaze Product Store
 * Covers: product detail view, add to cart, cart verification, delete item,
 * place order form, and purchase confirmation.
 */
test.describe('DemoBlaze - Cart & Order Tests', () => {
  test('TC301 - should display product details (name, price, description) on product page', async ({
    homePage,
    productDetailPage,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Phones');
    await homePage.clickFirstProduct();

    const name = await productDetailPage.getName();
    const price = await productDetailPage.getPrice();

    expect(name.trim().length).toBeGreaterThan(0);
    expect(price).toContain('$');
  });

  test('TC302 - should add a product to cart and show confirmation alert', async ({
    homePage,
    productDetailPage,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Phones');
    await homePage.clickFirstProduct();

    const alertMsg = await productDetailPage.addToCart();
    expect(alertMsg).toMatch(/added|cart/i);
  });

  test('TC303 - should navigate to Cart and show added product', async ({
    homePage,
    productDetailPage,
    cartPage,
    nav,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Phones');
    await homePage.clickFirstProduct();

    // Remember which product was added
    const productName = await productDetailPage.getName();
    await productDetailPage.addToCart();

    // Go to cart
    await nav.clickCart();
    await cartPage.page.waitForTimeout(2000);

    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems.length).toBeGreaterThan(0);
    const found = cartItems.some(item =>
      item.toLowerCase().includes(productName.trim().toLowerCase().split(' ')[0])
    );
    expect(found).toBe(true);
  });

  test('TC304 - should display total price in the cart', { 'tag': ['@p1', '@regression'] }, async ({
    homePage,
    productDetailPage,
    cartPage,
    nav,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Laptops');
    await homePage.clickFirstProduct();
    await productDetailPage.addToCart();

    await nav.clickCart();
    await cartPage.page.waitForTimeout(2000);

    const total = await cartPage.getTotal();
    // Total should be a number > 0
    expect(parseInt(total, 10)).toBeGreaterThan(0);
  });

  test('TC305 - should delete a product from the cart', async ({
    homePage,
    productDetailPage,
    cartPage,
    nav,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Monitors');
    await homePage.clickFirstProduct();

    const productName = (await productDetailPage.getName()).trim();
    await productDetailPage.addToCart();

    await nav.clickCart();
    await cartPage.page.waitForTimeout(2000);

    const beforeCount = (await cartPage.getCartItemNames()).length;
    expect(beforeCount).toBeGreaterThan(0);

    await cartPage.deleteItem(productName.split(' ')[0]);
    await cartPage.page.waitForTimeout(1500);

    const afterCount = (await cartPage.getCartItemNames()).length;
    expect(afterCount).toBeLessThan(beforeCount);
  });

  test('TC306 - should open Place Order modal from cart', async ({
    homePage,
    productDetailPage,
    cartPage,
    nav,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Phones');
    await homePage.clickFirstProduct();
    await productDetailPage.addToCart();

    await nav.clickCart();
    await cartPage.page.waitForTimeout(2000);

    await cartPage.openPlaceOrder();
    await expect(cartPage.orderModal).toBeVisible();
    await expect(cartPage.orderModal.locator('.modal-title')).toContainText('Place order');
  });

  test('TC307 - should complete full purchase flow from cart to confirmation', async ({
    homePage,
    productDetailPage,
    cartPage,
    nav,
  }) => {
    await homePage.open();
    await homePage.selectCategory('Phones');
    await homePage.clickFirstProduct();
    await productDetailPage.addToCart();

    await nav.clickCart();
    await cartPage.page.waitForTimeout(2000);

    await cartPage.openPlaceOrder();
    await cartPage.fillOrderForm({
      name: 'John Doe',
      country: 'United States',
      city: 'New York',
      card: '1234567890123456',
      month: '12',
      year: '2026',
    });

    await cartPage.submitOrder();

    // Verify success confirmation modal
    await expect(cartPage.confirmationModal).toBeVisible();
    const confirmText = await cartPage.getConfirmationMessage();
    expect(confirmText).toContain('Amount');

    await cartPage.confirmPurchase();
  });
});
