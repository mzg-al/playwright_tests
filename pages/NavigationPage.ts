import { Page, Locator } from '@playwright/test';

export class NavigationPage {
    readonly page: Page;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole('link', { name: /Checkout/i });

    }

    async gotoHomePage() {
        await this.page.goto('/');
    }

    async gotoCheckout() {
        await this.checkoutButton.click();
    }

}