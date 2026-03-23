import { test, expect } from '../fixtures/fixtures.ts';

test.describe('Logged in tests', () => {

  test.use({

    storageState: './data/UserAuth.json',

  });

  test('1. Order items without discount', { tag: '@logged_in' }, async ({ cartCleaned, navigationPage, shopPage, checkoutPage }) => {

    await navigationPage.gotoHomePage();
    await shopPage.pickDuck('Red');
    await shopPage.addMoreDucks('3');
    const price = await shopPage.getDuckPrice();
    await navigationPage.gotoCheckout();
    const expectedTotalPrice = price * 3;
    const actualTotal = await checkoutPage.getCheckoutSummary();
    expect(actualTotal).toBe(expectedTotalPrice);
    await checkoutPage.orderConfirmation();

  });

  test('2. Order items with discount', { tag: '@logged_in' }, async ({ cartCleaned, navigationPage, shopPage, checkoutPage }) => {

    await navigationPage.gotoHomePage();
    await shopPage.pickDuckOnSale('Yellow', 'Small');
    await shopPage.addMoreDucks('2');
    const price = await shopPage.getDuckSalePrice();
    await navigationPage.gotoCheckout();
    const expectedTotalPrice = price * 2;
    const actualTotal = await checkoutPage.getCheckoutSummary();
    expect(actualTotal).toBe(expectedTotalPrice);
    await checkoutPage.orderConfirmation();

  });

});

test.describe('Logged out tests', () => {

  test('3. Order without login', { tag: '@logged_out' }, async ({ cartCleaned, navigationPage, shopPage, checkoutPage }) => {

    await navigationPage.gotoHomePage();
    await shopPage.pickDuck('red');
    const price1 = await shopPage.getDuckPrice();
    await shopPage.addToCart();
    await navigationPage.gotoHomePage();
    await shopPage.pickDuck('green');
    const price2 = await shopPage.getDuckPrice();
    await shopPage.addToCart();
    const expectedTotalPrice = price1 + price2;
    const actualTotal = await shopPage.getCartSum();
    expect(actualTotal).toBe(expectedTotalPrice);
    await navigationPage.gotoCheckout();
    await checkoutPage.checkUserFields();
    await navigationPage.gotoHomePage();
    await shopPage.expectDucksRecentlyViewedVisible(['red', 'green']);

  })

})

test.describe('Negative tests', () => {

  test('4. Login with invalid credentials', { tag: '@negative' }, async ({ loginPage }) => {

    await loginPage.loginAsUser('wrong', 'creds');
    await expect(loginPage.loginErrorMessage).toContainText(/Wrong password or the account is disabled, or does not exist/i);
  })

})