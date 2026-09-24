import { Reveal } from '@/components/motion/Reveal';
import { FefoDemo } from '@/components/product/FefoDemo';
import { FactList, Section, SectionIntro } from '@/components/ui/Section';

const INVENTORY_FACTS = [
  {
    title: 'A movement ledger behind every number',
    body: 'Purchases, sales, returns, transfers and adjustments each post a stock movement with the balance after it. The on-hand figure always equals the sum of its history.',
  },
  {
    title: 'Adjustments are approved, then posted',
    body: 'Damage, expiry write-offs, theft, recalls and count corrections are raised, approved and only then move stock — all lines together, or none.',
  },
  {
    title: 'Quarantine without deleting',
    body: 'A recalled or held lot stays on record but is excluded from sale until it is dealt with through an adjustment or return.',
  },
  {
    title: 'Low-stock and expiry alerts',
    body: 'The dashboard lists products at or below their reorder level and batches expiring within 30 days, for the branch you are working in.',
  },
];

export function InventorySection() {
  return (
    <Section id="inventory" labelledBy="inventory-title" className="py-28 sm:py-36">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
        <SectionIntro
          chapter="03"
          label="Inventory · FEFO"
          titleId="inventory-title"
          title="The earliest expiry leaves the shelf first."
        />
        <p className="text-[17px] leading-[1.7] text-pretty text-ink-muted sm:text-[18px]">
          Every sale is allocated First-Expired, First-Out across the live batches at your branch — inside the same
          transaction that completes it. One receipt line can draw from two lots, and each keeps its own cost, so
          margins stay true. Try it below.
        </p>
      </div>

      <Reveal className="mt-14">
        <FefoDemo />
      </Reveal>

      <div className="mt-20">
        <FactList items={INVENTORY_FACTS} />
      </div>
    </Section>
  );
}
