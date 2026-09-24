import { ChevronDown } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { BranchTransfer } from '@/components/product/BranchTransfer';
import { FactList, Section, SectionIntro } from '@/components/ui/Section';
import { BRANCHES } from '@/data/demo';

const FACTS = [
  {
    title: 'Stock and documents belong to a branch',
    body: 'Batches, sales, purchases, shifts and expenses are recorded at the branch they happen at, and document numbers carry its code.',
  },
  {
    title: 'Access is checked on the server',
    body: 'A Karachi cashier cannot read, receive into or adjust Lahore stock. Changing a branch in a request cannot widen what someone can see.',
  },
  {
    title: 'Transfers keep the batch identity',
    body: 'Stock arrives with the same batch number, expiry and frozen cost it left with. Shortfalls are recorded on the line with a reason.',
  },
  {
    title: 'Customers are shared',
    body: 'A customer and their balance are the same record at every branch, while each sale still belongs to the branch that made it.',
  },
];

export function BranchesSection() {
  return (
    <Section id="branches" tone="white" labelledBy="branches-title" className="py-28 sm:py-36">
      <SectionIntro
        chapter="08"
        label="Branches"
        titleId="branches-title"
        title="Each branch keeps its own shelf. The business stays one."
        lede="Run retail outlets and a warehouse side by side. Move stock between them in two confirmed steps, and give each person the role they hold at each location."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <BranchTransfer />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 sm:p-6">
            <p className="text-[15px] font-semibold text-ink">Roles are per branch, not per person</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
              One staff member can be a Cashier in Lahore and a Manager in Karachi. What they can do is decided by the
              branch they are working in right now.
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-border bg-white">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-[12px] font-medium text-text-muted">Active branch</span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[12.5px] font-medium text-ink">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden />
                  {BRANCHES[0].name}
                  <ChevronDown className="size-3 text-text-subtle" aria-hidden />
                </span>
              </div>
              <table className="w-full text-left text-[13px]">
                <caption className="sr-only">Example: one staff member&apos;s role at each branch</caption>
                <thead className="text-[10.5px] tracking-wide text-text-muted uppercase">
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 font-medium">Branch</th>
                    <th className="hidden px-4 py-2 font-medium sm:table-cell">Type</th>
                    <th className="px-4 py-2 font-medium">Role held</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANCHES.map((branch, index) => (
                    <tr key={branch.code} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="mr-2 font-mono text-[11px] font-semibold text-primary">{branch.code}</span>
                        <span className="text-ink">{branch.name}</span>
                      </td>
                      <td className="hidden px-4 py-2.5 text-ink-muted sm:table-cell">{branch.type}</td>
                      <td className="px-4 py-2.5 font-medium text-ink">
                        {index === 0 ? 'Cashier' : index === 1 ? 'Manager' : <span className="text-text-subtle">No access</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-20">
        <FactList items={FACTS} />
      </div>
    </Section>
  );
}
