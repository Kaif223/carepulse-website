import type { Metadata } from 'next';
import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

// Next.js adds `noindex` to every 404 response; this only sets the title.
export const metadata: Metadata = {
  title: 'Page not found',
};

const DESTINATIONS = [
  { label: 'How it works', href: '/#system' },
  { label: 'Point of Sale', href: '/#pos' },
  { label: 'Inventory & FEFO', href: '/#inventory' },
  { label: 'FAQ', href: '/#faq' },
];

export default function NotFound() {
  return (
    <main id="main" className="bg-grid flex min-h-screen flex-col">
      <Container className="flex h-[72px] items-center">
        <Link href="/" aria-label="CarePulse — home" className="rounded-md">
          <Logo priority />
        </Link>
      </Container>
      <Container className="flex flex-1 flex-col justify-center py-20">
        <p className="font-mono text-[12px] font-medium tracking-[0.14em] text-primary uppercase">404</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-ink">
          This page isn’t on the shelf.
        </h1>
        <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-ink-muted">
          The address may be mistyped, or the page may have moved. Everything about CarePulse is on the home page.
        </p>
        <div className="mt-9">
          <ButtonLink href="/" size="lg" arrow>
            Back to CarePulse
          </ButtonLink>
        </div>
        <nav aria-label="Popular sections" className="mt-14 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
            {DESTINATIONS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </main>
  );
}
