import { Page, Locator, expect } from '@playwright/test';

export class ShopPage {
    readonly page: Page;
    readonly duckLocatorShop: (color: string) => Locator;
    readonly duckPrice: Locator;
    readonly duckSalePrice: Locator;
    readonly duckQuantity: Locator;
    readonly addToCartButton: Locator;
    readonly initialCartCount: Locator;
    readonly duckOnSaleLocatorShop: (color: string) => Locator;
    readonly selectDuckSizeLocator: Locator;
    readonly duckLocatorRecentlyViewed: (color: string) => Locator;
    readonly cartSumText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.duckLocatorShop = (color: string) => page.locator(`#box-most-popular a[title='${color} Duck' i] .name`);
        this.duckPrice = page.locator("#box-product .price");
        this.duckSalePrice = page.locator("#box-product .campaign-price");
        this.duckQuantity = page.locator('input[name="quantity"]');
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
        this.initialCartCount = page.getByRole('link', { name: /Cart: 0 item/ });
        this.duckOnSaleLocatorShop = (color: string) => page.locator(`//div[@id='box-campaigns']//div[@class='name'][normalize-space()='${color} Duck']`);
        this.selectDuckSizeLocator = page.locator('select[name="options[Size]"]');
        this.duckLocatorRecentlyViewed = (color: string) => page.locator(`#box-recently-viewed-products a[href*='${color}-duck']`);
        this.cartSumText = page.locator('#cart .formatted_value');
    }

    async getCartSum() {
        const cartText = await this.cartSumText.innerText();
        return parseFloat(cartText.replace(/[^0-9.]/g, ''));
    }

    async pickDuck(color: string) {
        await this.duckLocatorShop(color).click();
    }

    async getDuckPrice() {
        const priceText = await this.duckPrice.innerText();
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }

    async getDuckSalePrice() {
        const salePriceText = await this.duckSalePrice.innerText();
        return parseFloat(salePriceText.replace(/[^0-9.]/g, ''));
    }

    async selectSize(size: string) {
        await this.selectDuckSizeLocator.selectOption({ label: size });
    }

    async pickDuckOnSale(color: string, size: string) {
        await this.duckOnSaleLocatorShop(color).click();
        await this.selectSize(size);
    }

    async addToCart() {
        const cartSumBefore = await this.getCartSum();
        await this.addToCartButton.click();
        await expect.poll(async () => {
            return await this.getCartSum();
        }).toBeGreaterThan(cartSumBefore);
    }

    async addMoreDucks(qty: string) {
        await (this.duckQuantity.fill(qty));
        await this.addToCart();
        await expect(this.initialCartCount).not.toBeVisible();
    }

    async expectDucksRecentlyViewedVisible(colors: string[]) {
        for (const color of colors) {
            await expect(this.duckLocatorRecentlyViewed(color)).toBeVisible();
        }
    }

}