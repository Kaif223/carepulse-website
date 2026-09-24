import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';

/** Each fit statement points at something the product does today. */
const AUDIENCES = [
  {
    name: 'Independent pharmacies',
    lead: 'One counter, one pharmacist, a lot of strips.',
    fits: [
      'Sell by tablet, strip or box from a single product',
      'Prescription-only items require a prescription number on the invoice',
      'FEFO allocation and 30-day expiry alerts',
    ],
  },
  {
    name: 'Medical stores',
    lead: 'Distributors, recalls and regular accounts.',
    fits: [
      'Supplier ledgers for every distributor you buy from',
      'Quarantine a recalled lot without deleting it',
      'Credit limits for regular customers and clinics buying on account',
    ],
  },
  {
    name: 'Growing retail businesses',
    lead: 'Baby care, personal care, cosmetics and FMCG next to the medicines.',
    fits: [
      'Tax extracted from tax-inclusive shelf prices, so MRP is never taxed twice',
      'A barcode per packaging level — the box and its units scan differently',
      'Goods with no expiry sold in the order they were received',
    ],
  },
  {
    name: 'Multi-branch operators',
    lead: 'Outlets and a warehouse, run as one business.',
    fits: [
      'Two-step transfers: dispatched by one branch, received by the other',
      'A different role for the same person at each branch',
      'Branch-scoped stock, shifts and documents; shared customers',
    ],
  },
];

export function AudienceSection() {
  return (
    <Section id="who-its-for" labelledBy="audience-title" className="py-28 sm:py-36">
      <SectionIntro
        label="Who it’s for"
        titleId="audience-title"
        title="Made for stores that sell health and everyday goods."
        lede="CarePulse is designed around pharmacy operations first, and handles the general retail shelf alongside them."
      />
      <div className="mt-14 border-t border-ink/80">
        {AUDIENCES.map((audience, index) => (
          <Reveal key={audience.name} delay={index * 0.04}>
            <article className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-[1fr_1.4fr] md:gap-12 lg:grid-cols-[0.9fr_1fr_1.4fr]">
              <h3 className="font-display text-[24px] leading-tight font-semibold tracking-[-0.025em] text-ink">
                {audience.name}
              </h3>
              <p className="text-[16px] leading-relaxed text-ink-muted md:col-start-2 md:row-start-1 lg:col-start-2">
                {audience.lead}
              </p>
              <ul className="space-y-2 text-[15px] text-ink md:col-start-2 lg:col-start-3 lg:row-start-1">
                {audience.fits.map((fit) => (
                  <li key={fit} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary" />
                    {fit}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
