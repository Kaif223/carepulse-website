import { Truck } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { ScrollRail } from '@/components/motion/ScrollRail';
import { Badge } from '@/components/ui/Badge';
import { FactList, Section, SectionIntro } from '@/components/ui/Section';
import { PURCHASE_NUMBER, SUPPLIER } from '@/data/demo';
import { formatPKR } from '@/lib/format';

const LINES = [
  { product: 'Panadol 500mg Tablet', qty: '50 Box', batch: 'PAN-2403', expiry: '31 Mar 2028', base: '+5,000 Tab', cost: 285, units: 50 },
  { product: 'ORS Orange Sachet', qty: '10 Box', batch: 'ORS-2402', expiry: '30 Nov 2028', base: '+240 Sch', cost: 456, units: 10 },
];
const TOTAL = LINES.reduce((sum, line) => sum + line.cost * line.units, 0);

const EFFECTS = [
  { title: 'Document number allocated', detail: PURCHASE_NUMBER, note: 'Branch-scoped and sequential.' },
  { title: 'Purchase and lines recorded', detail: 'Status RECEIVED', note: 'The purchase is the goods receipt — stock lands now.' },
  { title: 'Batch found or created per line', detail: 'PAN-2403 · ORS-2402', note: 'Batch number, expiry and a frozen cost per base unit.' },
  { title: 'PURCHASE stock movement posted', detail: '+5,000 Tab · +240 Sch', note: 'Converted from boxes into base units.' },
  { title: 'Supplier ledger debited', detail: `${SUPPLIER.name} · ${formatPKR(TOTAL)}`, note: 'The payable moves only through its ledger.' },
];

const FACTS = [
  {
    title: 'Purchase returns traced to the receipt',
    body: 'Each returned line names the purchase line it came in on. Returns are raised, approved and completed — only completion moves stock and credits the supplier.',
  },
  {
    title: 'Duplicate supplier invoices are refused',
    body: 'A supplier’s invoice number can only be booked once — at any branch — so one delivery never lands as two.',
  },
  {
    title: 'Supplier payments settle the ledger',
    body: 'Paying a supplier credits their ledger and records the cash or bank transaction. A void reverses it; nothing is deleted.',
  },
  {
    title: 'Cancellations reverse cleanly',
    body: 'Cancelling a purchase posts reversing stock movements and a ledger credit rather than erasing what happened.',
  },
];

export function PurchasingSection() {
  return (
    <Section id="purchasing" tone="white" labelledBy="purchasing-title" className="py-28 sm:py-36">
      <SectionIntro
        chapter="04"
        label="Purchasing"
        titleId="purchasing-title"
        title="Receive the delivery. Everything else follows."
        lede="One purchase entry lands the stock, creates the batches and records what you owe the supplier — as a single transaction. If any part fails, none of it happens."
      />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-cp-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Truck className="size-4.5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[13px] font-medium text-ink">{PURCHASE_NUMBER}</p>
                  <p className="text-[12.5px] text-text-muted">
                    {SUPPLIER.name} · Supplier invoice SD-88412
                  </p>
                </div>
              </div>
              <Badge tone="success">RECEIVED</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[12.5px]">
                <thead className="text-[10.5px] tracking-wide text-text-muted uppercase">
                  <tr className="border-b border-border">
                    <th className="px-5 py-2.5 font-medium">Product</th>
                    <th className="px-3 py-2.5 font-medium">Qty</th>
                    <th className="px-3 py-2.5 font-medium">Batch · Expiry</th>
                    <th className="px-5 py-2.5 text-right font-medium">Line total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {LINES.map((line) => (
                    <tr key={line.batch} className="border-b border-border">
                      <td className="px-5 py-3 font-medium text-ink">{line.product}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {line.qty}
                        <span className="block text-[11px] text-text-subtle">{line.base}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-mono text-[11.5px]">{line.batch}</span>
                        <span className="block text-[11px] text-text-muted">{line.expiry}</span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatPKR(line.cost * line.units)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="space-y-1 px-5 py-4 text-[13px]">
              <div className="flex justify-between text-text-muted">
                <dt>Tax</dt>
                <dd className="tabular-nums">{formatPKR(0)}</dd>
              </div>
              <div className="flex justify-between text-[14px] font-semibold text-ink">
                <dt>Grand total</dt>
                <dd className="tabular-nums">{formatPKR(TOTAL)}</dd>
              </div>
            </dl>
            <div className="border-t border-border bg-white px-5 py-3.5">
              <p className="font-mono text-[10.5px] tracking-wide text-text-muted uppercase">Supplier ledger</p>
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                <span>
                  <span className="font-mono text-[11px] text-danger">DEBIT</span>
                  <span className="ml-2 text-ink">{PURCHASE_NUMBER}</span>
                </span>
                <span className="font-medium text-credit tabular-nums">+{formatPKR(TOTAL)}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[12px] text-text-subtle">Sample purchase. Seeded, fictional supplier.</p>
        </Reveal>

        <div>
          <p className="mb-7 font-mono text-[12px] font-medium tracking-[0.14em] text-text-muted uppercase">
            One transaction · five effects
          </p>
          <ScrollRail
            steps={EFFECTS.map((effect) => (
              <div key={effect.title}>
                <p className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{effect.title}</p>
                <p className="mt-1 font-mono text-[12.5px] text-primary">{effect.detail}</p>
                <p className="mt-1 text-[14.5px] text-ink-muted">{effect.note}</p>
              </div>
            ))}
          />
        </div>
      </div>

      <div className="mt-20">
        <FactList items={FACTS} />
      </div>
    </Section>
  );
}
