import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';

/**
 * The application's modules and the tabs inside each, exactly as its router
 * and page components define them. Administration is left out on purpose:
 * user, role and branch management have no screens yet.
 */
const MODULES: Array<{ name: string; icon: LucideIcon; summary: string; tabs: string[] }> = [
  { name: 'Dashboard', icon: LayoutDashboard, summary: 'Today’s sales, your open drawer, low stock, expiring batches and balances owed.', tabs: ['KPIs', 'Recent sales', 'Needs attention', 'Quick actions'] },
  { name: 'POS', icon: ShoppingCart, summary: 'A full-screen counter with barcode search, packaging, held sales and printable receipts.', tabs: ['Cart', 'Held sales', 'Receipt'] },
  { name: 'Inventory', icon: Boxes, summary: 'Batches by expiry, the movement ledger, approved adjustments and branch transfers.', tabs: ['Overview', 'Stock', 'Movements', 'Adjustments', 'Transfers'] },
  { name: 'Purchasing', icon: Truck, summary: 'Goods receipts that create batches and supplier payables, and returns traced to them.', tabs: ['Purchases', 'Purchase Returns'] },
  { name: 'Sales', icon: Receipt, summary: 'Every invoice with its lines, tax and payments, and returns with approval.', tabs: ['Sales', 'Returns'] },
  { name: 'Customers', icon: Users, summary: 'Customer records, credit limits, ledgers, payments and sales history.', tabs: ['Sales', 'Ledger', 'Payments'] },
  { name: 'Suppliers', icon: Store, summary: 'Distributor records with their ledger and payments.', tabs: ['Ledger', 'Payments'] },
  { name: 'Finance', icon: Wallet, summary: 'Cash shifts with reconciliation, expenses by category and the transaction ledger.', tabs: ['Cash Shifts', 'Expenses', 'Transactions'] },
  { name: 'Reports', icon: BarChart3, summary: 'Cash summary, expense breakdown and sign-in activity, by date range, printable.', tabs: ['Cash Summary', 'Expense Breakdown', 'Activity'] },
  { name: 'Settings', icon: Settings, summary: 'Product categories, units of measure and your profile.', tabs: ['Categories', 'Units', 'Profile'] },
];

export function ModulesSection() {
  return (
    <Section id="modules" tone="white" labelledBy="modules-title" className="py-28 sm:py-36">
      <SectionIntro
        label="What’s inside"
        titleId="modules-title"
        title="Every module, one sidebar."
        lede="These are the screens in CarePulse today — each one reads and writes the same records you have seen above."
      />
      <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module, index) => {
          const Icon = module.icon;
          return (
            <Reveal as="li" key={module.name} delay={(index % 3) * 0.05} className="bg-white">
              <div className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-background">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <h3 className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink">{module.name}</h3>
                </div>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-muted">{module.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={`${module.name} sections`}>
                  {module.tabs.map((tab) => (
                    <li key={tab} className="rounded-md bg-surface-muted px-2 py-1 font-mono text-[11px] text-ink-muted">
                      {tab}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
        <li className="flex flex-col justify-center bg-background p-6 sm:col-span-2 lg:col-span-2">
          <p className="text-[15px] font-semibold text-ink">Printing, built in</p>
          <p className="mt-1.5 max-w-[34rem] text-[14.5px] leading-relaxed text-ink-muted">
            Receipts print straight from the POS, and the Cash Summary and Expense Breakdown reports print with a
            branch, period and generated-at header — from any browser, without extra software.
          </p>
        </li>
      </ul>
    </Section>
  );
}
