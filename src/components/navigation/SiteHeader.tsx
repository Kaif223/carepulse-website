'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { headerCta, signInCta } from '@/data/cta';
import { primaryNav } from '@/data/navigation';
import { cn } from '@/lib/cn';

import { useActiveSection } from './useActiveSection';


export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(primaryNav.map((item) => item.href.slice(1)));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only rounded-md bg-ink px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>
      <div
        className={cn(
          'border-b transition-[background-color,border-color,box-shadow] duration-300',
          scrolled || open
            ? 'border-border/80 bg-white/88 shadow-[0_8px_24px_-18px_rgb(15_23_42/0.25)] backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 transition-[height] duration-300 sm:px-8',
            scrolled ? 'h-16' : 'h-[72px]',
          )}
        >
          <a href="#top" aria-label="CarePulse — back to top" className="rounded-md">
            {/* Slightly smaller on phones so the logo, CTA and menu fit on one line. */}
            <Logo priority className="h-[26px] w-auto sm:h-[30px]" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-200',
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-surface-muted"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {signInCta && (
              <a
                href={signInCta.href}
                className="hidden rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink sm:inline-flex"
              >
                Sign in
              </a>
            )}
            {/* Kept visible on phones; only the narrowest screens drop it in favour of the menu. */}
            <span className="max-[374px]:hidden">
              <ButtonLink href={headerCta.href}>{headerCta.label}</ButtonLink>
            </span>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink ring-1 ring-border hover:bg-surface-muted lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={menuId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="space-y-1 px-5 pt-2 pb-6 sm:px-8">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center rounded-lg px-3 text-[16px] font-medium text-ink hover:bg-surface-muted"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="flex flex-col gap-2 pt-3">
                  <ButtonLink href={headerCta.href} size="lg" onClick={() => setOpen(false)}>
                    {headerCta.label}
                  </ButtonLink>
                  {signInCta && (
                    <ButtonLink href={signInCta.href} size="lg" variant="secondary">
                      Sign in
                    </ButtonLink>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
