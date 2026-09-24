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

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin. Used for canonical URLs, sitemap, robots and Open Graph. **Set this for production.** |
| `NEXT_PUBLIC_APP_URL` | Optional. Adds a "Sign in" link to the application. Hidden when unset. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. Changes the CTAs to "Talk to us" (mailto). When unset in development, the final CTA shows a dashed **DEV PLACEHOLDER** notice. Production shows nothing. |

The site never renders a link to a page or service that doesn't exist.

## Structure

```text
src/
├── app/                 layout (fonts, metadata), page, sitemap, robots, OG image, icon
├── components/
│   ├── brand/           Logo — the HeartPulse-on-blue mark the app itself uses
│   ├── navigation/      sticky header (active-chapter tracking, mobile menu), footer
│   ├── hero/            hero + desktop-only parallax wrapper
│   ├── product/         recreated product screens: dashboard, POS, FEFO demo, ledger, cash shift, reports, transfer
│   ├── sections/        one file per chapter of the page
│   ├── motion/          Reveal, ScrollRail, the GSAP loader/hook, media-query hooks
│   └── ui/              Container, ButtonLink, Section/SectionIntro/FactList, Badge
├── data/                site config, sample data, POS steps, system diagram, roles, FAQ
├── lib/                 fefo.ts (port of the app's FEFO planner), formatting, structured data
└── styles/globals.css   tokens + hero keyframes
```

## How motion is organised

| Where | Technique | Why |
|---|---|---|
| Hero entrance | Pure CSS keyframes | Paints and animates before any JS loads. Nothing above the fold waits on hydration. |
| "How it works" diagram, POS walkthrough | GSAP ScrollTrigger (pinned, scrubbed) | Real scroll choreography |
| FEFO demo, ledger, cash-shift close, transfer, reports tabs | Motion (state-driven) | These are React state machines, and Motion animates the state changes |
| Purchasing rail, parallax, reveals | Motion `useScroll` / `whileInView` | Light and already in the bundle |

Rules the code follows:

- **The markup is the final state.** Scroll scenes rewind it in JS and then play forward. Without JS, on mobile, or
  under reduced motion, visitors see the finished diagram or screen straight away.
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

## Before launch

- Set `NEXT_PUBLIC_SITE_URL`. Optionally set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`.
- The OG image (`src/app/opengraph-image.tsx`) is generated from brand tokens at build time. Replace it if design
  produces a final social card.
- There are no legal pages (privacy policy, terms). Add them before collecting any visitor data.
