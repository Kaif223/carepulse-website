import Image from 'next/image';

import icon from '@/assets/brand/carepulse-icon.svg';
import logo from '@/assets/brand/carepulse-logo.svg';
import mark from '@/assets/brand/carepulse-mark.svg';
import { cn } from '@/lib/cn';

/*
 * The approved CarePulse brand kit, rendered as-is (see scripts/sync-brand-kit.sh).
 * SVGs are served unoptimized: they are already vector, and the image
 * optimizer would rasterize them.
 */

/** carepulse-logo.svg's viewBox is 740 × 150. */
const LOGO_ASPECT_RATIO = 740 / 150;

/** Mark + wordmark lockup. `alt` names the brand so the header link reads "CarePulse". */
export function Logo({
  className,
  height = 30,
  priority = false,
}: {
  className?: string;
  height?: number;
  /** Only the header logo is above the fold. */
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="CarePulse"
      height={height}
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      unoptimized
      priority={priority}
      className={cn('h-auto', className)}
    />
  );
}

/** The CP mark on its own (transparent). Decorative: the surrounding text names the brand. */
export function LogoMark({ size, className }: { size: number; className?: string }) {
  return <Image src={mark} alt="" width={size} height={size} unoptimized className={className} />;
}

/** The app icon: the mark on its white rounded tile. Decorative. */
export function LogoIcon({ size, className }: { size: number; className?: string }) {
  return <Image src={icon} alt="" width={size} height={size} unoptimized className={className} />;
}
