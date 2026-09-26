'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { Printer } from 'lucide-react';

import { MoneyFigure } from '@/components/product/MoneyFigure';
import { SampleDataTag } from '@/components/product/SampleDataTag';
import { Badge } from '@/components/ui/Badge';
import { ScrollRegion } from '@/components/ui/ScrollRegion';
import { DEMO_BRANCH } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

const TABS = ['Cash Summary', 'Expense Breakdown', 'Activity'] as const;
type TabName = (typeof TABS)[number];

const EXPENSES = [
  { category: 'Utilities', count: 1, total: 1650 },
  { category: 'Transport & Delivery', count: 1, total: 850 },
  { category: 'Repairs & Maintenance', count: 1, total: 400 },
];
const EXPENSE_TOTAL = EXPENSES.reduce((sum, row) => sum + row.total, 0);

const ACTIVITY = [
  { when: '11:48', action: 'LOGIN', tone: 'success', description: 'Signed in at Lahore Main Pharmacy' },
  { when: '11:31', action: 'LOGOUT', tone: 'neutral', description: 'Signed out' },
  { when: '10:06', action: 'LOGIN_FAILED', tone: 'danger', description: 'Invalid email or password' },
  { when: '09:02', action: 'LOGIN', tone: 'success', description: 'Signed in at Lahore Main Pharmacy' },
] as const;

/**
 * The three report tabs the application actually ships (ReportsPage.tsx) —
 * nothing more. Real tabs: arrow keys move between them.
 */
