import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { Container } from './Container';

/**
 * Chapter heading used by every product section: a numbered eyebrow tied to
 * the module name in the app's own navigation, a display title and a lede.
 */
export function SectionIntro({
  chapter,
  label,
  title,
  lede,
  tone = 'light',
  align = 'left',
  className,
  titleId,
}: {
  chapter?: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
  titleId?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={cn('max-w-[46rem]', align === 'center' && 'mx-auto text-center', className)}>
      <p
        className={cn(
          'mb-5 inline-flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em]',
          dark ? 'text-night-muted' : 'text-text-muted',
        )}
      >
        {chapter && (
          <span className={cn('tabular-nums', dark ? 'text-[#7aa2ff]' : 'text-primary')}>{chapter}</span>
        )}
        {chapter && <span aria-hidden className={cn('h-px w-6', dark ? 'bg-night-line' : 'bg-border-strong')} />}
        {label}
      </p>
      <h2
        id={titleId}
        className={cn(
          'font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'mt-5 text-[17px] leading-[1.65] text-pretty sm:text-[18px]',
            dark ? 'text-night-muted' : 'text-ink-muted',
            align === 'center' && 'mx-auto max-w-[38rem]',
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  labelledBy,
  tone = 'light',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  tone?: 'light' | 'dark' | 'white';
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative',
        tone === 'dark' && 'bg-night text-night-text',
        tone === 'white' && 'bg-white',
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** A compact fact row — a real product rule stated in one line. */
export function FactList({ items, tone = 'light' }: { items: Array<{ title: string; body: ReactNode }>; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <dl className={cn('grid gap-x-10 gap-y-7 sm:grid-cols-2', dark ? 'text-night-text' : 'text-ink')}>
      {items.map((item) => (
        <div key={item.title} className={cn('border-t pt-4', dark ? 'border-night-line' : 'border-border')}>
          <dt className="text-[15px] font-semibold tracking-[-0.01em]">{item.title}</dt>
          <dd className={cn('mt-1.5 text-[15px] leading-relaxed', dark ? 'text-night-muted' : 'text-ink-muted')}>
            {item.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}
