'use client';

import type { ReactNode } from 'react';

import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Section-level entrance. Used for blocks that establish hierarchy (a heading,
 * then its product visual) — deliberately not for every paragraph.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section';
}) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}
