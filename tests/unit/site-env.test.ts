import { describe, expect, it } from 'vitest';

import { isIndexable, productionConfigProblems, resolveSiteUrl } from '@/lib/site-env';

const valid = {
  NEXT_PUBLIC_SITE_URL: 'https://carepulse.pk/',
  NEXT_PUBLIC_CONTACT_EMAIL: 'sales@carepulse.pk',
};

describe('resolveSiteUrl', () => {
  it('prefers the explicit setting and strips trailing slashes', () => {
    expect(resolveSiteUrl(valid)).toBe('https://carepulse.pk');
  });

  it('uses the preview URL only on Vercel previews', () => {
    expect(resolveSiteUrl({ VERCEL_ENV: 'preview', VERCEL_URL: 'cp-abc.vercel.app' })).toBe('https://cp-abc.vercel.app');
    expect(resolveSiteUrl({ VERCEL_ENV: 'production', VERCEL_URL: 'cp-abc.vercel.app' })).toBe('http://localhost:3000');
  });

  it("uses Vercel's production domain when no site URL is set", () => {
    const env = { VERCEL_ENV: 'production', VERCEL_URL: 'cp-abc.vercel.app', VERCEL_PROJECT_PRODUCTION_URL: 'carepulse-website.vercel.app' };
    expect(resolveSiteUrl(env)).toBe('https://carepulse-website.vercel.app');
    expect(resolveSiteUrl({ ...env, NEXT_PUBLIC_SITE_URL: 'https://carepulse.pk' })).toBe('https://carepulse.pk');
  });

  it('falls back to localhost for local development', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:3000');
  });
});

describe('productionConfigProblems', () => {
  it('accepts a complete production configuration', () => {
    expect(productionConfigProblems(valid)).toEqual([]);
  });

  it.each([
    [undefined, /NEXT_PUBLIC_SITE_URL is not set/],
    ['http://localhost:3000', /local address/],
    ['https://carepulse.example', /placeholder/],
    ['https://YOUR-DOMAIN.com', /placeholder/],
    ['not a url', /not a valid URL/],
    ['http://carepulse.pk', /https/],
  ])('refuses the site URL %s', (siteUrl, message) => {
    const problems = productionConfigProblems({ ...valid, NEXT_PUBLIC_SITE_URL: siteUrl });
    expect(problems.join('\n')).toMatch(message);
  });

  it('refuses a build with no real call to action', () => {
    expect(productionConfigProblems({ NEXT_PUBLIC_SITE_URL: 'https://carepulse.pk' }).join('\n')).toMatch(
      /Neither NEXT_PUBLIC_CONTACT_EMAIL nor NEXT_PUBLIC_APP_URL/,
    );
  });

  it('validates the optional values when they are set', () => {
    const problems = productionConfigProblems({ ...valid, NEXT_PUBLIC_APP_URL: 'ftp://app', NEXT_PUBLIC_CONTACT_EMAIL: 'nope' });
    expect(problems).toHaveLength(2);
  });

  it('allows a local origin only when explicitly requested for local testing', () => {
    const local = { ...valid, NEXT_PUBLIC_SITE_URL: 'http://localhost:3200' };
    expect(productionConfigProblems(local)).not.toEqual([]);
    expect(productionConfigProblems({ ...local, SITE_URL_ALLOW_LOCAL: '1' })).toEqual([]);
  });

  it('accepts a Vercel production build without an explicit site URL, but still needs a CTA', () => {
    const env = { VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'carepulse-website.vercel.app' };
    expect(productionConfigProblems(env).join('\n')).toMatch(/Neither NEXT_PUBLIC_CONTACT_EMAIL nor NEXT_PUBLIC_APP_URL/);
    expect(productionConfigProblems({ ...env, NEXT_PUBLIC_CONTACT_EMAIL: 'a@b.pk' })).toEqual([]);
  });

  it('accepts a Vercel preview without an explicit site URL', () => {
    expect(
      productionConfigProblems({ VERCEL_ENV: 'preview', VERCEL_URL: 'cp-abc.vercel.app', NEXT_PUBLIC_CONTACT_EMAIL: 'a@b.pk' }),
    ).toEqual([]);
  });
});

describe('isIndexable', () => {
  it('keeps previews out of search engines', () => {
    expect(isIndexable({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isIndexable({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isIndexable({})).toBe(true);
  });
});
