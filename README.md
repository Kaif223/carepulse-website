# CarePulse website

The public marketing site for **CarePulse**, the pharmacy and retail management platform built in
[`pharmacy-management-system`](../pharmacy-management). This repository contains only the website. The application
repository is the source of truth for every claim made here.

## Stack

- **Next.js 16** (App Router, static prerender) + **React 19** + **TypeScript**
- **Tailwind CSS 4**, with tokens copied from the app's `apps/web/src/styles/tokens.css`
- **Motion** for React UI motion (reveals, state transitions, layout animation)
- **GSAP + ScrollTrigger** for the two pinned chapters only (loaded on demand, see below)
- **lucide-react** icons, the same set the app uses
- Vitest + Testing Library for unit tests, Playwright for end-to-end tests

Lottie and 3D were left out on purpose. No real Lottie assets exist for the brand, and none of the story needed 3D.
Recreating the actual product UI explains more than either would.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm test         # unit tests
pnpm build
pnpm test:e2e     # builds, serves on :3200, runs desktop/tablet/mobile
                  # PLAYWRIGHT_CHANNEL=chrome uses an installed Chrome instead of bundled Chromium
```

## Configuration

Copy `.env.example` to `.env.local` for local work; on Vercel, set the same names in Project Settings. `pnpm dev`
needs none of them. **`pnpm build` refuses to run** (a clear error listing every problem) unless:

| Variable | Rule |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public https origin — used for canonical, sitemap, robots and Open Graph. **Required**, except on Vercel, where production falls back to the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`) and previews to their own URL. Localhost, placeholders (`*.example`, `YOUR-DOMAIN`) and invalid URLs are rejected. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional, but **at least one** of this and `NEXT_PUBLIC_APP_URL` is required: the closing CTA must do something real. Becomes "Talk to us" (mailto). |
| `NEXT_PUBLIC_APP_URL` | Optional (see above). Adds "Sign in"; becomes the closing CTA when no email is set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional. Search Console HTML-tag token (the `content` value only); renders `<meta name="google-site-verification">`. |
| `SITE_URL_ALLOW_LOCAL` | Local testing only (`=1` lets a build use a localhost origin; the Playwright suite sets it). Never on a deployment. |

On Vercel, **production** builds without `NEXT_PUBLIC_SITE_URL` use the project's production domain, and
**preview** builds use their own `VERCEL_URL` and are served `noindex` with a disallow-all `robots.txt`, so previews
never reach search engines. Validation lives in `src/lib/site-env.ts` (unit
tested) and runs from `next.config.ts`.

## Structure

```text
src/
├── app/                 layout, page, not-found, sitemap, robots, manifest, icons + OG image (brand kit)
├── assets/brand/        brand-kit SVGs rendered in the page (synced, never edited here)
├── components/
│   ├── brand/           Logo, LogoMark, LogoIcon — the approved brand-kit SVGs
│   ├── navigation/      sticky header (active-chapter tracking, mobile menu), footer
│   ├── hero/            hero + desktop-only parallax wrapper
│   ├── product/         recreated product screens: dashboard, POS, FEFO demo, ledger, cash shift, reports, transfer
│   ├── sections/        one file per chapter of the page
│   ├── motion/          Reveal, ScrollRail, the GSAP loader/hook, media-query hooks
│   └── ui/              Container, ButtonLink, Section/SectionIntro/FactList, Badge
├── data/                site config, sample data, POS steps, system diagram, roles, FAQ
├── lib/                 site-env.ts (config rules), fefo.ts (port of the app's FEFO planner), metadata, structured data
└── styles/globals.css   tokens + hero keyframes
```

## Brand assets

The approved **CarePulse brand kit** lives in the application repository at
`pharmacy-management/apps/web/src/assets/carepulse-brand-kit` and is the source of truth. This site keeps verbatim
copies where Next.js needs them — `src/app/` (favicon.ico, icon.svg, apple-icon.png, opengraph-image.png),
`public/` (manifest icons) and `src/assets/brand/` (logo, mark, icon rendered in the page). After the kit changes:

```bash
scripts/sync-brand-kit.sh ../pharmacy-management
```

