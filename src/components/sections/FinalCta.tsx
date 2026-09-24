import { LogoMark } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/data/site';

export function FinalCta() {
  const primary = site.contactEmail
    ? { label: 'Talk to us', href: `mailto:${site.contactEmail}?subject=CarePulse` }
    : { label: 'Explore the platform', href: '#platform' };

  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-primary text-white">
      {/* The CarePulse pulse, running through the mark. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[72px] h-[96px] w-full opacity-25 sm:top-[104px]"
        viewBox="0 0 1200 96"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 48 H452 L474 48 L494 10 L524 86 L544 48 H1200"
          stroke="white"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <Container className="relative py-24 text-center sm:py-32">
        <LogoMark size="lg" className="relative mx-auto bg-white text-primary ring-8 ring-primary" />
        <h2
          id="cta-title"
          className="mx-auto mt-8 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
        >
          The counter, the shelf and the books. Finally in step.
        </h2>
        <p className="mx-auto mt-5 max-w-[36rem] text-[17px] leading-relaxed text-white/80 sm:text-[18px]">
          CarePulse brings sales, batches, purchasing, credit and cash into one system — for one pharmacy or a network
          of branches.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={primary.href} variant="inverse" size="lg" arrow className="w-full sm:w-auto">
            {primary.label}
          </ButtonLink>
          <ButtonLink href="#system" variant="outline-inverse" size="lg" className="w-full sm:w-auto">
            See how it works
          </ButtonLink>
        </div>
        {!site.contactEmail && process.env.NODE_ENV !== 'production' && (
          <p className="mx-auto mt-8 w-fit rounded-md border border-dashed border-white/50 px-3 py-1.5 font-mono text-[11px] text-white/80">
            DEV PLACEHOLDER — set NEXT_PUBLIC_CONTACT_EMAIL to turn this into “Talk to us”
          </p>
        )}
      </Container>
    </section>
  );
}
