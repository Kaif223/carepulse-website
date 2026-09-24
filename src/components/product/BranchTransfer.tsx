'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { motion, useInView } from 'motion/react';
import { RotateCcw, Store, Truck, Warehouse } from 'lucide-react';

import { usePrefersReducedMotion } from '@/components/motion/useMediaQuery';
import { Badge, type Tone } from '@/components/ui/Badge';
import { TRANSFER_NUMBER } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatQty } from '@/lib/format';

const QTY = 2000;
const PHASES = [
  { status: 'DRAFT', tone: 'neutral', caption: 'Created at the warehouse. Nothing has moved yet.' },
  { status: 'IN_TRANSIT', tone: 'info', caption: 'Dispatched by the warehouse. The stock has left CWH and is not yet at KHI.' },
  { status: 'RECEIVED', tone: 'success', caption: 'Confirmed by Karachi. Same batch number, same expiry, same cost.' },
] as const satisfies ReadonlyArray<{ status: string; tone: Tone; caption: string }>;

/**
 * A branch-to-branch transfer in its three real states. Stock leaves the
 * source on dispatch and arrives only when the destination confirms receipt;
 * in between it belongs to neither branch, exactly as the product models it.
 */
export function BranchTransfer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });
  const reduce = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);
  const current = reduce ? 2 : phase;

  useEffect(() => {
    if (!inView || reduce) return;
    const a = window.setTimeout(() => setPhase(1), 1200);
    const b = window.setTimeout(() => setPhase(2), 3200);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [inView, reduce, run]);

  const replay = useCallback(() => {
    setPhase(0);
    setRun((r) => r + 1);
  }, []);

  const cwh = 20000 - (current >= 1 ? QTY : 0);
  const khi = 3500 + (current >= 2 ? QTY : 0);
  const state = PHASES[current]!;

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-white p-5 shadow-cp-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[13px] font-medium text-ink">{TRANSFER_NUMBER}</p>
          <p className="text-[12.5px] text-text-muted">Panadol 500mg Tablet · PAN-2403 · 20 Box</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={state.tone}>{state.status.replace('_', ' ')}</Badge>
          {!reduce && (
            <button
              type="button"
              onClick={replay}
              disabled={inView && phase < 2}
              className="inline-flex size-8 items-center justify-center rounded-full text-ink-muted ring-1 ring-border transition-colors hover:text-ink disabled:opacity-35"
              aria-label="Replay transfer"
            >
              <RotateCcw className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <BranchTile icon={Warehouse} code="CWH" name="Central Warehouse" type="Warehouse" qty={cwh} highlight={current === 1} />
        <div className="relative flex w-16 items-center sm:w-28">
          <div className="h-px w-full bg-[repeating-linear-gradient(90deg,#cbd5e1_0_6px,transparent_6px_12px)]" />
          <motion.span
            className="absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-cp-md"
            initial={false}
            animate={{ left: current === 0 ? '0%' : current === 1 ? '50%' : '100%', x: '-50%', opacity: current === 1 ? 1 : 0.35 }}
            transition={{ duration: reduce ? 0 : 1.4, ease: [0.65, 0, 0.35, 1] }}
          >
            <Truck className="size-4" aria-hidden />
          </motion.span>
        </div>
        <BranchTile icon={Store} code="KHI" name="Karachi Clifton" type="Retail" qty={khi} highlight={current === 2} />
      </div>

      <div className="mt-6 flex gap-1.5" aria-hidden>
        {PHASES.map((p, index) => (
          <span key={p.status} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', index <= current ? 'bg-primary' : 'bg-border')} />
        ))}
      </div>
      <p className="mt-3 min-h-[40px] text-[13.5px] leading-snug text-ink-muted" aria-live="polite">
        {current === 1 && <span className="font-medium text-ink">{formatQty(QTY)} Tab in transit · </span>}
        {state.caption}
      </p>
    </div>
  );
}

function BranchTile({
  icon: Icon,
  code,
  name,
  type,
  qty,
  highlight,
}: {
  icon: typeof Store;
  code: string;
  name: string;
  type: string;
  qty: number;
  highlight: boolean;
}) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border p-3.5 transition-[border-color,background-color] duration-500',
        highlight ? 'border-primary/40 bg-primary-soft/60' : 'border-border bg-background',
      )}
    >
      <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary">
        <Icon className="size-3.5" aria-hidden /> {code}
      </p>
      <p className="mt-1 truncate text-[13px] font-medium text-ink">{name}</p>
      <p className="text-[11px] text-text-muted">{type}</p>
      <p className="mt-3 text-[18px] font-semibold tracking-[-0.01em] text-ink tabular-nums">
        {formatQty(qty)}
        <span className="ml-1 text-[11px] font-normal text-text-muted">Tab</span>
      </p>
    </div>
  );
}
