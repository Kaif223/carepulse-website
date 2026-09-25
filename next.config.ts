import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

import { productionConfigProblems } from './src/lib/site-env';

/**
 * Security headers. The CSP allows inline scripts and styles because Next.js
 * inlines its hydration payload and Motion/GSAP animate through inline
 * styles; nonces would force every page to render dynamically. What it does
 * enforce — same-origin everything, no plugins, no framing, no <base>
 * hijacking — still matters for a static marketing site.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Legacy counterpart of frame-ancestors for older browsers.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  // One year, without includeSubDomains/preload: those commit every subdomain
  // (including the application's) to HTTPS and are hard to undo.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const problems = productionConfigProblems(process.env);
    if (problems.length > 0) {
      throw new Error(
        `CarePulse production build refused — fix the environment (see .env.example):\n  - ${problems.join('\n  - ')}`,
      );
    }
  }

  return {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: {
      // Tree-shake icon and animation barrels so a section only ships what it imports.
      optimizePackageImports: ['lucide-react', 'motion'],
    },
    async headers() {
      // Dev needs eval and a websocket for fast refresh, which this CSP forbids.
      if (process.env.NODE_ENV !== 'production') return [];
      return [{ source: '/:path*', headers: SECURITY_HEADERS }];
    },
  };
}
