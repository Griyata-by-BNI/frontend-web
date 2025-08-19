import { test, expect } from '@playwright/test';

const BASE_URL = 'https://0e3cda3c5cc3.ngrok-free.app';

test.describe('Authentication - Register Flow', () => {
  test('should register successfully and redirect to verify email', async ({ page }) => {
    // Mock endpoint registrasi untuk mensimulasikan pengiriman OTP
    await page.route(`${BASE_URL}/api/v1/auth/sign-up`, (route) => {
      const mockResponse = {
        success: true,
        message: 'Registration successful. OTP sent to your email.',
        data: { email: 'john.doe@example.com' }, // Simulasi email yang digunakan
      };
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
    });

    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '081234567890');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/(auth)/register/verify-email?email=john.doe@example.com');
    await expect(page.locator('.ant-alert-success')).toContainText('Verification email sent');
  });

  test('should show error for invalid phone number', async ({ page }) => {
    await page.route(`${BASE_URL}/api/v1/auth/sign-up`, (route) => {
      route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid phone number' }) });
    });

    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '123');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-alert-error')).toContainText('Invalid phone number');
  });
});

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '081234567890');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPass!');
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-alert-error')).toContainText('Konfirmasi password tidak sama dengan password');
  });

  test('should show error for unchecked terms', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '081234567890');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page.locator('.ant-form-item-explain')).toContainText('Anda harus menyetujui syarat dan ketentuan');
  });