import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from '@/components/navigation/SiteHeader';
import { primaryNav } from '@/data/navigation';

describe('SiteHeader', () => {
  it('only links to chapters that exist on the page', () => {
    render(<SiteHeader />);
    for (const item of primaryNav) {
      expect(item.href).toMatch(/^#[a-z-]+$/);
    }
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText(/pricing/i)).not.toBeInTheDocument();
  });

  it('opens and closes the mobile menu from the keyboard', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Close menu');
    const menu = document.getElementById(toggle.getAttribute('aria-controls')!);
    expect(menu).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('offers a skip link to the main content', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});
