import { test, expect } from './fixtures/fixtures.ts';

test("User login", { tag: '@login' }, async ({ loginPage, page }) => {
    await loginPage.loginAsUser('test@test.com', '1234567890');
    await expect(page.locator('div.notice.success')).toContainText(/logged in as test test/i);
    await page.context().storageState({ path: './data/UserAuth.json' });
});