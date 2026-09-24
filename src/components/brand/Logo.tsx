import { HeartPulse } from 'lucide-react';

import { cn } from '@/lib/cn';

/**
 * The CarePulse mark exactly as the application renders it in its sidebar,
 * login screen and loading screen: a HeartPulse glyph on a primary-blue tile.
 */
export function LogoMark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const tile = { sm: 'size-6 rounded-[6px]', md: 'size-8 rounded-md', lg: 'size-12 rounded-[10px]' }[size];
  const glyph = { sm: 'size-3.5', md: 'size-[18px]', lg: 'size-7' }[size];
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center bg-primary text-white', tile, className)}>
      <HeartPulse className={glyph} strokeWidth={2.25} aria-hidden />
    </span>
  );
}

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span
        className={cn(
          'font-display text-[17px] font-semibold tracking-[-0.02em]',
          tone === 'dark' ? 'text-ink' : 'text-white',
        )}
      >
        CarePulse
      </span>
    </span>
  );
}
