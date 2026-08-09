import { defineConfig, devices } from '@playwright/test';
// import {ENV} from './config/env'

/**
 * Playwright configuration for OrangeHRM Open Source Demo automation.
 * Target: https://opensource-demo.orangehrmlive.com/
 * Credentials: Admin / admin123
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: BASE_URL!,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
