import { readAppUrl, readContactEmail } from '@/lib/site-env';

// Named literally so Next.js inlines them into the client bundle (see data/site.ts).
const appUrl = readAppUrl({ NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL });
const contactEmail = readContactEmail({ NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL });

export interface Cta {
  label: string;
  href: string;
}

/**
 * The only real conversion actions the site can offer, each present only
 * when its destination is configured. Nothing here is ever invented.
 */
export const contactCta: Cta | null = contactEmail
  ? { label: 'Talk to us', href: `mailto:${contactEmail}?subject=${encodeURIComponent('CarePulse enquiry')}` }
  : null;

export const signInCta: Cta | null = appUrl ? { label: 'Sign in', href: appUrl } : null;

/**
 * The closing call to action: contact first, the application otherwise.
 * A production build without either is refused (lib/site-env.ts), so `null`
 * only happens in local development.
 */
export const closingCtas: { primary: Cta | null; secondary: Cta | null } = contactCta
  ? { primary: contactCta, secondary: signInCta }
  : { primary: signInCta ? { label: 'Sign in to CarePulse', href: signInCta.href } : null, secondary: null };

/** The header button: contact when configured, otherwise a way into the product story. */
export const headerCta: Cta = contactCta ?? { label: 'Explore CarePulse', href: '#platform' };
