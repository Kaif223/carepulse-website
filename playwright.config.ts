import { defineConfig, devices } from '@playwright/test';

const PORT = 3200;

/**
 * Runs against a production build (`next build && next start`), since that is
 * what visitors get. Set PLAYWRIGHT_CHANNEL=chrome to use an installed Chrome
 * instead of Playwright's bundled Chromium.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    // The production build refuses a local origin and a missing call to action
    // (src/lib/site-env.ts); these values exist only for this local test build.
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
      SITE_URL_ALLOW_LOCAL: '1',
      NEXT_PUBLIC_CONTACT_EMAIL: 'e2e@example.test',
    },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
