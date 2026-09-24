import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { site } from '@/data/site';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#system' },
      { label: 'Point of Sale', href: '#pos' },
      { label: 'Inventory & FEFO', href: '#inventory' },
      { label: 'Purchasing', href: '#purchasing' },
      { label: 'Customers & credit', href: '#customers' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { label: 'Finance & cash shifts', href: '#finance' },
      { label: 'Reports', href: '#reports' },
      { label: 'Branches', href: '#branches' },
      { label: 'Control & audit', href: '#security' },
    ],
  },
  {
    title: 'CarePulse',
    links: [
      { label: 'Who it’s for', href: '#who-its-for' },
      { label: 'Modules', href: '#modules' },
      { label: 'FAQ', href: '#faq' },
      ...(site.appUrl ? [{ label: 'Sign in', href: site.appUrl }] : []),
      ...(site.contactEmail ? [{ label: 'Contact', href: `mailto:${site.contactEmail}` }] : []),
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[22rem] text-[14.5px] leading-relaxed text-ink-muted">
            Pharmacy and retail management: point of sale, FEFO inventory, purchasing, customer credit, cash shifts and
            reports — across every branch.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-text-muted uppercase">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14.5px] text-ink-muted transition-colors hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>
      <Container>
        <div className="flex flex-col gap-2 border-t border-border py-6 text-[13px] text-text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} CarePulse</p>
          <p>Product screens on this page show sample data.</p>
        </div>
      </Container>
    </footer>
  );
}
