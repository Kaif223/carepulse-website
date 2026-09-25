'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useInView } from 'motion/react';
import { Banknote } from 'lucide-react';

import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

export const SHIFT = { openingFloat: 5000, cashIn: 41970, cashOut: 3750, counted: 43070 } as const;
const EXPECTED = SHIFT.openingFloat + SHIFT.cashIn - SHIFT.cashOut;
const VARIANCE = SHIFT.counted - EXPECTED;
const COUNTED_TEXT = SHIFT.counted.toFixed(2);

/**
 * Closing a cash shift: expected = opening float + cash in − cash out, the
 * cashier enters what they counted, and a non-zero variance cannot be saved
 * without a reason. The counted figure types itself in on first view.
 */
export function CashShiftClose() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });
  const reduce = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);
  const chars = reduce ? COUNTED_TEXT.length : typed;
  const done = chars >= COUNTED_TEXT.length;

  useEffect(() => {
    if (!inView || reduce) return;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(index);
      if (index >= COUNTED_TEXT.length) window.clearInterval(timer);
    }, 110);
    return () => window.clearInterval(timer);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-white shadow-cp-md">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <Banknote className="size-4 text-text-muted" aria-hidden /> Close cash shift
        </p>
        <Badge tone="info">OPEN</Badge>
      </div>
      <dl className="space-y-2 px-5 py-4 text-[13.5px]">
        <Line label="Opening float" value={formatPKR(SHIFT.openingFloat)} />
        <Line label="Cash in" value={`+ ${formatPKR(SHIFT.cashIn)}`} />
        <Line label="Cash out" value={`− ${formatPKR(SHIFT.cashOut)}`} />
        <Line label="System expected" value={formatPKR(EXPECTED)} strong className="border-t border-border pt-2" />
      </dl>
      <div className="border-t border-border px-5 py-4">
        <p className="text-[12.5px] font-medium text-ink">Counted cash</p>
        <div
          className={cn(
            'mt-1.5 flex h-10 items-center rounded-md border px-3 text-[14px] tabular-nums',
            done ? 'border-border' : 'border-primary ring-3 ring-primary/15',
          )}
        >
          {chars > 0 ? COUNTED_TEXT.slice(0, chars) : <span className="text-text-subtle">0.00</span>}
          {!done && <span className="ml-px inline-block h-4 w-px animate-pulse bg-ink" />}
        </div>
        <AnimatePresence>
          {done && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center justify-between rounded-md bg-danger-bg px-3 py-2 text-[13.5px] ring-1 ring-danger-border ring-inset">
                <span className="font-medium text-danger">Variance</span>
                <span className="font-semibold text-danger tabular-nums">− {formatPKR(Math.abs(VARIANCE))}</span>
              </div>
              <p className="mt-3 text-[12.5px] font-medium text-ink">
                Variance reason <span className="text-danger">*</span>
              </p>
              <div className="mt-1.5 h-10 rounded-md border border-danger-border bg-white px-3 py-2.5 text-[13px] text-text-subtle">
                Required when the count doesn&apos;t match
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-text-muted">Writes audit event CASH_SHIFT_VARIANCE</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Line({ label, value, strong, className }: { label: string; value: string; strong?: boolean; className?: string }) {
  return (
    <div className={cn('flex justify-between gap-4', strong ? 'font-semibold text-ink' : 'text-ink-muted', className)}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
