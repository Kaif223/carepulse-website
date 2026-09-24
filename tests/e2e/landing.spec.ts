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
