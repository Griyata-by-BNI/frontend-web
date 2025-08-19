import { test, expect } from '@playwright/test';

test.describe('Authentication - Login on Edge', () => {
  test('should login successfully on Edge', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid credentials on Edge', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });
});