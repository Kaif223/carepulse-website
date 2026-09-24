import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { CashShiftClose } from '@/components/product/CashShiftClose';
import { Badge } from '@/components/ui/Badge';
import { Section, SectionIntro } from '@/components/ui/Section';
import { EXPENSE_CATEGORIES } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

/** FinancialTransaction types and directions exactly as the schema pins them. */
const TRANSACTIONS = [
  { type: 'SALE_PAYMENT', ref: 'LHR-2026-000482', method: 'Cash', amount: 312.55, direction: 'in', drawer: true },
  { type: 'SALE_PAYMENT', ref: 'LHR-2026-000483', method: 'Card', amount: 1850, direction: 'in', drawer: false },
  { type: 'CUSTOMER_PAYMENT', ref: 'LHR-CP-2026-000088', method: 'Cash', amount: 480, direction: 'in', drawer: true },
  { type: 'EXPENSE', ref: 'LHR-EXP-2026-000019', method: 'Cash', amount: 1650, direction: 'out', drawer: true, note: 'Utilities' },
  { type: 'SUPPLIER_PAYMENT', ref: 'LHR-SP-2026-000007', method: 'Bank transfer', amount: 18810, direction: 'out', drawer: false },
] as const;

export function FinanceSection() {
  return (
    <Section id="finance" tone="white" labelledBy="finance-title" className="py-28 sm:py-36">
      <SectionIntro
        chapter="06"
        label="Finance · Cash shifts"
        titleId="finance-title"
        title="Every drawer closes with an explanation."
        lede="Cash shifts, expenses and payments share one cash-and-bank ledger. Only cash touches the drawer, so a card payment never shows up as a shortage at close."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <Reveal>
          <CashShiftClose />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-cp-md">
            <div className="flex flex-col gap-0.5 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[15px] font-semibold text-ink">Financial transactions</p>
              <p className="text-[12px] text-text-muted">Append-only · reversals, never edits</p>
            </div>
            <ul className="divide-y divide-border">
              {TRANSACTIONS.map((tx) => {
                const Icon = tx.direction === 'in' ? ArrowDownLeft : ArrowUpRight;
                return (
                  <li key={tx.ref} className="flex items-center gap-3.5 px-5 py-3">
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full',
                        tx.direction === 'in' ? 'bg-success-bg text-success' : 'bg-neutral-bg text-ink-muted',
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                      <span className="sr-only">{tx.direction === 'in' ? 'Cash in' : 'Cash out'}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11.5px] font-medium text-ink">{tx.type}</p>
                      <p className="truncate text-[12.5px] text-text-muted">
                        {tx.ref} · {tx.method}
                        <span className="sm:hidden"> · {tx.drawer ? 'in drawer' : 'not in drawer'}</span>
                        {'note' in tx ? ` · ${tx.note}` : ''}
                      </p>
                    </div>
                    <span className="hidden sm:block">
                      <Badge tone={tx.drawer ? 'info' : 'neutral'}>{tx.drawer ? 'In drawer' : 'Not in drawer'}</Badge>
                    </span>
                    <span className="w-[112px] shrink-0 text-right text-[13.5px] font-medium text-ink tabular-nums">
                      {tx.direction === 'in' ? '+' : '−'} {formatPKR(tx.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-[15px] font-semibold text-ink">Expenses</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
                Recorded against a category and branch. Cash expenses come out of the open drawer; a void posts a
                reversal.
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {EXPENSE_CATEGORIES.map((category) => (
                  <li
                    key={category}
                    className="rounded-full bg-white px-2.5 py-1 text-[12px] text-ink-muted ring-1 ring-border"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-[15px] font-semibold text-ink">One open drawer per cashier</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
                A cashier can&apos;t open a second shift at the same branch. Cash taken while a shift is open attaches
                to it automatically; a closed shift never gains transactions afterwards.
              </p>
              <p className="mt-4 font-mono text-[12px] text-ink">expected = float + cash in − cash out</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
