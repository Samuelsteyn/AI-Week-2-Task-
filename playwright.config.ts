import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html']
  ],
  use: {
    headless: false,
    trace: 'on',
    video: 'on',
    screenshot: 'on',
    launchOptions: {
      slowMo: 500
    }
  },
  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
  ],
}); 