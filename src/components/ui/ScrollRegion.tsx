import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * A horizontally scrollable wrapper for wide tables on small screens. It is
 * focusable and labelled so keyboard users can scroll it too (WCAG 2.1.1).
 */
export function ScrollRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cn('overflow-x-auto', className)}>
      {children}
    </div>
  );
}
