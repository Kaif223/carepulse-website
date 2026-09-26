import type { ReactNode } from 'react';

import {
  BarChart3,
  Boxes,
  ChevronDown,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { LogoMark } from '@/components/brand/Logo';
import { MoneyFigure } from '@/components/product/MoneyFigure';
import { SampleDataTag } from '@/components/product/SampleDataTag';
import { DEMO_BRANCH } from '@/data/demo';
import { cn } from '@/lib/cn';

/**
 * A recreation of the application's AppShell: the same sidebar groups, module
 * names and icons as apps/web/src/components/layout/nav-config.ts, and the
 * same top bar (branch switcher + user menu, nothing else).
 */
const NAV: Array<{ label: string; items: Array<{ label: string; icon: LucideIcon }> }> = [
  { label: 'Main', items: [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'POS', icon: ShoppingCart }] },
  {
    label: 'Operations',
    items: [
      { label: 'Inventory', icon: Boxes },
      { label: 'Purchasing', icon: Truck },
      { label: 'Sales', icon: Receipt },
      { label: 'Customers', icon: Users },
      { label: 'Suppliers', icon: Store },
    ],
  },
  { label: 'Finance', items: [{ label: 'Finance', icon: Wallet }, { label: 'Reports', icon: BarChart3 }] },
  {
    label: 'Administration',
    items: [
      { label: 'Administration', icon: ShieldCheck },
      { label: 'Settings', icon: Settings },
    ],
  },
];

export type ModuleName =
  | 'Dashboard'
  | 'POS'
  | 'Inventory'
  | 'Purchasing'
  | 'Sales'
  | 'Customers'
  | 'Suppliers'
  | 'Finance'
  | 'Reports';

/** Window chrome around any recreated screen. `aria-hidden` lives on the caller, which supplies a text alternative. */
export function ProductWindow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[14px] bg-white shadow-product ring-1 ring-[rgb(15_23_42/0.08)]',
        className,
      )}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-border bg-surface-muted/70 px-3.5">
        <span className="size-2.5 rounded-full bg-[#e2e8f0]" />
        <span className="size-2.5 rounded-full bg-[#e2e8f0]" />
        <span className="size-2.5 rounded-full bg-[#e2e8f0]" />
        <SampleDataTag className="ml-auto" />
      </div>
      {children}
    </div>
  );
}

export function AppShell({
  active,
  children,
  className,
}: {
  active: ModuleName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex bg-background text-[13px] leading-normal text-text', className)}>
      {/* Tablet widths show the app's collapsed, icon-only sidebar so the screen
          keeps room for its tables; the full sidebar appears from lg. */}
      <aside className="hidden w-[60px] shrink-0 flex-col border-r border-border bg-surface md:flex lg:w-[200px]">
        <div className="flex h-12 items-center justify-center gap-2 border-b border-border px-3.5 lg:justify-start">
          <LogoMark size={22} />
          <span className="hidden text-[13px] font-semibold lg:inline">CarePulse</span>
        </div>
        <nav className="space-y-3.5 px-2.5 py-3.5">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="mb-1 hidden px-2 text-[9.5px] font-semibold tracking-wider text-text-subtle uppercase lg:block">
                {group.label}
              </p>
              <ul className="space-y-px">
                {group.items.map(({ label, icon: Icon }) => (
                  <li
                    key={label}
                    className={cn(
                      'flex h-7 items-center justify-center gap-2.5 rounded-md text-[12px] font-medium lg:justify-start lg:px-2',
                      label === active ? 'bg-primary/10 text-primary' : 'text-text-muted',
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    <span className="hidden lg:inline">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="min-w-0 flex-1 p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex h-12 shrink-0 items-center justify-end gap-2.5 border-b border-border bg-surface px-4">
      <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-[12px] font-medium">
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
        {DEMO_BRANCH.name}
        <ChevronDown className="size-3 text-text-subtle" aria-hidden />
      </span>
      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
        SA
      </span>
    </div>
  );
}

export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[17px] font-semibold tracking-[-0.01em]">{title}</p>
      {description && <p className="text-[12px] text-text-muted">{description}</p>}
    </div>
  );
}

export function MockCard({
  title,
  icon: Icon,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface shadow-cp-sm', className)}>
      {title && (
        <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5 text-[12.5px] font-semibold">
          {Icon && <Icon className="size-3.5 text-text-muted" aria-hidden />}
          {title}
        </div>
      )}
      <div className={cn('p-3.5', bodyClassName)}>{children}</div>
    </div>
  );
}

export function Kpi({
  icon: Icon,
  label,
  value,
  caption,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  badge?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3.5 shadow-cp-sm">
      <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-text-muted uppercase">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-[15px] font-semibold tracking-[-0.01em] whitespace-nowrap tabular-nums sm:text-[18px]">
          <MoneyFigure value={value} />
        </p>
        {badge}
      </div>
      <p className="mt-0.5 text-[10.5px] text-text-subtle">{caption}</p>
    </div>
  );
}
