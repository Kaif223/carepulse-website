'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Barcode,
  CheckCircle2,
  ChevronDown,
  Minus,
  PauseCircle,
  Plus,
  Printer,
  ShoppingCart,
  Trash2,
  User,
} from 'lucide-react';

import { DEMO_BRANCH, PANADOL, POS_CART, POS_CASH_RECEIVED, POS_DISCOUNT_PERCENT, POS_INVOICE, posTotals } from '@/data/demo';
import { cn } from '@/lib/cn';
import { formatPKR } from '@/lib/format';

import { ReceiptCard } from './ReceiptCard';

/** Base-unit stock of Panadol at LHR across sellable batches (see PANADOL_BATCHES). */
const PANADOL_STOCK = 920;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The application's POS page (apps/web/src/features/pos) recreated as a pure
 * function of the walkthrough step. Labels, field order and copy match the
 * real screen: "Scan a barcode or search by name / code…", "Amount tendered
 * now", "Complete Sale — PKR …".
 */
export function PosScreen({ step }: { step: number }) {
  const totals = posTotals();
  const hasCart = step >= 2;
  const hasDiscount = step >= 4;
  const paid = step >= 5;
  const subtotal = hasCart ? totals.subtotal : 0;
  const discount = hasDiscount ? totals.discount : 0;
  const grandTotal = subtotal - discount;

  return (
    <div className="relative flex h-full flex-col bg-background text-[12.5px] text-text">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-surface px-3.5">
        <span className="flex items-center gap-1.5 text-text-muted">
          <ArrowLeft className="size-3.5" aria-hidden /> Exit POS
        </span>
        <span className="hidden font-semibold sm:inline">Point of Sale · {DEMO_BRANCH.name}</span>
        <span className="flex items-center gap-2.5 text-text-muted">
          <PauseCircle className="size-3.5" aria-hidden />
          <User className="size-3.5 opacity-50" aria-hidden />
        </span>
      </div>

      <div className="grid grid-cols-1 min-h-0 flex-1 md:grid-cols-[1fr_300px]">
        {/* Product search */}
        <section className={cn('min-w-0 border-border p-3.5 md:block md:border-r', step >= 2 && 'hidden')}>
          <div
            className={cn(
              'relative flex h-9 items-center rounded-md border bg-surface pl-8 transition-[border-color,box-shadow] duration-300',
              step <= 1 ? 'border-primary ring-3 ring-primary/15' : 'border-border',
            )}
          >
            <Barcode className="absolute left-2.5 size-3.5 text-text-subtle" aria-hidden />
            {step <= 1 ? (
              <span>
                panadol
                {step === 0 && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-ink" />}
              </span>
            ) : (
              <span className="text-text-subtle">Scan a barcode or search by name / code…</span>
            )}
          </div>

          <div className="mt-3 overflow-hidden rounded-md border border-border bg-surface">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span>
                <span className="font-medium">{PANADOL.name}</span>
                <span className="ml-2 text-[11px] text-text-muted">{PANADOL.code}</span>
              </span>
              <span className="text-text-muted tabular-nums">{formatPKR(3.5)}</span>
            </div>
            <AnimatePresence initial={false}>
              {step === 1 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="space-y-0.5 px-3 py-2">
                    {PANADOL.units.map((unit) => (
                      <div
                        key={unit.name}
                        className={cn(
                          'flex items-center justify-between rounded-md px-1.5 py-1',
                          unit.name === 'Strip' && 'bg-primary-soft',
                        )}
                      >
                        <div>
                          <p>
                            {unit.name}
                            {unit.isSaleDefault && <span className="ml-1.5 text-[11px] text-text-subtle">(default)</span>}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {formatPKR(unit.sellingPrice)} · {(PANADOL_STOCK / unit.conversionFactor).toFixed(1)} available
                          </p>
                        </div>
                        <span
                          className={cn(
                            'flex size-6 items-center justify-center rounded-md bg-primary text-white',
                            unit.name === 'Strip' && 'ring-3 ring-primary/25',
                          )}
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 rounded-md border border-border bg-surface px-3 py-2.5 opacity-60">
            <span className="font-medium">Brufen 400mg Tablet</span>
            <span className="ml-2 text-[11px] text-text-muted">MED-BRU-400T</span>
          </div>
        </section>

        {/* Cart */}
        <aside className={cn('flex min-w-0 flex-col p-3.5', step < 2 && 'hidden md:flex')}>
          <p className="flex items-center gap-1.5 font-medium">
            <ShoppingCart className="size-3.5" aria-hidden /> Cart
          </p>
          <div className="mt-2 min-h-[112px]">
            {hasCart ? (
              <table className="w-full text-[11.5px]">
                <thead className="text-left text-[10px] tracking-wide text-text-muted uppercase">
                  <tr>
                    <th className="pb-1 font-medium">Product</th>
                    <th className="pb-1 font-medium">Qty</th>
                    <th className="pb-1 text-right font-medium">Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {POS_CART.map((line, index) => (
                    <motion.tr
                      key={line.product}
                      initial={step === 2 ? { opacity: 0, x: 8 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: step === 2 ? index * 0.08 : 0 }}
                      className="border-t border-border"
                    >
                      <td className="py-1.5 pr-1">
                        <p className="leading-tight font-medium">{line.product}</p>
                        <p className="text-[10.5px] text-text-muted">{line.unit}</p>
                      </td>
                      <td className="py-1.5">
                        <span className="flex items-center gap-0.5">
                          <Minus className="size-2.5 text-text-muted" aria-hidden />
                          <span className="inline-flex h-5 w-7 items-center justify-center rounded-sm border border-border tabular-nums">
                            {line.quantity}
                          </span>
                          <Plus className="size-2.5 text-text-muted" aria-hidden />
                        </span>
                      </td>
                      <td className="py-1.5 text-right whitespace-nowrap tabular-nums">
                        {formatPKR(line.quantity * line.price)}
                      </td>
                      <td className="py-1.5 pl-1.5">
                        <Trash2 className="size-3 text-danger" aria-hidden />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-[112px] flex-col items-center justify-center rounded-md border border-dashed border-border text-center">
                <p className="font-medium">Cart is empty</p>
                <p className="text-[11px] text-text-muted">Search or scan a product to add it to the sale.</p>
              </div>
            )}
          </div>

          <div className="mt-2 space-y-2 border-t border-border pt-2.5">
            <div className="flex items-center gap-2">
              <Field active={step === 4} className="w-[128px] whitespace-nowrap">
                {hasDiscount ? 'Percent off' : 'No discount'}
                <ChevronDown className="size-3 text-text-subtle" aria-hidden />
              </Field>
              {hasDiscount && (
                <Field active={step === 4} className="w-14 justify-center tabular-nums">
                  {POS_DISCOUNT_PERCENT}
                </Field>
              )}
              {step === 4 && <span className="text-[10.5px] text-success">Within branch limit</span>}
            </div>
            <dl className="space-y-0.5 text-[11.5px]">
              <SummaryRow label="Subtotal (est.)" value={formatPKR(subtotal)} />
              {hasDiscount && <SummaryRow label="Discount (est.)" value={`- ${formatPKR(discount)}`} />}
              <SummaryRow label="Tax (est.)" value={formatPKR(0)} />
              <SummaryRow label="Grand total (est.)" value={formatPKR(grandTotal)} strong />
            </dl>
          </div>

          <div className="mt-2.5">
            <p className="mb-1 text-[11px] font-medium">Customer</p>
            <div className="relative">
              <Field active={step === 3}>
                <span className={step === 3 ? 'text-text-subtle' : 'text-text-muted'}>Walk-in customer</span>
              </Field>
              <AnimatePresence>
                {step === 3 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute inset-x-0 top-full z-10 mt-1 rounded-md border border-border bg-surface p-1 shadow-cp-md"
                  >
                    <li className="rounded-sm px-2 py-1.5">
                      <p className="font-medium">Fatima Khan</p>
                      <p className="text-[10.5px] text-text-muted">+92-300-0000102</p>
                    </li>
                    <li className="rounded-sm px-2 py-1.5">
                      <p className="font-medium">Ahmed Raza</p>
                      <p className="text-[10.5px] text-text-muted">+92-300-0000101</p>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[11px] font-medium">Payment method</p>
              <Field active={step === 5}>
                Cash <ChevronDown className="size-3 text-text-subtle" aria-hidden />
              </Field>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-medium">Amount tendered now</p>
              <Field active={step === 5} className="tabular-nums">
                {hasCart ? (paid ? grandTotal.toFixed(2) : subtotal.toFixed(2)) : ''}
              </Field>
            </div>
          </div>
          {paid && (
            <div className="mt-2">
              <p className="mb-1 text-[11px] font-medium">Cash received</p>
              <Field active={step === 5} className="tabular-nums">
                {POS_CASH_RECEIVED.toFixed(2)}
              </Field>
              <p className="mt-1 text-[11.5px]">Change: {formatPKR(totals.change)}</p>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <span className="flex h-8 flex-1 items-center justify-center rounded-md border border-border bg-surface font-medium">
              Hold sale
            </span>
            <span
              className={cn(
                'flex h-8 flex-[1.6] items-center justify-center rounded-md bg-primary px-2 font-medium whitespace-nowrap text-white transition-opacity',
                !hasCart && 'opacity-50',
                step === 5 && 'ring-3 ring-primary/25',
              )}
            >
              Complete Sale — {formatPKR(grandTotal)}
            </span>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-ink/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-full max-w-[300px] rounded-lg bg-surface p-4 shadow-cp-md"
            >
              <p className="flex items-center gap-1.5 text-[14px] font-semibold">
                <CheckCircle2 className="size-4 text-success" aria-hidden /> Sale completed
              </p>
              <p className="text-[11px] text-text-muted">
                Invoice {POS_INVOICE} · {formatPKR(totals.grandTotal)}
              </p>
              <div className="mt-3 max-h-[220px] overflow-hidden rounded-md border border-border">
                <ReceiptCard compact className="rounded-none shadow-none ring-0" />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <span className="flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 font-medium">
                  <Printer className="size-3" aria-hidden /> Print receipt
                </span>
                <span className="flex h-7 items-center rounded-md bg-primary px-2.5 font-medium text-white">New sale</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ children, active, className }: { children: React.ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'flex h-8 items-center justify-between gap-1 rounded-md border bg-surface px-2.5 transition-[border-color,box-shadow] duration-300',
        active ? 'border-primary ring-3 ring-primary/15' : 'border-border',
        className,
      )}
    >
      {children}
    </span>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn('flex justify-between', strong ? 'text-[13px] font-semibold text-text' : 'text-text-muted')}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
