'use client';

import { useRef, type ReactNode } from 'react';

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * A vertical sequence whose rail fills as the reader scrolls through it,
 * lighting each step as the fill reaches it. The steps are complete and
 * readable without it; under reduced motion the rail is simply full.
 */
export function ScrollRail({ steps, className }: { steps: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });

  return (
    <ol ref={ref} className={`relative ${className ?? ''}`}>
      <span aria-hidden className="absolute top-3 bottom-3 left-[15px] w-px bg-border" />
      <motion.span
        aria-hidden
        className="absolute top-3 bottom-3 left-[15px] w-px origin-top bg-primary"
        style={reduce ? undefined : { scaleY: scrollYProgress }}
      />
      {steps.map((content, index) => (
        <RailStep
          key={index}
          index={index}
          threshold={steps.length > 1 ? index / (steps.length - 1) : 0}
          progress={scrollYProgress}
          animate={!reduce}
        >
          {content}
        </RailStep>
      ))}
    </ol>
  );
}

function RailStep({
  index,
  threshold,
  progress,
  animate,
  children,
}: {
  index: number;
  threshold: number;
  progress: MotionValue<number>;
  animate: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [threshold - 0.12, threshold], [0.35, 1]);

  return (
    <motion.li className="relative flex gap-5 pb-8 last:pb-0" style={animate ? { opacity } : undefined}>
      <span className="relative z-10 flex size-[31px] shrink-0 items-center justify-center rounded-full bg-white font-mono text-[11px] font-semibold text-primary ring-1 ring-primary/35">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 pt-1">{children}</div>
    </motion.li>
  );
}
