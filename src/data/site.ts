/**
 * Site-wide configuration. Anything that depends on the deployment (the public
 * origin, the application's sign-in URL, a sales contact) comes from the
 * environment, and anything left unset is simply not rendered — this site
 * never shows a link that goes nowhere.
 */

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, '') : null;
}

export const site = {
  name: 'CarePulse',
  category: 'Pharmacy & Retail Management Platform',
  title: 'CarePulse — Pharmacy & Retail Management Software',
  description:
    'CarePulse runs the counter, the shelf and the books for pharmacies and retail stores: POS with packaging-aware selling, batch and expiry tracking with FEFO, purchasing, customer credit ledgers, cash shifts and branch-aware access control.',
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000',
  appUrl: clean(process.env.NEXT_PUBLIC_APP_URL),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
  locale: 'en_PK',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** In-page chapters. Every href is an id rendered on the landing page. */
export const primaryNav: NavLink[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Point of Sale', href: '#pos' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Finance', href: '#finance' },
  { label: 'Branches', href: '#branches' },
  { label: 'FAQ', href: '#faq' },
];
