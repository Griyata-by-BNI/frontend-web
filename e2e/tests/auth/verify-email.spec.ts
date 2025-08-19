import { test, expect } from '@playwright/test';

const BASE_URL = 'https://0e3cda3c5cc3.ngrok-free.app';

test.describe('Authentication - Verify Email Flow with OTP from API', () => {
  test('should verify email with OTP from registration response and redirect to login', async ({ page, request }) => {
    // Mock endpoint registrasi untuk mendapatkan OTP
    let capturedOtp = '';
    await page.route(`${BASE_URL}/api/v1/auth/sign-up`, (route) => {
      const mockResponse = {
        success: true,
        message: 'Registration successful. OTP sent to your email.',
        data: { email: 'john.doe@example.com', otp: '1234' }, // Asumsi OTP dikembalikan
      };
      capturedOtp = mockResponse.data.otp; // Simpan OTP untuk digunakan
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
    });

    // Lakukan registrasi untuk memicu pengiriman OTP
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '081234567890');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.check('input[name="agreeToTerms"]');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/(auth)/register/verify-email?email=john.doe@example.com');

    // Mock endpoint verifikasi untuk memverifikasi OTP
    await page.route(`${BASE_URL}/api/v1/auth/sign-up-verify-resend-otp`, (route) => {
      const mockResponse = {
        success: true,
        message: 'Email berhasil diverifikasi!',
      };
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse) });
    });

    // Beralih ke halaman verify-email
    await page.goto('/(auth)/register/verify-email?email=john.doe@example.com');
    await page.waitForSelector('input[type="text"]');
    await page.fill('input[type="text"]', capturedOtp); // Gunakan OTP dari registrasi

    // Klik tombol verifikasi
    await page.click('button[type="button"][type="primary"]');
    await page.waitForTimeout(2000); // Tunggu redirect (sesuai setTimeout 1500ms + buffer)
    await expect(page).toHaveURL('/login');
    await expect(page.locator('.ant-alert-success')).toContainText('Email berhasil diverifikasi!');
  });

  test('should show error for invalid OTP', async ({ page }) => {
    await page.route(`${BASE_URL}/api/v1/auth/sign-up-verify-resend-otp`, (route) => {
      const mockResponse = {
        success: false,
        message: 'Kode verifikasi salah.',
      };
      route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify(mockResponse) });
    });

    await page.goto('/(auth)/register/verify-email?email=john.doe@example.com');
    await page.waitForSelector('input[type="text"]');
    await page.fill('input[type="text"]', '5678'); // OTP salah
    await page.click('button[type="button"][type="primary"]');
    await expect(page.locator('.ant-message')).toContainText('Kode verifikasi salah.');
  });
});