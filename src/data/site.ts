import { isIndexable, resolveSiteUrl } from '@/lib/site-env';

/**
 * Site-wide identity and the public origin. The origin comes from the
 * environment (rules in lib/site-env.ts; next.config.ts refuses a bad
 * production build) and also reads Vercel's server-side variables, so import
 * this module from server code only — metadata, sitemap, robots, structured
 * data. Client components use data/cta.ts and data/navigation.ts.
 */
const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
};

export const site = {
  name: 'CarePulse',
  category: 'Pharmacy & Retail Management Platform',
  title: 'CarePulse — Pharmacy & Retail Management Software',
  description:
    'Pharmacy and retail management software: POS by tablet, strip or box, FEFO batch and expiry tracking, purchasing, customer credit ledgers and cash shifts.',
  url: resolveSiteUrl(env),
  indexable: isIndexable(env),
  locale: 'en_PK',
} as const;
