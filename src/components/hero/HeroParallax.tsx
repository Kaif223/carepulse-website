'use client';

import { useRef, type ReactNode } from 'react';

import { motion, useScroll, useTransform } from 'motion/react';

import { useMediaQuery, usePrefersReducedMotion } from '@/components/motion/useMediaQuery';

/**
 * Gentle depth as the hero scrolls away: the product window and its floating
 * panels move at slightly different rates. Desktop only, and switched off
 * entirely under reduced motion — the layout is identical either way.
 */
export function HeroParallax({ window, overlays }: { window: ReactNode; overlays: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const enabled = desktop && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end start'] });
  const windowY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, -96]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={enabled ? { y: windowY } : undefined}>{window}</motion.div>
      <motion.div className="pointer-events-none absolute inset-0" style={enabled ? { y: overlayY } : undefined}>
        {overlays}
      </motion.div>
    </div>
  );
}