export function ReportsScreen() {
  const [tab, setTab] = useState<TabName>('Cash Summary');
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + TABS.length) % TABS.length;
    setTab(TABS[next]!);
    tabRefs.current[next]?.focus();
  }

  // On phones the tab strip is narrower than its tabs; keep the selected one in view
  // (scrolling only the strip, never the page).
  useEffect(() => {
    const selected = tabRefs.current[TABS.indexOf(tab)];
    const strip = selected?.parentElement;
    if (!selected || !strip) return;
    strip.scrollTo({ left: selected.offsetLeft - (strip.clientWidth - selected.offsetWidth) / 2, behavior: 'smooth' });
  }, [tab]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-product">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border px-5 pt-5 sm:px-6">
        <div className="pb-4">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Reports</p>
          <p className="text-[13px] text-text-muted">{DEMO_BRANCH.name} · Today</p>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <SampleDataTag />
          <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-[12.5px] font-medium text-ink">
            <Printer className="size-3.5" aria-hidden /> Print
          </span>
        </div>
        {/* Fades at the right edge on phones to show that the strip scrolls to more tabs. */}
        <div
          role="tablist"
          aria-label="Report"
          className="-mb-px flex w-full gap-1 overflow-x-auto pr-12 [mask-image:linear-gradient(to_right,black_82%,transparent)] [scrollbar-width:none] sm:pr-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((name, index) => (
            <button
              key={name}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`${baseId}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={tab === name}
              aria-controls={`${baseId}-panel`}
              tabIndex={tab === name ? 0 : -1}
              onClick={() => setTab(name)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'border-b-2 px-3 py-2.5 text-[13.5px] font-medium whitespace-nowrap transition-colors',
                tab === name ? 'border-primary text-ink' : 'border-transparent text-text-muted hover:text-ink',
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${TABS.indexOf(tab)}`}
        className="min-h-[392px] bg-background p-3 sm:p-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === 'Cash Summary' && <CashSummary />}
            {tab === 'Expense Breakdown' && <ExpenseBreakdown />}
            {tab === 'Activity' && <Activity />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CashSummary() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-4">
        <Stat label="Sales" value={formatPKR(48320)} caption="126 completed sale(s)" />
        <Stat label="Gross profit" value={formatPKR(11940)} caption={`Cost of goods: ${formatPKR(36380)}`} />
        <Stat label="Cash drawer net" value={formatPKR(38220)} caption={`In ${formatPKR(41970)} / Out ${formatPKR(3750)}`} />
        <Stat label="Expenses" value={formatPKR(2900)} caption="3 recorded" />
      </div>
      {/* Three groups side by side only from xl; below that two columns, with the last spanning both. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:[&>*:last-child]:col-span-2 xl:[&>*:last-child]:col-span-1">
        <Group title="Sales by tender">
          <Info label="Cash" value={formatPKR(39120)} />
          <Info label="Card" value={formatPKR(5400)} />
          <Info label="Bank transfer" value={formatPKR(1200)} />
          <Info label="Digital wallet" value={formatPKR(1900)} />
          <Info label="Credit" value={formatPKR(700)} />
        </Group>
        <Group title="Collections & payouts">
          <Info label="Customer payments" value={formatPKR(2850)} />
          <Info label="Supplier payments" value={formatPKR(18810)} />
          <Info label="Expenses paid out" value={formatPKR(2900)} />
          <Info label="Refunds" value={formatPKR(850)} />
        </Group>
        <Group title="Cash shifts">
          <Info label="Total" value="3" />
          <Info label="Open" value="1" />
          <Info label="Closed" value="2" />
          <Info label="With a variance" value="1" />
          <Info label="Total variance" value={`− ${formatPKR(150)}`} />
        </Group>
      </div>
    </div>
  );
}

function ExpenseBreakdown() {
  return (
    <ScrollRegion label="Expense breakdown" className="rounded-lg border border-border bg-white">
      <table className="w-full text-left text-[13px]">
        <thead className="text-[10.5px] tracking-wide text-text-muted uppercase">
          <tr className="border-b border-border">
            <th className="px-3 sm:px-4 py-2.5 font-medium">Category</th>
            <th className="hidden px-3 py-2.5 text-right font-medium sm:table-cell">Count</th>
            <th className="px-3 py-2.5 text-right font-medium">Total</th>
            <th className="px-3 sm:px-4 py-2.5 font-medium">Share</th>
          </tr>
        </thead>
        <tbody>
          {EXPENSES.map((row) => {
            const share = (row.total / EXPENSE_TOTAL) * 100;
            return (
              <tr key={row.category} className="border-b border-border last:border-0">
                <td className="px-3 sm:px-4 py-3 font-medium text-ink">{row.category}</td>
                <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">{row.count}</td>
                <td className="px-3 py-3 text-right whitespace-nowrap tabular-nums">{formatPKR(row.total)}</td>
                <td className="px-3 sm:px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Phones keep the percentage; the bar joins from sm where there is room. */}
                    <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted sm:block">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${share}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                      />
                    </div>
                    <span className="text-[12px] whitespace-nowrap text-text-muted tabular-nums">{share.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td className="px-3 sm:px-4 py-3 font-semibold text-ink">Total</td>
            <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">3</td>
            <td className="px-3 py-3 text-right font-semibold whitespace-nowrap tabular-nums">{formatPKR(EXPENSE_TOTAL)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </ScrollRegion>
  );
}

function Activity() {
  return (
    <ScrollRegion label="Sign-in activity" className="rounded-lg border border-border bg-white">
      <table className="w-full text-left text-[13px]">
        <thead className="text-[10.5px] tracking-wide text-text-muted uppercase">
          <tr className="border-b border-border">
            <th className="px-3 sm:px-4 py-2.5 font-medium">When</th>
            <th className="px-3 py-2.5 font-medium">Event</th>
            <th className="px-3 sm:px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {ACTIVITY.map((row, index) => (
            <tr key={index} className="border-b border-border last:border-0">
              <td className="px-3 sm:px-4 py-3 text-ink-muted tabular-nums">{row.when}</td>
              <td className="px-3 py-3">
                <Badge tone={row.tone}>{row.action.replace(/_/g, ' ')}</Badge>
              </td>
              <td className="px-3 sm:px-4 py-3 text-ink-muted">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3.5">
      <p className="text-[10.5px] font-medium tracking-wide text-text-muted uppercase">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap text-ink tabular-nums sm:text-[18px]">
        <MoneyFigure value={value} />
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-text-subtle">{caption}</p>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3.5">
      <p className="mb-2 text-[12.5px] font-semibold text-ink">{title}</p>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-[12.5px]">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right whitespace-nowrap text-ink tabular-nums">{value}</dd>
    </div>
  );
}
