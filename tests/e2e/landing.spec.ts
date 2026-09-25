import { expect, test, type Page } from '@playwright/test';

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
}

test('renders without console errors, hydration warnings or horizontal overflow', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('one system');
  await scrollThrough(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('every in-page link points at an element that exists', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('a[href^="#"]', (links) => [...new Set(links.map((a) => a.getAttribute('href')!))]);
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    await expect(page.locator(href), `${href} should exist`).toHaveCount(1);
  }
});

test('has exactly one h1 and the metadata search engines need', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/CarePulse/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /pharmac/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(jsonLd!)).toHaveLength(2);
});

test('keyboard users land on the skip link first', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no hardware keyboard on the mobile profile');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows every chapter in its final state without choreography', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/');
    const inventory = page.locator('#inventory');
    await inventory.scrollIntoViewIfNeeded();
    // The FEFO allocation is already applied — no staged sort or drain.
    await expect(inventory.getByRole('cell', { name: '−120' })).toBeVisible();
    const finance = page.locator('#finance');
    await finance.scrollIntoViewIfNeeded();
    await expect(finance.getByText('Variance', { exact: true })).toBeVisible();
    // No pinned stage: the POS chapter is operated with buttons on every viewport.
    const pinSpacers = await page.locator('.pin-spacer').count();
    expect(pinSpacers).toBe(0);
    expect(errors).toEqual([]);
  });
});

test('sitemap and robots are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<loc>');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap:');
});

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  await scrollThrough(page);
  // Let the one-time reveals finish (the customer ledger posts its rows over ~3s);
  // mid-fade text would be judged at partial opacity.
  await page.waitForTimeout(3500);
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 5).join(' | ')}`);
  expect(summary).toEqual([]);
});

test('the closing call to action performs a real action', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('section[aria-labelledby="cta-title"] a').first();
  await expect(cta).toHaveAttribute('href', /^(mailto:|https?:\/\/)/);
});

test('serves a branded, non-indexable 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('isn’t on the shelf');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('meta[name="robots"][content*="index, follow"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Back to CarePulse' })).toHaveAttribute('href', '/');
});

test('sends the security headers', async ({ request }) => {
  const headers = (await request.get('/')).headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['strict-transport-security']).toContain('max-age=');
});

test('serves the brand icons, manifest and share image', async ({ page, request }) => {
  await page.goto('/');
  const icons = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]', (links) =>
    links.map((l) => l.getAttribute('href')!),
  );
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(icons.length).toBeGreaterThanOrEqual(4);
  for (const href of [...icons, new URL(ogImage!).pathname]) {
    const response = await request.get(href);
    expect(response.ok(), href).toBe(true);
  }
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  for (const icon of manifest.icons) expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
});
