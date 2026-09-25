'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useInView } from 'motion/react';

import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { SampleDataTag } from '@/components/product/SampleDataTag';
import { Badge } from '@/components/ui/Badge';
import { ScrollRegion } from '@/components/ui/ScrollRegion';
import { CUSTOMER } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

const ROWS = [
  {
    date: '02 Oct 2026',
    source: 'SALE',
    document: 'LHR-2026-000517',
    note: 'Sale 1,000.00 · paid 400.00 cash',
    debit: 600,
    credit: 0,
    balance: 600,
  },
  {
    date: '09 Oct 2026',
    source: 'SALE_RETURN',
    document: 'LHR-SR-2026-000031',
    note: 'Settles the account before any refund',
    debit: 0,
    credit: 120,
    balance: 480,
  },
  {
    date: '15 Oct 2026',
    source: 'CUSTOMER_PAYMENT',
    document: 'LHR-CP-2026-000088',
    note: 'Cash, at the counter',
    debit: 0,
    credit: 480,
    balance: 0,
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** The customer detail drawer's Ledger tab, recreated; rows post one by one on first view. */
export function CustomerLedger() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);
  const visible = reduce ? ROWS.length : shown;

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = ROWS.map((_, index) => window.setTimeout(() => setShown(index + 1), 350 + index * 900));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce]);

  const balance = visible === 0 ? 0 : ROWS[visible - 1]!.balance;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-border bg-white shadow-cp-md">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <p className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {CUSTOMER.name}
            <SampleDataTag />
          </p>
          <p className="text-[13px] text-text-muted">+92-300-0000102 · Credit limit {formatPKR(CUSTOMER.creditLimit)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium tracking-wide text-text-muted uppercase">Current balance</p>
          <p
            className={cn(
              'text-[22px] font-semibold tracking-[-0.01em] tabular-nums transition-colors duration-500',
              balance > 0 ? 'text-credit' : 'text-ink',
            )}
            aria-live="polite"
          >
            {formatPKR(balance)}
          </p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border px-5 text-[13px] sm:px-6" aria-hidden>
        {['Sales', 'Ledger', 'Payments'].map((tab) => (
          <span
            key={tab}
            className={cn(
              'border-b-2 px-2.5 py-2.5 font-medium',
              tab === 'Ledger' ? 'border-primary text-ink' : 'border-transparent text-text-muted',
            )}
          >
            {tab}
          </span>
        ))}
      </div>

      <ScrollRegion label="Customer ledger">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead className="text-[10.5px] tracking-wide text-text-muted uppercase">
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 font-medium sm:px-6">Date</th>
              <th className="px-3 py-2.5 font-medium">Source</th>
              <th className="px-3 py-2.5 text-right font-medium">Debit</th>
              <th className="px-3 py-2.5 text-right font-medium">Credit</th>
              <th className="px-5 py-2.5 text-right font-medium sm:px-6">Balance</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {ROWS.slice(0, visible).map((row) => (
                <motion.tr
                  key={row.document}
                  initial={reduce ? false : { opacity: 0, y: 8, backgroundColor: 'rgba(124,58,237,0.08)' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(124,58,237,0)' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 whitespace-nowrap text-ink-muted tabular-nums sm:px-6">{row.date}</td>
                  <td className="px-3 py-3">
                    <p className="font-mono text-[11px] font-medium text-ink">{row.source}</p>
                    <p className="font-mono text-[11px] text-text-muted">{row.document}</p>
                    <p className="text-[12px] text-text-subtle">{row.note}</p>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{row.debit ? row.debit.toFixed(2) : ''}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{row.credit ? row.credit.toFixed(2) : ''}</td>
                  <td className="px-5 py-3 text-right font-medium text-credit tabular-nums sm:px-6">
                    {row.balance.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {visible === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-[13px] text-text-subtle">
                  No ledger entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollRegion>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background px-5 py-3 text-[12px] text-text-muted sm:px-6">
        <span>Balance is the sum of the ledger — it cannot be edited directly.</span>
        <Badge tone="credit">Udhaar</Badge>
      </div>
    </div>
  );
}
