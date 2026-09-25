export interface NavLink {
  label: string;
  href: string;
}

/** In-page chapters. Every href is an id rendered on the landing page. */
export const primaryNav: NavLink[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Point of Sale', href: '#pos' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Finance', href: '#finance' },
  { label: 'Branches', href: '#branches' },
  { label: 'FAQ', href: '#faq' },
];
