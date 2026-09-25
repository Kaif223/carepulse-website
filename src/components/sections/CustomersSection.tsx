import { Reveal } from '@/components/motion/Reveal';
import { CustomerLedger } from '@/components/product/CustomerLedger';
import { Section, SectionIntro } from '@/components/ui/Section';

const POINTS = [
  {
    title: 'Only the unpaid part is owed',
    body: 'A PKR 1,000 sale paid PKR 400 posts a PKR 600 debit. A sale paid in full leaves the ledger untouched, so the statement reads as what is actually owed.',
  },
  {
    title: 'Credit limits checked at the till',
    body: 'The remainder is checked against the customer’s available credit before the sale completes. Walk-in sales must be paid in full — there is nobody to chase.',
  },
  {
    title: 'Returns settle the account first',
    body: 'A return reduces what the customer owes before any cash is handed back, priced from the original line after its discount.',
  },
  {
    title: 'One customer, every branch',
    body: 'Customers are shared across the business, so udhaar taken in Lahore is visible when the same customer pays in Karachi.',
  },
];

export function CustomersSection() {
  return (
    <Section id="customers" labelledBy="customers-title" className="py-28 sm:py-36">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionIntro
            chapter="05"
            label="Customers & credit"
            titleId="customers-title"
            title="Credit that follows the customer, not the notebook."
            lede="Sale, credit, return and payment land on one customer record, in order, with a running balance you can explain line by line."
          />
          <dl className="mt-12 space-y-7">
            {POINTS.map((point) => (
              <div key={point.title} className="border-l-2 border-credit/30 pl-5">
                <dt className="text-[15.5px] font-semibold tracking-[-0.01em] text-ink">{point.title}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <CustomerLedger />
        </Reveal>
      </div>
    </Section>
  );
}
