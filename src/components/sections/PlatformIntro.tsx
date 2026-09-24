import { Barcode } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { Badge, type Tone } from '@/components/ui/Badge';
import { Section, SectionIntro } from '@/components/ui/Section';
import { PANADOL } from '@/data/demo';
import { formatPKR } from '@/lib/format';

/**
 * Each rule below is enforced by the product's database schema or its single
 * write paths — see "Core design rules" in the application README.
 */
const RULES = [
  { title: 'Stock never moves silently', body: 'Every change to a batch is written as a stock movement, and history is never edited — corrections are new, reversing entries.' },
  { title: 'Invoices stay as they were sold', body: 'Prices, costs and taxes are frozen onto each line. A later price change never rewrites an old invoice.' },
  { title: 'Returns go back to the exact batch', body: 'A return is traced to the lot it left from, so it can never credit a cheaper batch than the one dispatched.' },
  { title: 'No negative inventory', body: 'Two tills cannot sell the last box twice. The database refuses it, and the second cashier is told stock changed.' },
];

const EXPIRY_ROWS: Array<{ batch: string; expiry: string; label: string; tone: Tone }> = [
  { batch: 'PAN-2401', expiry: '31 Jan 2027', label: 'Valid', tone: 'success' },
  { batch: 'CAL-2401', expiry: '22 Oct 2026', label: 'Near expiry', tone: 'warning' },
  { batch: 'PAN-2398', expiry: '12 Sep 2026', label: 'Expired', tone: 'danger' },
  { batch: 'DET-L01', expiry: '—', label: 'No expiry', tone: 'neutral' },
];

export function PlatformIntro() {
  return (
    <Section id="platform" labelledBy="platform-title" className="py-28 sm:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <SectionIntro
          label="The platform"
          titleId="platform-title"
          title={
            <>
              Built around how a pharmacy <span className="text-text-subtle">actually works.</span>
            </>
          }
        />
        <p className="self-end text-[17px] leading-[1.7] text-pretty text-ink-muted sm:text-[18px]">
          Medicines are bought by the box and sold by the strip. The same product sits on the shelf in lots with
          different expiries. Regular customers buy on account. CarePulse models all of this directly — so the
          counter stays fast and the numbers behind it stay right.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Reveal>
          <Pillar
            kicker="Packaging"
            title="Sold by the strip. Stocked by the tablet."
            body="Each product defines its own packaging levels and conversion factors, each with its own price and barcode. Stock is always held in base units."
          >
            <ul className="divide-y divide-border text-[12.5px]">
              {[...PANADOL.units].reverse().map((unit) => (
                <li key={unit.name} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-medium text-ink">{unit.name}</span>
                  <span className="font-mono text-[11px] text-text-muted">
                    ×{unit.conversionFactor} {PANADOL.baseUnit}
                  </span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {formatPKR(unit.sellingPrice)}
                    {unit.name !== 'Tablet' ? (
                      <Barcode className="size-3.5 text-text-subtle" aria-label="Has its own barcode" />
                    ) : (
                      <span className="size-3.5" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Pillar>
        </Reveal>
        <Reveal delay={0.08}>
          <Pillar
            kicker="Batches"
            title="Every lot knows its expiry."
            body="One product, many batches — each with its own expiry, cost and quantity. Expired and quarantined lots are never sold."
          >
            <ul className="divide-y divide-border text-[12.5px]">
              {EXPIRY_ROWS.map((row) => (
                <li key={row.batch} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-mono text-[11.5px] text-ink">{row.batch}</span>
                  <span className="text-text-muted tabular-nums">{row.expiry}</span>
                  <Badge tone={row.tone}>{row.label}</Badge>
                </li>
              ))}
            </ul>
          </Pillar>
        </Reveal>
        <Reveal delay={0.16}>
          <Pillar
            kicker="Credit"
            title="Udhaar on a ledger, not in a notebook."
            body="Customer and supplier balances are calculated from their ledgers and can't be typed over. Every rupee owed has a line explaining it."
          >
            <ul className="divide-y divide-border text-[12.5px]">
              <LedgerRow label="Sale · LHR-2026-000517" amount="+600.00" balance="600.00" />
              <LedgerRow label="Return · LHR-SR-2026-000031" amount="−120.00" balance="480.00" />
              <LedgerRow label="Payment · LHR-CP-2026-000088" amount="−480.00" balance="0.00" />
            </ul>
          </Pillar>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <p className="mb-7 font-mono text-[12px] font-medium tracking-[0.14em] text-text-muted uppercase">
          Rules the system enforces for you
        </p>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((rule) => (
            <div key={rule.title} className="border-t border-ink/80 pt-4">
              <dt className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{rule.title}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{rule.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}

function Pillar({ kicker, title, body, children }: { kicker: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-[box-shadow,border-color] duration-300 hover:border-border-strong hover:shadow-cp-md sm:p-7">
      <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">{kicker}</p>
      <h3 className="mt-3 font-display text-[21px] leading-tight font-semibold tracking-[-0.02em] text-ink">{title}</h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">{body}</p>
      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-border bg-background px-3.5 py-1.5">{children}</div>
      </div>
    </article>
  );
}

function LedgerRow({ label, amount, balance }: { label: string; amount: string; balance: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <span className="truncate font-mono text-[11px] text-ink">{label}</span>
      <span className="shrink-0 text-text-muted tabular-nums">{amount}</span>
      <span className="shrink-0 font-medium text-credit tabular-nums">{balance}</span>
    </li>
  );
}
