'use client';

import type { ReactNode } from 'react';

import { MotionConfig } from 'motion/react';

/** One place that makes every Motion animation honour prefers-reduced-motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
