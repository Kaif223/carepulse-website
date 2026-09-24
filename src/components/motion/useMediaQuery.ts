'use client';

import { useSyncExternalStore } from 'react';

/** SSR-safe media query subscription; the server snapshot is always `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Hydration-safe reduced-motion preference: false during SSR and hydration,
 * the real value right after. Use this — not Motion's useReducedMotion — for
 * anything that changes rendered markup, or the first client render won't
 * match the server's.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
