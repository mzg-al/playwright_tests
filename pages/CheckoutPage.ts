import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly checkoutSummary: Locator;
    readonly confirmButton: Locator;
    readonly orderConfirmationSuccess: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutSummary = page.locator('#box-checkout-summary td:has-text("Payment Due:") + td');
        this.confirmButton = page.getByRole('button', { name: 'Confirm Order' });
        this.orderConfirmationSuccess = page.getByText('Your order is successfully completed!');

    }

    async getCheckoutSummary() {
        await this.checkoutSummary.waitFor({ state: 'visible' });
        const priceText = await this.checkoutSummary.innerText();
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }

    async orderConfirmation() {
        await this.confirmButton.click();
        await expect(this.orderConfirmationSuccess).toBeVisible();
    }

    async checkUserFields() {
        const fieldNames = [
            'tax_id', 'company', 'firstname', 'lastname',
            'address1', 'address2', 'postcode', 'city', 'phone',
            'email', 'country_code', 'zone_code'
        ];

        for (const name of fieldNames) {
            const field = this.page.locator(`[name="${name}"]`);
            await expect(field).toBeEmpty();
        }
    }
}