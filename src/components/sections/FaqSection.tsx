import { Plus } from 'lucide-react';

import { Section, SectionIntro } from '@/components/ui/Section';
import { FAQ } from '@/data/faq';

/** Native <details>: keyboard and screen-reader behaviour for free, and it works without JavaScript. */
export function FaqSection() {
  return (
    <Section id="faq" labelledBy="faq-title" className="py-28 sm:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <SectionIntro
          label="Questions"
          titleId="faq-title"
          title="Straight answers."
          lede="Including the things CarePulse doesn’t do yet."
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <div className="border-t border-border">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-md py-5 text-[17px] font-semibold tracking-[-0.01em] text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border transition-[transform,background-color] duration-300 group-open:rotate-45 group-open:bg-surface-muted">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="max-w-[40rem] pr-12 pb-6 text-[15.5px] leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
