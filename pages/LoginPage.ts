import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[name="email"]');
        this.passwordInput = page.locator('[name="password"]');
        this.loginButton = page.getByRole('button', { name: /Login/i });
        this.loginErrorMessage = page.locator('div.notice.errors');
    }

    async loginAsUser(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

}     