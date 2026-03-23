import { test as baseTest, Page, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';
import { ShopPage } from '../pages/ShopPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type TestFixtures = {
    loginPage: LoginPage;
    page: Page;
    cartCleaned: void;
    navigationPage: NavigationPage;
    shopPage: ShopPage;
    checkoutPage: CheckoutPage;
};

export const test = baseTest.extend<TestFixtures>({

    loginPage: async ({ page }, use) => {
        await page.goto('/');
        await use(new LoginPage(page));
    },

    cartCleaned: async ({ page }, use) => {

        await page.goto('/checkout');

        // const requestContext = await request.newContext();
        // await requestContext.post('https://litecart.stqa.ru/checkout_cart.html', {
        //     form: { 'token': '123', 'remove_cart_item': 'Remove' }
        // });

        const deleteButton = page.getByRole('button', { name: 'Remove' })

        const count = await deleteButton.count();

        for (let i = 0; i < count; i++) {

            await deleteButton.first().click();

            await expect(page.getByText('There are no items in your cart.')).toBeVisible();
        }

        await use();

    },

    navigationPage: async ({ page }, use) => {
        await use(new NavigationPage(page));
    },

    shopPage: async ({ page }, use) => {
        await use(new ShopPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

});

export { expect } from '@playwright/test';