import type { CSSProperties } from 'react';

import { ArrowDownRight } from 'lucide-react';

import { DashboardScreen } from '@/components/product/DashboardScreen';
import { ProductWindow } from '@/components/product/AppShell';
import { ReceiptCard } from '@/components/product/ReceiptCard';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

import { HeroParallax } from './HeroParallax';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const AUDIENCES = ['Independent pharmacies', 'Medical stores', 'Retail & FMCG', 'Multi-branch operators'];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-[720px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-280px] left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.13),transparent)]"
      />

      <Container className="relative">
        <p
          className="hero-in mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-white/70 py-1 pr-3.5 pl-3.5 sm:pl-1.5 text-[13px] font-medium text-ink-muted"
          style={delay(80)}
        >
          <span className="hidden rounded-full bg-primary-soft px-2 py-0.5 font-mono sm:inline text-[11px] font-semibold tracking-wide text-primary">
            POS · FEFO · LEDGERS
          </span>
          Pharmacy &amp; retail management platform
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <h1
            id="hero-title"
            className="hero-in font-display text-[clamp(2.5rem,6vw,4.6rem)] leading-[1] font-semibold tracking-[-0.038em] text-balance text-ink"
            style={delay(160)}
          >
            Run the counter, the shelf and the books from{' '}
            <span className="text-primary">one system.</span>
          </h1>

          <div className="lg:pb-2">
            <p className="hero-in text-[17px] leading-[1.65] text-pretty text-ink-muted sm:text-[18px]" style={delay(300)}>
              CarePulse is management software for pharmacies and retail stores. Sell by the tablet, strip or box,
              dispense the earliest-expiring batch first, carry customer credit on a real ledger and reconcile every
              cash drawer at close — at one branch or several.
            </p>
            <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={delay(420)}>
              <ButtonLink href="#platform" size="lg" arrow className="w-full sm:w-auto">
                Explore CarePulse
              </ButtonLink>
              <ButtonLink href="#system" size="lg" variant="secondary" className="w-full sm:w-auto">
                See how it works
              </ButtonLink>
            </div>
          </div>
        </div>

        <ul
          className="hero-in mt-10 flex flex-wrap gap-x-7 gap-y-2 border-t border-border pt-5 text-[14px] text-ink-muted"
          style={delay(520)}
          aria-label="Built for"
        >
          {AUDIENCES.map((audience) => (
            <li key={audience} className="flex items-center gap-2">
              <ArrowDownRight className="size-3.5 text-primary" aria-hidden />
              {audience}
            </li>
          ))}
        </ul>
      </Container>

      <Container className="relative mt-14 sm:mt-16">
        <figure>
          <HeroParallax
            window={
              <div className="hero-product" style={delay(560)}>
                <ProductWindow className="mx-auto max-w-[1120px]">
                  <div aria-hidden className="pointer-events-none select-none">
                    <DashboardScreen />
                  </div>
                </ProductWindow>
              </div>
            }
            overlays={
              <div aria-hidden className="hidden lg:block">
                <div className="hero-pop absolute -bottom-10 -left-4 w-[272px] xl:-left-10" style={delay(1250)}>
                  <ReceiptCard compact />
                </div>
                <div className="hero-pop absolute top-[34%] -right-4 w-[296px] xl:-right-10" style={delay(1450)}>
                  <FefoChip />
                </div>
              </div>
            }
          />
          <figcaption className="sr-only">
            The CarePulse dashboard for Lahore Main Pharmacy: today&apos;s sales, the open cash shift, low-stock and
            expiring-batch alerts and the most recent invoices, with a printed receipt and a FEFO batch allocation.
          </figcaption>
          <p className="mt-6 text-center text-[12px] text-text-subtle lg:mt-16">
            Product interface shown with sample data.
          </p>
        </figure>
      </Container>
    </section>
  );
}

function FefoChip() {
  return (
    <div className="rounded-xl bg-white p-3.5 text-[12px] shadow-float ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">FEFO allocation</p>
        <span className="rounded-full bg-success-bg px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-success-border ring-inset">
          Fulfilled
        </span>
      </div>
      <p className="mt-2 font-semibold text-ink">Panadol 500mg Tablet</p>
      <p className="text-[11px] text-text-muted">2 Box = 200 Tablet (base units)</p>
      <ul className="mt-2.5 space-y-1.5">
        {[
          { batch: 'PAN-2401', expiry: 'Jan 2027', take: 120, of: 120 },
          { batch: 'PAN-2402', expiry: 'Jun 2027', take: 80, of: 300 },
        ].map((row) => (
          <li key={row.batch}>
            <div className="flex justify-between font-mono text-[10.5px]">
              <span className="text-ink">
                {row.batch} <span className="text-text-subtle">· {row.expiry}</span>
              </span>
              <span className="tabular-nums text-ink">−{row.take}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(row.take / row.of) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
