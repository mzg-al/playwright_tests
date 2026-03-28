import { test, expect } from './fixtures/fixtures.ts';

test("User login", { tag: '@login' }, async ({ loginPage, page }) => {
    const username = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;
    if (!username || !password) {
        throw new Error('USER_EMAIL and USER_PASSWORD must be set in environment variables');
    }
    await loginPage.loginAsUser(username, password);
    await expect(page.locator('div.notice.success')).toContainText(/logged in as test test/i);
    await page.context().storageState({ path: './data/UserAuth.json' });
});