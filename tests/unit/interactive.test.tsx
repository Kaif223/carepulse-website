import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FefoDemo } from '@/components/product/FefoDemo';
import { ReportsScreen } from '@/components/product/ReportsScreen';
import { FaqSection } from '@/components/sections/FaqSection';
import { PosSection } from '@/components/sections/PosSection';
import { FAQ } from '@/data/faq';
import { POS_STEPS } from '@/data/pos';

describe('ReportsScreen', () => {
  it('shows only the reports the product ships, as keyboard-navigable tabs', async () => {
    const user = userEvent.setup();
    render(<ReportsScreen />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Cash Summary', 'Expense Breakdown', 'Activity']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    tabs[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveFocus();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('PosSection', () => {
  it('steps through every POS state with buttons when scroll choreography is off', async () => {
    const user = userEvent.setup();
    render(<PosSection />);
    const live = screen.getByText(/^Step 1 of/);
    const next = screen.getByRole('button', { name: 'Next step' });
    const previous = screen.getByRole('button', { name: 'Previous step' });
    expect(previous).toBeDisabled();

    for (let i = 1; i < POS_STEPS.length; i++) await user.click(next);
    expect(live).toHaveTextContent(`Step ${POS_STEPS.length} of ${POS_STEPS.length}: ${POS_STEPS.at(-1)!.title}`);
    expect(next).toBeDisabled();
  });

  it('lets the step list jump straight to a state', async () => {
    const user = userEvent.setup();
    render(<PosSection />);
    const list = screen.getByRole('list', { name: 'POS walkthrough steps' });
    await user.click(within(list).getByRole('button', { name: /Take payment/ }));
    expect(within(list).getByRole('button', { name: /Take payment/ })).toHaveAttribute('aria-current', 'step');
  });
});

describe('FefoDemo', () => {
  it('lets the visitor change packaging and quantity', async () => {
    const user = userEvent.setup();
    render(<FefoDemo />);
    expect(screen.getByText('2 Box = 200 Tablet')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Strip' }));
    expect(screen.getByText('2 Strip = 20 Tablet')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByText('3 Strip = 30 Tablet')).toBeInTheDocument();
  });

  it('follows the radio group keyboard pattern for packaging', async () => {
    const user = userEvent.setup();
    render(<FefoDemo />);
    const radios = screen.getAllByRole('radio');
    // Only the checked option is a tab stop.
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, -1, 0]);

    radios[2]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Tablet' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Tablet' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Box' })).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('2 Strip = 20 Tablet')).toBeInTheDocument();
  });
});

describe('FaqSection', () => {
  it('renders every question as a native disclosure', () => {
    const { container } = render(<FaqSection />);
    expect(container.querySelectorAll('details')).toHaveLength(FAQ.length);
    expect(screen.getByText('Does CarePulse work offline?')).toBeInTheDocument();
  });
});
