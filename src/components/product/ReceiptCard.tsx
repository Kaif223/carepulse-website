import { DEMO_BRANCH, POS_CART, POS_INVOICE, posTotals } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

/** Mirrors the application's ReceiptView: the same fields, in the same order. */
export function ReceiptCard({ className, compact = false }: { className?: string; compact?: boolean }) {
  const totals = posTotals();
  return (
    <div
      className={cn(
        'rounded-lg bg-white p-4 font-mono text-[10.5px] leading-[1.55] text-black shadow-float ring-1 ring-black/5',
        className,
      )}
    >
      <div className="text-center">
        <p className="font-sans text-[12px] font-semibold">CarePulse</p>
        <p>{DEMO_BRANCH.name}</p>
      </div>
      <div className="mt-2 border-t border-dashed border-black/25 pt-2">
        <p>Invoice: {POS_INVOICE}</p>
        {!compact && <p>Date: 01/10/2026, 11:42 AM</p>}
        <p>Customer: Walk-in</p>
      </div>
      <table className="mt-2 w-full border-t border-dashed border-black/25">
        <tbody>
          {POS_CART.map((line) => (
            <tr key={line.product}>
              <td className="truncate pt-1 pr-2">{compact ? line.product.split(' ')[0] : line.product}</td>
              <td className="pt-1 text-right whitespace-nowrap tabular-nums">
                {line.quantity} {line.unit}
              </td>
              <td className="pt-1 pl-2 text-right whitespace-nowrap tabular-nums">
                {formatPKR(line.quantity * line.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 space-y-px border-t border-dashed border-black/25 pt-2">
        <Row label="Subtotal" value={formatPKR(totals.subtotal)} />
        <Row label="Discount" value={`- ${formatPKR(totals.discount)}`} />
        <Row label="Tax" value={formatPKR(totals.tax)} />
        <Row label="Grand total" value={formatPKR(totals.grandTotal)} strong />
      </div>
      <div className="mt-2 space-y-px border-t border-dashed border-black/25 pt-2">
        <Row label="CASH" value={formatPKR(totals.grandTotal)} />
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn('flex justify-between gap-3', strong && 'font-semibold')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
