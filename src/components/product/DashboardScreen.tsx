import { AlertTriangle, Banknote, Boxes, Clock, PackageX, Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { DEMO_BRANCH, POS_INVOICE, posTotals } from '@/data/demo';
import { formatPKR } from '@/lib/format';

import { AppShell, Kpi, MockCard, PageHeading } from './AppShell';

const RECENT_SALES = [
  { invoice: POS_INVOICE, customer: 'Walk-in', status: 'COMPLETED', amount: posTotals().grandTotal, fresh: true },
  { invoice: 'LHR-2026-000481', customer: 'Fatima Khan', status: 'COMPLETED', amount: 1000 },
  { invoice: 'LHR-2026-000480', customer: 'Walk-in', status: 'HELD', amount: 740 },
  { invoice: 'LHR-2026-000479', customer: 'Al-Noor Family Clinic', status: 'COMPLETED', amount: 12480 },
] as const;

/** The application's Dashboard, recreated with sample data (see data/demo.ts). */
export function DashboardScreen() {
  return (
    <AppShell active="Dashboard">
      <PageHeading title="Dashboard" description={`${DEMO_BRANCH.name} · 1 October 2026`} />
      {/* One column only on the narrowest phones (<360px), where two money figures cannot sit side by side. */}
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Receipt} label="Today's sales" value={formatPKR(48320)} caption="126 sales" />
        <Kpi
          icon={Banknote}
          label="Current cash shift"
          value={formatPKR(29860)}
          caption="Expected drawer total, opened 9:02 AM"
          badge={
            <Badge tone="info" className="hero-status">
              OPEN
            </Badge>
          }
        />
        <Kpi icon={Boxes} label="Low stock" value="7" caption="products at or below reorder level" />
        <Kpi icon={Clock} label="Expiring soon" value="4" caption="batches within 30 days" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <MockCard title="Recent sales" icon={Receipt} bodyClassName="p-0">
          {/* Phones show invoice and amount only; customer and status join from sm. */}
          <table className="w-full text-left text-[11.5px]">
            <thead className="text-[10px] tracking-wide text-text-muted uppercase">
              <tr className="border-b border-border">
                <th className="px-3.5 py-2 font-medium">Invoice</th>
                <th className="hidden px-3.5 py-2 font-medium sm:table-cell">Customer</th>
                <th className="hidden px-3.5 py-2 font-medium sm:table-cell">Status</th>
                <th className="px-3.5 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((sale) => (
                <tr
                  key={sale.invoice}
                  className={'fresh' in sale ? 'hero-fresh-row border-b border-border' : 'border-b border-border last:border-0'}
                >
                  <td className="px-3.5 py-2 font-medium whitespace-nowrap">{sale.invoice}</td>
                  <td className="hidden max-w-[9rem] truncate px-3.5 py-2 sm:table-cell">{sale.customer}</td>
                  <td className="hidden px-3.5 py-2 sm:table-cell">
                    <Badge tone={sale.status === 'HELD' ? 'warning' : 'success'}>{sale.status}</Badge>
                  </td>
                  <td className="px-3.5 py-2 text-right whitespace-nowrap tabular-nums">{formatPKR(sale.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MockCard>

        <MockCard title="Needs attention" icon={AlertTriangle} className="hidden sm:block">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-text-muted uppercase">
            <PackageX className="size-3" aria-hidden /> Low stock
          </p>
          <ul className="mb-3.5 space-y-1 text-[11.5px]">
            <AttentionRow label="Augmentin 625mg Tablet" value="240 / 300" />
            <AttentionRow label="Concor 5mg Tablet" value="90 / 200" />
          </ul>
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-text-muted uppercase">
            <Clock className="size-3" aria-hidden /> Expiring soon
          </p>
          <ul className="space-y-1 text-[11.5px]">
            <AttentionRow label="Calpol Syrup 120ml · CAL-2401" value="21d" />
            <AttentionRow label="Brufen 400mg Tablet · BRU-2401" value="27d" />
          </ul>
        </MockCard>
      </div>
    </AppShell>
  );
}

function AttentionRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="truncate">{label}</span>
      <span className="shrink-0 text-text-muted tabular-nums">{value}</span>
    </li>
  );
}
