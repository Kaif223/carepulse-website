'use client';

import { useEffect, type RefObject } from 'react';

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger;

export interface GsapKit {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerType;
}

let kit: Promise<GsapKit> | null = null;

/**
 * GSAP is only needed by the pinned, scroll-choreographed chapters, so it is
 * loaded on demand rather than shipped in the initial bundle. The promise is
 * shared, so the plugin is registered exactly once.
 */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, st]) => {
    core.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return kit;
}

/** Wide screen and motion allowed: the only context that gets pinned choreography. */
export const CINEMATIC_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/**
 * Runs a GSAP scene scoped to `scope` while `query` matches.
 *
 * GSAP is not even downloaded until the query matches, so phones and
 * reduced-motion visitors never pay for it. The scene runs inside
 * gsap.matchMedia, so every tween and ScrollTrigger it creates is reverted
 * when the query stops matching (resize, reduced-motion toggle) or the
 * component unmounts; `setup` may return extra cleanup of its own.
 */
export function useGsapScene(
  scope: RefObject<HTMLElement | null>,
  query: string,
  setup: (kit: GsapKit) => void | (() => void),
): void {
  useEffect(() => {
    const list = window.matchMedia(query);
    let cancelled = false;
    let mm: gsap.MatchMedia | undefined;

    const start = () => {
      if (mm || cancelled || !list.matches) return;
      loadGsap().then((loaded) => {
        if (cancelled || mm || !scope.current) return;
        mm = loaded.gsap.matchMedia(scope.current);
        mm.add(query, () => setup(loaded));
      });
    };

    start();
    list.addEventListener('change', start);
    return () => {
      cancelled = true;
      list.removeEventListener('change', start);
      mm?.revert();
    };
    // The scene is built once per mount; matchMedia re-runs it as the query flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
}
