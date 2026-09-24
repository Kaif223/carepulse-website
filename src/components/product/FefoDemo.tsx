'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { LayoutGroup, motion, useInView } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { DEMO_BRANCH, DEMO_TODAY, PANADOL, PANADOL_BATCHES } from '@/data/demo';
import { cn } from '@/lib/cn';
import { compareFefo, exclusionReason, planFefo, type DemoBatch } from '@/lib/fefo';
import { formatQty } from '@/lib/format';

type Phase = 'received' | 'sorted' | 'allocated';

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_QTY = 20;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso: string | null): string {
  if (!iso) return 'No expiry';
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`;
}

function daysUntil(iso: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${DEMO_TODAY}T00:00:00Z`)) / 86_400_000);
}

/**
 * The FEFO planner, visualised. On first view the batches appear in the order
 * they were received, re-sort into FEFO order (expired and quarantined lots
 * drop out), and then the request drains them. After that the visitor can
 * change the quantity and packaging and watch the real planner re-allocate.
 */
export function FefoDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  const reduce = usePrefersReducedMotion();
  const [animatedPhase, setPhase] = useState<Phase>('received');
  const phase: Phase = reduce ? 'allocated' : animatedPhase;
  const [unitIndex, setUnitIndex] = useState(2); // Box
  const [quantity, setQuantity] = useState(2);

  const unit = PANADOL.units[unitIndex]!;
  const requested = quantity * unit.conversionFactor;
  const plan = useMemo(() => planFefo(PANADOL_BATCHES, requested, DEMO_TODAY), [requested]);

  useEffect(() => {
    if (!inView || reduce) return;
    const toSorted = window.setTimeout(() => setPhase('sorted'), 700);
    const toAllocated = window.setTimeout(() => setPhase('allocated'), 1700);
    return () => {
      window.clearTimeout(toSorted);
      window.clearTimeout(toAllocated);
    };
  }, [inView, reduce]);

  const ordered: DemoBatch[] = useMemo(() => {
    if (phase === 'received') {
      return [...PANADOL_BATCHES].sort((a, b) => (a.receivedAt < b.receivedAt ? -1 : 1));
    }
    const eligible = PANADOL_BATCHES.filter((b) => !exclusionReason(b, DEMO_TODAY)).sort(compareFefo);
    const excluded = PANADOL_BATCHES.filter((b) => exclusionReason(b, DEMO_TODAY));
    return [...eligible, ...excluded];
  }, [phase]);

  const allocationFor = (batchNumber: string) =>
    phase === 'allocated' ? plan.allocations.find((a) => a.batchNumber === batchNumber) : undefined;

  const firstExcludedIndex = ordered.findIndex((b) => exclusionReason(b, DEMO_TODAY));

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-border bg-white shadow-cp-md">
      <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[15px] font-semibold text-ink">{PANADOL.name}</p>
          <p className="text-[13px] text-text-muted">
            {DEMO_BRANCH.name} · stock held in {PANADOL.baseUnit.toLowerCase()}s
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Sale request">
          <span className="text-[13px] font-medium text-ink-muted">Sell</span>
          <div className="flex items-center rounded-full ring-1 ring-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-surface-muted disabled:opacity-35"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <output aria-live="polite" aria-label="Quantity" className="w-7 text-center text-[14px] font-semibold tabular-nums">
              {quantity}
            </output>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
              disabled={quantity >= MAX_QTY}
              className="inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-surface-muted disabled:opacity-35"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <div className="flex rounded-full bg-surface-muted p-1" role="radiogroup" aria-label="Packaging">
            {PANADOL.units.map((option, index) => (
              <button
                key={option.name}
                type="button"
                role="radio"
                aria-checked={index === unitIndex}
                onClick={() => setUnitIndex(index)}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                  index === unitIndex ? 'text-ink' : 'text-text-muted hover:text-ink',
                )}
              >
                {index === unitIndex && (
                  <motion.span
                    layoutId="fefo-unit"
                    className="absolute inset-0 rounded-full bg-white shadow-cp-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-3 flex flex-col gap-1 text-[12px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono tracking-wide uppercase">
              {phase === 'received' ? 'Shelf · order received' : 'FEFO order · earliest expiry first'}
            </span>
            <span className="tabular-nums">
              {quantity} {unit.name} = {formatQty(requested)} {PANADOL.baseUnit}
            </span>
          </div>

          <LayoutGroup>
            <ul className="space-y-2">
              {ordered.map((batch, index) => {
                const reason = phase === 'received' ? null : exclusionReason(batch, DEMO_TODAY);
                const allocation = allocationFor(batch.batchNumber);
                const take = allocation?.quantity ?? 0;
                const remaining = batch.quantity - take;
                return (
                  <motion.li
                    key={batch.batchNumber}
                    layout={!reduce}
                    transition={{ layout: { duration: 0.7, ease: EASE } }}
                    className={cn(
                      'rounded-xl border px-3.5 py-3 transition-colors duration-500',
                      reason ? 'border-dashed border-border bg-background' : 'border-border bg-white',
                      allocation && 'border-primary/40 bg-primary-soft/50',
                      index === firstExcludedIndex && phase !== 'received' && 'mt-5',
                    )}
                  >
                    {index === firstExcludedIndex && phase !== 'received' && (
                      <p className="sr-only">Never allocated:</p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[13px] font-medium text-ink">{batch.batchNumber}</span>
                        <BatchBadge batch={batch} excludedReason={exclusionReason(batch, DEMO_TODAY)} />
                      </div>
                      <span className="text-[12.5px] text-text-muted tabular-nums">
                        {batch.isQuarantined ? batch.quarantineReason : `Exp. ${formatDate(batch.expiryDate)}`}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div
                        className={cn(
                          'relative h-2 flex-1 overflow-hidden rounded-full',
                          reason ? 'bg-[repeating-linear-gradient(135deg,#e2e8f0_0_6px,#f1f5f9_6px_12px)]' : 'bg-surface-muted',
                        )}
                      >
                        {!reason && (
                          <motion.span
                            className="absolute inset-y-0 left-0 rounded-full bg-ink/15"
                            initial={false}
                            animate={{ width: `${(remaining / batch.quantity) * 100}%` }}
                            transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
                          />
                        )}
                        {!reason && (
                          <motion.span
                            className="absolute inset-y-0 rounded-full bg-primary"
                            initial={false}
                            animate={{
                              left: `${(remaining / batch.quantity) * 100}%`,
                              width: `${(take / batch.quantity) * 100}%`,
                            }}
                            transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
                          />
                        )}
                      </div>
                      <span className="w-[92px] shrink-0 text-right text-[12.5px] tabular-nums">
                        {allocation ? (
                          <span className="font-semibold text-primary">−{formatQty(take)}</span>
                        ) : (
                          <span className={reason ? 'text-text-subtle' : 'text-ink'}>{formatQty(batch.quantity)}</span>
                        )}
                        <span className="text-text-subtle"> / {formatQty(batch.quantity)}</span>
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </LayoutGroup>
        </div>

        <aside className="border-t border-border bg-background px-5 py-5 sm:px-6 lg:border-t-0 lg:border-l" aria-label="Resulting stock movements">
          <p className="font-mono text-[12px] tracking-wide text-text-muted uppercase">Stock movements</p>
          <div className="mt-3 min-h-[132px]" aria-live="polite">
            {phase === 'allocated' ? (
              plan.fulfillable ? (
                <table className="w-full text-[12.5px]">
                  <thead className="text-left text-[10.5px] tracking-wide text-text-muted uppercase">
                    <tr>
                      <th className="pb-1.5 font-medium">Type</th>
                      <th className="pb-1.5 font-medium">Batch</th>
                      <th className="pb-1.5 text-right font-medium">Qty</th>
                      <th className="pb-1.5 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.allocations.map((a, index) => (
                      <motion.tr
                        key={`${a.batchNumber}-${requested}`}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.2 + index * 0.1 }}
                        className="border-t border-border"
                      >
                        <td className="py-2 font-mono text-[11px] text-danger">SALE</td>
                        <td className="py-2 font-mono text-[11.5px]">{a.batchNumber}</td>
                        <td className="py-2 text-right tabular-nums">−{formatQty(a.quantity)}</td>
                        <td className="py-2 text-right tabular-nums">{formatQty(a.balanceAfter)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="rounded-lg border border-danger-border bg-danger-bg px-3.5 py-3 text-[13px] text-danger">
                  Only {formatQty(plan.allocated)} sellable {PANADOL.baseUnit.toLowerCase()}s — short by{' '}
                  {formatQty(plan.shortfall)}. CarePulse refuses the sale rather than oversell; no stock moves.
                </div>
              )
            ) : (
              <p className="text-[13px] text-text-subtle">Waiting for the sale…</p>
            )}
          </div>
          <ul className="mt-5 space-y-2.5 border-t border-border pt-4 text-[13px] leading-snug text-ink-muted">
            <li>Earliest expiry first; lots with no expiry go last.</li>
            <li>Ties go to the batch received first.</li>
            <li>Expired and quarantined lots are never allocated.</li>
            <li>A pharmacist with override permission can pick a batch — and the override is audit-logged.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function BatchBadge({ batch, excludedReason }: { batch: DemoBatch; excludedReason: ReturnType<typeof exclusionReason> }) {
  if (excludedReason === 'QUARANTINED') return <Badge tone="danger">Quarantined</Badge>;
  if (excludedReason === 'EXPIRED') return <Badge tone="danger">Expired</Badge>;
  if (!batch.expiryDate) return <Badge tone="neutral">No expiry</Badge>;
  const days = daysUntil(batch.expiryDate);
  if (days < 0) return <Badge tone="danger">Expired</Badge>;
  if (days <= 30) return <Badge tone="warning">Near expiry</Badge>;
  return <Badge tone="success">Valid</Badge>;
}
