'use client';

import { useRef, useState } from 'react';

import { LogoIcon } from '@/components/brand/Logo';
import { CINEMATIC_QUERY, useGsapScene } from '@/components/motion/gsap';
import { Container } from '@/components/ui/Container';
import { SYSTEM_CORE, SYSTEM_NODES, SYSTEM_STEPS, SYSTEM_VIEWBOX, linkPath } from '@/data/system';
import { cn } from '@/lib/cn';

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

/**
 * The signature chapter: six modules begin as disconnected records, are drawn
 * into one CarePulse core, and then a single credit sale pulses through every
 * record it updates.
 *
 * The markup renders the finished, connected state. Only on a wide screen
 * with motion allowed does GSAP rewind it to the scattered state and scrub
 * forward with the scroll — everyone else (mobile, reduced motion, no JS) gets
 * the complete diagram immediately.
 */
export function SystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useGsapScene(sectionRef, CINEMATIC_QUERY, ({ gsap }) => {
    const nodes = gsap.utils.toArray<HTMLElement>('.sys-node');
    const pulseIn = '.sys-pulse[data-direction="in"]';
    const pulseOut = '.sys-pulse[data-direction="out"]';

    gsap.set(nodes, {
      x: (i: number) => SYSTEM_NODES[i]?.scatter.x ?? 0,
      y: (i: number) => SYSTEM_NODES[i]?.scatter.y ?? 0,
      opacity: 0.45,
      scale: 0.94,
    });
    gsap.set('.sys-solid', { opacity: 0 });
    gsap.set('.sys-role', { opacity: 0 });
    gsap.set('.sys-core', { opacity: 0, scale: 0.7 });
    // pathLength is 100 (not 1): GSAP rounds px values, so dash offsets must be whole numbers.
    gsap.set('.sys-link', { strokeDashoffset: 100 });
    gsap.set(pulseIn, { strokeDashoffset: -100 });
    gsap.set(pulseOut, { strokeDashoffset: 14 });
    gsap.set('.sys-event', { opacity: 0, y: 6 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: stageRef.current,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const t = self.progress * tl.duration();
          setActiveStep(t < tl.labels.connect! + 0.4 ? 0 : t < tl.labels.flow! ? 1 : 2);
        },
        onLeaveBack: () => setActiveStep(0),
      },
    });

    tl.to({}, { duration: 0.6 })
      .addLabel('connect')
      .to(nodes, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.05 }, 'connect')
      .to('.sys-core', { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 'connect+=0.35')
      .to('.sys-link', { strokeDashoffset: 0, duration: 0.8, stagger: 0.06 }, 'connect+=0.7')
      .to('.sys-solid', { opacity: 1, duration: 0.5, stagger: 0.06 }, 'connect+=0.9')
      .to('.sys-role', { opacity: 1, duration: 0.5, stagger: 0.06 }, 'connect+=1')
      .addLabel('flow', '+=0.3')
      .to(pulseIn, { strokeDashoffset: 14, duration: 0.7, ease: 'none' }, 'flow')
      .to('.sys-event[data-node="sales"]', { opacity: 1, y: 0, duration: 0.3 }, 'flow')
      .to(pulseOut, { strokeDashoffset: -100, duration: 0.8, ease: 'none', stagger: 0.12 }, 'flow+=0.7')
      .to('.sys-event:not([data-node="sales"])', { opacity: 1, y: 0, duration: 0.3, stagger: 0.12 }, 'flow+=1.2')
      .to({}, { duration: 0.6 });

    setActiveStep(0);
    return () => setActiveStep(null);
  });

  return (
    <section
      ref={sectionRef}
      id="system"
      aria-labelledby="system-title"
      className="relative bg-night text-night-text"
    >
      <div aria-hidden className="bg-grid-night mask-fade-y pointer-events-none absolute inset-0" />
      <div ref={stageRef} className="relative flex min-h-screen items-center py-24 lg:pt-16 lg:pb-0">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,400px)_1fr] xl:gap-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-3 font-mono text-[12px] font-medium tracking-[0.14em] text-night-muted uppercase">
              <span className="text-[#7aa2ff]">01</span>
              <span aria-hidden className="h-px w-6 bg-night-line" />
              How it works
            </p>
            <h2
              id="system-title"
              className="font-display text-[clamp(2rem,3.1vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-white"
            >
              One connected system instead of six disconnected tools.
            </h2>
            <ol className="mt-9 space-y-5">
              {SYSTEM_STEPS.map((step, index) => {
                const isActive = activeStep === null || activeStep === index;
                // While the scene plays, only the current step shows its body, so the
                // column fits short laptop screens (e.g. 1280×720) without clipping.
                const isCollapsed = activeStep !== null && !isActive;
                return (
                  <li
                    key={step.title}
                    className={cn(
                      'relative border-l pl-5 transition-[opacity,border-color] duration-500',
                      isActive ? 'border-[#7aa2ff] opacity-100' : 'border-night-line opacity-60',
                    )}
                  >
                    <p className="font-mono text-[11px] text-night-muted tabular-nums">0{index + 1}</p>
                    <h3 className="mt-1 text-[17px] font-semibold tracking-[-0.01em] text-white">{step.title}</h3>
                    <div
                      className={cn(
                        'grid transition-[grid-template-rows] duration-500 ease-out',
                        isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                      )}
                    >
                      <p className="overflow-hidden pt-1.5 text-[15px] leading-relaxed text-night-muted">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <Diagram />
          <MobileDiagram />
        </Container>
      </div>
    </section>
  );
}

function Diagram() {
  const { width, height } = SYSTEM_VIEWBOX;
  return (
    <figure className="relative mx-auto hidden aspect-[720/560] w-full max-w-[720px] lg:block">
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="sys-glow">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={SYSTEM_CORE.x} cy={SYSTEM_CORE.y} r="190" fill="url(#sys-glow)" />
        {SYSTEM_NODES.map((node) => (
          <path
            key={`link-${node.id}`}
            className="sys-link"
            d={linkPath(node)}
            pathLength={100}
            strokeDasharray="100"
            fill="none"
            stroke="#3b5bdb"
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
        ))}
        {SYSTEM_NODES.filter((node) => node.event).map((node) => (
          <path
            key={`pulse-${node.id}`}
            className="sys-pulse"
            data-direction={node.id === 'sales' ? 'in' : 'out'}
            d={linkPath(node)}
            pathLength={100}
            strokeDasharray="14 200"
            strokeDashoffset={node.id === 'sales' ? 14 : -100}
            fill="none"
            stroke="#9db8ff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Centering (CSS translate) lives on wrappers; GSAP animates only the inner
          elements, because it folds an existing CSS translate into its own transform. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct(SYSTEM_CORE.x, width), top: pct(SYSTEM_CORE.y, height) }}
      >
        <div className="sys-core flex flex-col items-center">
          <div className="rounded-[18px] shadow-[0_0_0_10px_rgb(37_99_235/0.1),0_0_60px_rgb(37_99_235/0.4)]">
            <LogoIcon size={96} className="size-[76px] rounded-[18px] xl:size-24 xl:rounded-[22px]" />
          </div>
          <p className="mt-3 font-display text-[18px] font-semibold tracking-[-0.02em] text-white">CarePulse</p>
          <p className="rounded-full bg-night/85 px-2 font-mono text-[10.5px] tracking-wide text-night-muted">one database · one set of rules</p>
        </div>
      </div>

      {SYSTEM_NODES.map((node) => {
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            // Width is a share of the diagram (176px of 720) so nodes scale with it instead of colliding at ~1024px.
            className="absolute w-[24.5%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(node.x, width), top: pct(node.y, height) }}
          >
            <div className="sys-node relative">
              <div className="relative rounded-xl bg-night-raised px-3 py-2.5 xl:px-3.5 xl:py-3">
                <span aria-hidden className="sys-dashed absolute inset-0 rounded-xl border border-dashed border-[#334166]" />
                <span aria-hidden className="sys-solid absolute inset-0 rounded-xl border border-[#3b5bdb]/70" />
                <p className="relative flex items-center gap-2 text-[13px] font-semibold text-white xl:text-[14px]">
                  <Icon className="size-4 text-[#7aa2ff]" aria-hidden />
                  {node.label}
                </p>
                <p className="sys-role relative mt-1 text-[11px] leading-snug text-night-muted xl:text-[11.5px]">{node.role}</p>
              </div>
              {node.event && (
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2',
                    node.y < SYSTEM_CORE.y ? 'top-full mt-2' : 'bottom-full mb-2',
                  )}
                >
                  <p
                    data-node={node.id}
                    className="sys-event rounded-full bg-[#1b2a52] px-2.5 py-1 font-mono text-[10px] font-medium whitespace-nowrap text-[#b9ccff] ring-1 ring-[#2f4a8f]"
                  >
                    {node.event}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <figcaption className="sr-only">
        Sales, Inventory, Purchasing, Customers, Finance and Reports all connect to one CarePulse core. A credit sale
        of PKR 1,000 paid PKR 400 in cash records the sale, a FEFO stock movement, a PKR 600 customer ledger debit and
        a PKR 400 cash-in on the open shift, which the Cash Summary report then includes.
      </figcaption>
    </figure>
  );
}

function MobileDiagram() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-3">
        <LogoIcon size={48} className="rounded-[11px]" />
        <div>
          <p className="font-display text-[18px] font-semibold text-white">CarePulse</p>
          <p className="font-mono text-[11px] text-night-muted">one database · one set of rules</p>
        </div>
      </div>
      <ul className="mt-4 ml-6 border-l border-[#2f4a8f]">
        {SYSTEM_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <li key={node.id} className="relative py-2.5 pl-6">
              <span aria-hidden className="absolute top-1/2 left-0 h-px w-4 bg-[#2f4a8f]" />
              <div className="flex items-center justify-between gap-3 rounded-xl bg-night-raised px-4 py-3 ring-1 ring-[#2c3d66]">
                <div>
                  <p className="flex items-center gap-2 text-[14.5px] font-semibold text-white">
                    <Icon className="size-4 text-[#7aa2ff]" aria-hidden />
                    {node.label}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-night-muted">{node.role}</p>
                </div>
                {node.event && (
                  <span className="shrink-0 rounded-full bg-[#1b2a52] px-2 py-0.5 font-mono text-[10px] text-[#b9ccff]">
                    {node.event}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
