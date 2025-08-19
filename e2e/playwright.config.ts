import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
projects: [
    {
      name: 'edge',
      use: {
        browserName: 'chromium', // Edge menggunakan driver Chromium
        channel: 'msedge', // Spesifikasi untuk membuka Edge
      },
    },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev', // Jalankan server Next.js
    port: 3001,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: true, // Jalankan tanpa GUI (ubah ke false untuk debug)
  },
});