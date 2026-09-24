import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'credit';

const TONES: Record<Tone, string> = {
  success: 'bg-success-bg text-success ring-success-border',
  warning: 'bg-warning-bg text-warning ring-warning-border',
  danger: 'bg-danger-bg text-danger ring-danger-border',
  info: 'bg-info-bg text-info ring-info-border',
  neutral: 'bg-neutral-bg text-neutral ring-neutral-border',
  credit: 'bg-credit-soft text-credit ring-[#ddd6fe]',
};

/** The application's status pill: tone comes from the status, never from the call site's taste. */
export function Badge({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