`icon.svg` comes from the app's `public/favicon.svg`, which is the kit's `favicon.svg` as published there. The kit's
`carepulse-icon-showcase.png` is intentionally unused: the page shows the product itself rather than a presentation
render of the icon, and no other imagery is used — no stock photography.

## How motion is organised

| Where | Technique | Why |
|---|---|---|
| Hero entrance | Pure CSS keyframes | Paints and animates before any JS loads. Nothing above the fold waits on hydration. |
| "How it works" diagram, POS walkthrough | GSAP ScrollTrigger (pinned, scrubbed) | Real scroll choreography |
| FEFO demo, ledger, cash-shift close, transfer, reports tabs | Motion (state-driven) | These are React state machines, and Motion animates the state changes |
| Purchasing rail, parallax, reveals | Motion `useScroll` / `whileInView` | Light and already in the bundle |

Rules the code follows:

- **Pinned scenes render their final state.** The diagram and POS markup is finished; GSAP rewinds it and plays
  forward only in the cinematic context. The smaller demos (FEFO, ledger, cash shift, transfer) start from their
  opening state and play once on view — immediately complete under reduced motion.
- **Cinematic context** = `(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)`.
  Shorter screens get the static layout rather than a pinned stage that crops itself.
- **Never animate an element that also carries a CSS `translate`.** GSAP folds it into its own transform and loses
  the centering; positioned wrappers centre, inner elements animate (see `SystemSection`).
- **GSAP isn't downloaded unless it's used.** `useGsapScene(scope, CINEMATIC_QUERY, setup)` fetches GSAP only when
  `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` matches. Its scenes run inside `gsap.matchMedia`,
  so they're reverted on unmount, resize or a preference change. Phones never load GSAP.
- **Reduced motion.** `MotionConfig reducedMotion="user"` covers Motion. Anything that changes *markup* uses
  `usePrefersReducedMotion()` instead of Motion's `useReducedMotion`, because it is hydration-safe (false during SSR
  and hydration, the real value right after).
- GSAP rounds px values, so SVG dash animations use `pathLength={100}` with whole-number offsets.
- The POS walkthrough can always be operated without scrolling: its step list is made of buttons, and on phones it
  has previous/next controls.

## Product truth

Every capability on the page was checked against the application's README, API services, seed data and web screens.
Specifics:

- Sample data (Panadol 500mg, Lahore Main Pharmacy, Shifa Distributors, Fatima Khan…) comes from the app's development
  seed. Those are fictional entities. Every recreated screen carries a "sample data" note.
- Reports show only what the app ships: **Cash Summary**, **Expense Breakdown** and **Activity**.
- The role matrix comes from the seeded roles' grants. The audit-log examples use only actions the API writes.
- The FEFO demo runs `src/lib/fefo.ts`, a port of the API's `FefoService.plan()`. Its tests include the README's
  worked example.
- The FAQ says plainly that offline mode and FBR e-invoicing are **not** in the current version.
- Left out on purpose because the app doesn't have them: pricing, customer logos, testimonials, statistics,
  certifications, integrations, and the Administration screens (user and role management have no backend yet).

`tests/unit/product-truth.test.ts` fails the build if the copy picks up fake social proof, buzzwords or compliance
claims, or if the structured data gains `offers`, ratings or reviews.

## Production hardening

- **Security headers** (production only, `next.config.ts`): CSP (`default-src 'self'`, no plugins, no framing,
  `base-uri`/`form-action` locked; inline scripts/styles allowed because Next.js hydration and Motion/GSAP need them),
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and one-year HSTS without
  `includeSubDomains`/`preload` (those would commit every subdomain, including the app's, to HTTPS).
- **404**: `app/not-found.tsx`, branded; Next.js serves it with a 404 status and `noindex`, and it has no canonical.
- **Contrast**: the app's lightest greys and status colours miss WCAG AA on this site's surfaces at caption sizes, so
  `globals.css` uses one shade darker (documented there). An axe scan in the e2e suite guards it.
- **Privacy**: no analytics, cookies, local storage, forms or third-party requests (fonts are self-hosted), so no
  cookie banner is needed. Add a privacy notice before adding any of those.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` and at least one of `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_APP_URL` on Vercel
  (Production environment).
- After the first deploy: check the share preview with the platform debuggers and submit `/sitemap.xml` in Search
  Console.
