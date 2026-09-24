import { ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { ReportsScreen } from '@/components/product/ReportsScreen';
import { Section, SectionIntro } from '@/components/ui/Section';

/** Where each figure on the real reports comes from — no report here that the product doesn't have. */
const FLOWS = [
  { from: 'Completed sales and their tenders', to: 'Sales · by tender' },
  { from: 'The frozen cost of every batch sold', to: 'Gross profit' },
  { from: 'Cash in and out of every drawer', to: 'Cash drawer net' },
  { from: 'Customer and supplier payments', to: 'Collections & payouts' },
  { from: 'Shift closes and their variances', to: 'Cash shifts' },
  { from: 'Expenses, by category', to: 'Expense Breakdown' },
  { from: 'Sign-ins and sign-outs', to: 'Activity' },
];

export function ReportsSection() {
  return (
    <Section id="reports" labelledBy="reports-title" className="py-28 sm:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <SectionIntro
          chapter="07"
          label="Reports"
          titleId="reports-title"
          title="The day, already added up."
          lede="Reports are calculated from the same records the counter writes, for any date range at your active branch — and print with a branch and period header."
        />
        <ul className="divide-y divide-border self-end border-y border-border">
          {FLOWS.map((flow) => (
            <li key={flow.to} className="flex items-center gap-3 py-2.5 text-[14px]">
              <span className="min-w-0 flex-1 text-ink-muted">{flow.from}</span>
              <ArrowRight className="size-3.5 shrink-0 text-primary" aria-hidden />
              <span className="w-[40%] shrink-0 font-medium text-ink">{flow.to}</span>
            </li>
          ))}
        </ul>
      </div>
      <Reveal className="mt-14">
        <ReportsScreen />
        <p className="mt-4 text-[12px] text-text-subtle">Sample figures. The tabs are interactive.</p>
      </Reveal>
    </Section>
  );
}
