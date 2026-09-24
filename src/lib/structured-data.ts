import { FAQ } from '@/data/faq';
import { site } from '@/data/site';

/**
 * schema.org descriptions of the page. Deliberately no `offers`,
 * `aggregateRating` or `review`: CarePulse publishes no pricing and has no
 * reviews to cite, and structured data must never claim what the page can't.
 */
export function structuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: site.name,
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: site.category,
      operatingSystem: 'Web browser',
      description: site.description,
      url: site.url,
      featureList: [
        'Point of sale with barcode search and packaging-level pricing',
        'Batch and expiry tracking with FEFO allocation',
        'Purchases, purchase returns and supplier ledgers',
        'Customer credit ledgers and payments',
        'Cash shifts, expenses and financial transactions',
        'Cash Summary and Expense Breakdown reports',
        'Multi-branch stock transfers and per-branch roles',
        'Append-only audit log',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];
}
