'use client';

import { useRef, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CINEMATIC_QUERY, useGsapScene } from '@/components/motion/gsap';
import { ProductWindow } from '@/components/product/AppShell';
import { PosScreen } from '@/components/product/PosScreen';
import { Container } from '@/components/ui/Container';
import { SectionIntro } from '@/components/ui/Section';
import { POS_STEPS } from '@/data/pos';
import { cn } from '@/lib/cn';

/**
 * A pharmacy transaction, step by step. On wide screens the chapter pins and
 * the scroll position drives the POS screen through each state; the step list
 * stays clickable (it scrolls to that step). Everywhere else the same states
 * are stepped through with buttons, so nothing depends on scroll choreography.
 */
export function PosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [step, setStep] = useState(0);
  const last = POS_STEPS.length - 1;

  useGsapScene(sectionRef, CINEMATIC_QUERY, ({ ScrollTrigger }) => {
    triggerRef.current = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top top',
      end: `+=${POS_STEPS.length * 55}%`,
      pin: true,
      onUpdate: (self) => setStep(Math.min(last, Math.floor(self.progress * POS_STEPS.length))),
    });
    return () => {
      triggerRef.current = null;
    };
  });

  function goTo(index: number) {
    const target = Math.max(0, Math.min(last, index));
    const trigger = triggerRef.current;
    if (trigger) {
      const span = trigger.end - trigger.start;
      window.scrollTo({ top: trigger.start + ((target + 0.5) / POS_STEPS.length) * span });
    } else {
      setStep(target);
    }
  }

  const current = POS_STEPS[step]!;

  return (
    <section ref={sectionRef} id="pos" aria-labelledby="pos-title" className="relative bg-white">
      <Container className="pt-28 sm:pt-36">
        <SectionIntro
          chapter="02"
          label="Point of Sale"
          titleId="pos-title"
          title="A counter that keeps up with the queue."
          lede="Built for the moment a customer is standing at the till: scan, choose the packaging, take payment and print — with the stock, the drawer and the ledger updated behind it."
        />
      </Container>

      <div ref={stageRef} className="flex items-center py-14 lg:min-h-screen lg:py-10">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
          <ol className="hidden space-y-1 lg:block" aria-label="POS walkthrough steps">
            {POS_STEPS.map((item, index) => {
              const active = index === step;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'group w-full rounded-xl px-4 py-3 text-left transition-colors duration-300',
                      active ? 'bg-background' : 'hover:bg-background/60',
                    )}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={cn(
                          'font-mono text-[11px] tabular-nums transition-colors',
                          active ? 'text-primary' : 'text-text-subtle',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'text-[15.5px] font-semibold tracking-[-0.01em] transition-colors',
                          active ? 'text-ink' : 'text-text-muted group-hover:text-ink-muted',
                        )}
                      >
                        {item.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 ease-out',
                        active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-1.5 pl-[26px] text-[14px] leading-relaxed text-ink-muted">
                          {item.body}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div>
            <ProductWindow>
              <div aria-hidden className="h-[580px] select-none sm:h-[620px]">
                <PosScreen step={step} />
              </div>
            </ProductWindow>
            <p className="sr-only" aria-live="polite">
              Step {step + 1} of {POS_STEPS.length}: {current.title}. {current.body}
            </p>

            <div className="mt-6 lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[12px] text-primary tabular-nums">
                  {String(step + 1).padStart(2, '0')} / {String(POS_STEPS.length).padStart(2, '0')}
                </p>
                <div className="flex gap-2">
                  <StepButton label="Previous step" disabled={step === 0} onClick={() => goTo(step - 1)}>
                    <ChevronLeft className="size-5" aria-hidden />
                  </StepButton>
                  <StepButton label="Next step" disabled={step === last} onClick={() => goTo(step + 1)}>
                    <ChevronRight className="size-5" aria-hidden />
                  </StepButton>
                </div>
              </div>
              <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.01em] text-ink">{current.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{current.body}</p>
              <div className="mt-5 flex gap-1.5" aria-hidden>
                {POS_STEPS.map((item, index) => (
                  <span
                    key={item.key}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      index <= step ? 'bg-primary' : 'bg-border',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full text-ink ring-1 ring-border transition-colors hover:bg-background disabled:opacity-35"
    >
      {children}
    </button>
  );
}
