import { Check, Minus } from 'lucide-react';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionIntro } from '@/components/ui/Section';
import { AUDIT_EVENTS, CONTROLS, ROLE_COLUMNS, ROLE_MATRIX } from '@/data/security';

export function SecuritySection() {
  return (
    <Section id="security" tone="dark" labelledBy="security-title" className="overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="bg-grid-night mask-fade-y pointer-events-none absolute inset-0" />
      <div className="relative">
        <SectionIntro
          tone="dark"
          chapter="09"
          label="Control & auditability"
          titleId="security-title"
          title="Access that matches the job. History that can’t be rewritten."
          lede="Every request is checked against the role a person holds at the branch they are working in, and every sensitive action leaves a permanent record."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-2xl bg-night-raised ring-1 ring-night-line">
              <div className="border-b border-night-line px-5 py-4">
                <p className="text-[15px] font-semibold text-white">Five roles out of the box</p>
                <p className="text-[13px] text-night-muted">Default permissions, held per branch</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-night-line align-bottom">
                      <th scope="col" className="px-5 py-3 text-[11px] font-medium tracking-wide text-night-muted uppercase">
                        Role
                      </th>
                      {ROLE_COLUMNS.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className="w-[13%] px-2 py-3 text-center text-[11px] leading-tight font-medium text-night-muted"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_MATRIX.map((row) => (
                      <tr key={row.role} className="border-b border-night-line last:border-0">
                        <th scope="row" className="min-w-[190px] px-5 py-3 font-normal">
                          <span className="block font-semibold text-white">{row.role}</span>
                          <span className="text-[12px] text-night-muted">{row.summary}</span>
                        </th>
                        {ROLE_COLUMNS.map((column) => {
                          const granted = row.grants.includes(column.key);
                          return (
                            <td key={column.key} className="px-2 py-3 text-center">
                              {granted ? (
                                <Check className="mx-auto size-4 text-[#7aa2ff]" aria-label="Yes" />
                              ) : (
                                <Minus className="mx-auto size-4 text-[#334166]" aria-label="No" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#070c18] ring-1 ring-night-line">
              <div className="flex items-center justify-between border-b border-night-line px-5 py-4">
                <p className="text-[15px] font-semibold text-white">Audit log</p>
                <span className="font-mono text-[10.5px] tracking-wide text-night-muted uppercase">append-only</span>
              </div>
              <ol className="space-y-px p-2 font-mono text-[12px]">
                {AUDIT_EVENTS.map((event, index) => (
                  <Reveal as="li" key={event.time} delay={0.15 + index * 0.12} y={6}>
                    <div className="rounded-lg px-3 py-2.5 hover:bg-white/[0.03]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#9db8ff]">{event.action}</span>
                        <span className="text-night-muted tabular-nums">{event.time}</span>
                      </div>
                      <p className="mt-0.5 truncate text-night-muted">
                        <span className="text-night-text">{event.actor}</span> · {event.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-auto border-t border-night-line px-5 py-4 text-[12.5px] leading-relaxed text-night-muted">
                Also recorded: sign-in failures, sign-outs, record changes, transfers, returns and payment voids — with
                the actor, branch and time.
              </p>
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {CONTROLS.map((control) => (
            <div key={control.title} className="border-t border-night-line pt-5">
              <dt className="text-[15.5px] font-semibold tracking-[-0.01em] text-white">{control.title}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-night-muted">{control.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 max-w-[46rem] text-[13px] leading-relaxed text-night-muted">
          CarePulse does not claim any third-party security certification or regulatory compliance. What it does is
          enforce the controls above in the application and the database.
        </p>
      </div>
    </Section>
  );
}
