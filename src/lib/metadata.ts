import type { Metadata } from 'next';

import { site } from '@/data/site';

/**
 * Open Graph fields shared by every route. Next.js replaces (not merges) a
 * parent's `openGraph` when a page sets its own, so pages spread this and add
 * their `url`. The image comes from app/opengraph-image.png.
 */
export const baseOpenGraph = {
  type: 'website',
  siteName: site.name,
  title: site.title,
  description: site.description,
  locale: site.locale,
} satisfies Metadata['openGraph'];
