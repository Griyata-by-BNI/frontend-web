// tests/register.spec.ts
import { test, expect } from "@playwright/test";

const BASE_URL = 'https://08e836f05006.ngrok-free.app/api/v1';

test.describe("Register Page Flow", () => {
  test("should register successfully and redirect to verify email", async ({ page }) => {
    // Mock API response untuk registrasi sukses
    await page.route(`${BASE_URL}/auth/sign-up`, (route) => {
      const mockResponse = {
        success: true,
        message: 'Registration successful. OTP sent to your email.',
        data: { email: 'admin.faza@mail.com', otp: '1234' },
      };
      route.fulfill({ 
        status: 200, 
        contentType: 'application/json', 
        body: JSON.stringify(mockResponse) 
      });
    });

    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi nama lengkap
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");

    // 3. Isi nomor telepon
    await page.getByLabel("Nama Handphone").fill("081234567890");

    // 4. Isi email
    await page.getByLabel("Email").fill("admin.faza@mail.com");

    // 5. Isi password
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");

    // 6. Konfirmasi password
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("123Admin!");

    // 7. Centang syarat dan ketentuan
    await page.getByRole("checkbox", { name: "Saya setuju dengan syarat dan ketentuan yang berlaku" }).check();

    // 8. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    // 9. Tunggu redirect ke halaman verify email
    await page.waitForURL("/(auth)/register/verify-email");

    // 10. Verifikasi URL sudah benar
    expect(page.url()).toContain("/(auth)/register/verify-email");

    // 11. Verifikasi notifikasi sukses
    // const successMessage = page.getByText("Verification email sent");
    // await expect(successMessage).toBeVisible();
  });

  test("should show error message for invalid phone number", async ({ page }) => {
    // Mock API response untuk nomor telepon tidak valid
    await page.route(`${BASE_URL}/auth/sign-up`, (route) => {
      route.fulfill({ 
        status: 400, 
        contentType: 'application/json', 
        body: JSON.stringify({ message: 'Invalid phone number' }) 
      });
    });

    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form dengan nomor telepon tidak valid
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("123"); // Nomor tidak valid
    await page.getByLabel("Email").fill("admin.faza@mail.com");
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByRole("checkbox", { name: "Saya setuju dengan syarat dan ketentuan yang berlaku" }).check();

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    // 4. Tunggu dan verifikasi pesan error
    const errorMessage1 = page.getByText("Nomor handphone harus 10-13 digit angka");
    const errorMessage2 = page.getByText("Nomor handphone harus dimulai dengan 08 atau 62");
    await expect(errorMessage1).toBeVisible();
    await expect(errorMessage2).toBeVisible();
  });

  test("should show error message for invalid email format", async ({ page }) => {
    // Mock API response untuk email tidak valid
    await page.route(`${BASE_URL}/auth/sign-up`, (route) => {
      route.fulfill({ 
        status: 400, 
        contentType: 'application/json', 
        body: JSON.stringify({ message: 'Invalid email format' }) 
      });
    });

    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form dengan email tidak valid
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("invalid-email"); // Email tidak valid
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByRole("checkbox", { name: "Saya setuju dengan syarat dan ketentuan yang berlaku" }).check();

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar Sekarang" }).click();

    // 4. Tunggu dan verifikasi pesan error
    const errorMessage = page.getByText("Format email tidak valid");
    await expect(errorMessage).toBeVisible();
  });

  test("should show validation error for unchecked terms", async ({ page }) => {
    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form tanpa centang syarat dan ketentuan
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("admin.faza@mail.com");
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("123Admin!");
    // Tidak centang checkbox syarat dan ketentuan

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar" }).click();

    // 4. Verifikasi pesan validasi error
    const validationError = page.getByText("Anda harus menyetujui syarat dan ketentuan");
    await expect(validationError).toBeVisible();
  });

  test("should show error when email already exists", async ({ page }) => {
    // Mock API response untuk email sudah terdaftar
    await page.route(`${BASE_URL}/auth/sign-up`, (route) => {
      route.fulfill({ 
        status: 409, 
        contentType: 'application/json', 
        body: JSON.stringify({ message: 'Email already registered' }) 
      });
    });

    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form dengan email yang sudah terdaftar
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("admin.faza@mail.com");
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByRole("checkbox", { name: "Saya menyetujui syarat dan ketentuan" }).check();

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar" }).click();

    // 4. Tunggu dan verifikasi pesan error
    const errorMessage = page.getByText("Email already registered");
    await expect(errorMessage).toBeVisible();
  });

  test("should show error when passwords don't match", async ({ page }) => {
    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form dengan password yang tidak cocok
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("admin.faza@mail.com");
    await page.getByLabel("Kata Sandi", { exact: true }).fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi", { exact: true }).fill("DifferentPassword");
    await page.getByRole("checkbox", { name: "Saya menyetujui syarat dan ketentuan" }).check();

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar" }).click();

    // 4. Verifikasi pesan validasi error
    const validationError = page.getByText("Password tidak cocok");
    await expect(validationError).toBeVisible();
  });

  test("should handle network error gracefully", async ({ page }) => {
    // Mock network error
    await page.route(`${BASE_URL}/auth/sign-up`, (route) => {
      route.abort('failed');
    });

    // 1. Buka halaman register
    await page.goto("http://localhost:3000/register");

    // 2. Isi form dengan data valid
    await page.getByLabel("Nama Lengkap").fill("Japra Faza");
    await page.getByLabel("Nama Handphone").fill("081234567890");
    await page.getByLabel("Email").fill("admin.faza@mail.com");
    await page.getByLabel("Kata Sandi").fill("123Admin!");
    await page.getByLabel("Konfirmasi Kata Sandi").fill("123Admin!");
    await page.getByRole("checkbox", { name: "Saya menyetujui syarat dan ketentuan" }).check();

    // 3. Klik tombol "Daftar"
    await page.getByRole("button", { name: "Daftar" }).click();

    // 4. Verifikasi pesan error jaringan
    const networkError = page.getByText("Terjadi kesalahan jaringan. Silakan coba lagi.");
    await expect(networkError).toBeVisible({ timeout: 10000 });
  });
});