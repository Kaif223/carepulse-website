import type { ComponentProps, ReactNode } from 'react';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'outline-inverse';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-[0_1px_0_0_rgb(255_255_255/0.18)_inset,0_8px_20px_-8px_rgb(37_99_235/0.7)] hover:bg-primary-hover active:bg-primary-active',
  secondary: 'bg-white text-ink ring-1 ring-border-strong/80 hover:ring-ink/25 hover:bg-surface-muted/60',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-muted',
  inverse: 'bg-white text-ink hover:bg-primary-soft',
  'outline-inverse': 'text-white ring-1 ring-white/25 hover:ring-white/50 hover:bg-white/5',
};

const SIZES: Record<Size, string> = {
  md: 'h-10 px-4 text-[14px] gap-1.5',
  lg: 'h-12 px-5.5 text-[15px] gap-2',
};

interface ButtonLinkProps extends ComponentProps<'a'> {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
}

/** Every call to action on this site navigates, so the primitive is a link styled as a button. */
export function ButtonLink({ variant = 'primary', size = 'md', arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(
        'group/button inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap tracking-[-0.005em] transition-[background-color,box-shadow,color,transform] duration-200 ease-out active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowRight
          className="size-4 transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
          aria-hidden
        />
      )}
    </a>
  );
}
