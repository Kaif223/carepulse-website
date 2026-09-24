/**
 * Default role capabilities, derived from the grants and denies of the roles
 * the product seeds (packages/database/prisma/seed.ts → ROLES). Each column is
 * one real permission code.
 */
export const ROLE_COLUMNS = [
  { key: 'sell', label: 'Sell at the POS', code: 'sale.create' },
  { key: 'discount', label: 'Approve discounts over the limit', code: 'sale.discount.approve' },
  { key: 'fefo', label: 'Override FEFO', code: 'sale.fefo.override' },
  { key: 'adjust', label: 'Approve stock adjustments', code: 'adjustment.approve' },
  { key: 'cash', label: 'Expenses & cash reports', code: 'report.cash' },
  { key: 'audit', label: 'Read the audit log', code: 'auditlog.read' },
] as const;

type ColumnKey = (typeof ROLE_COLUMNS)[number]['key'];

export const ROLE_MATRIX: Array<{ role: string; summary: string; grants: ColumnKey[] }> = [
  { role: 'Admin', summary: 'Full system access', grants: ['sell', 'discount', 'fefo', 'adjust', 'cash', 'audit'] },
  { role: 'Manager', summary: 'Runs a branch', grants: ['sell', 'discount', 'fefo', 'adjust', 'cash', 'audit'] },
  { role: 'Pharmacist', summary: 'Dispensing and batch control', grants: ['sell', 'fefo'] },
  { role: 'Cashier', summary: 'POS and cash drawer', grants: ['sell'] },
  { role: 'Accountant', summary: 'Finance, ledgers, reporting', grants: ['cash', 'audit'] },
];

/** Only actions the API actually writes to the audit log. */
export const AUDIT_EVENTS = [
  { time: '09:02:14', action: 'LOGIN', actor: 'cashier · LHR', detail: 'Signed in' },
  { time: '10:17:40', action: 'FEFO_OVERRIDE', actor: 'pharmacist · LHR', detail: 'Batch CAL-2402 chosen over CAL-2401' },
  { time: '12:33:05', action: 'STOCK_ADJUSTMENT', actor: 'manager · LHR', detail: 'LHR-ADJ-2026-000012 approved · DAMAGE' },
  { time: '15:48:21', action: 'SALE_CANCELLATION', actor: 'manager · LHR', detail: 'LHR-2026-000480 · stock returned to its batches' },
  { time: '21:04:57', action: 'CASH_SHIFT_VARIANCE', actor: 'cashier · LHR', detail: 'Variance −150.00 · reason recorded' },
] as const;

export const CONTROLS = [
  {
    title: 'Sessions built for a shift',
    body: 'Secure, HTTP-only session cookies that expire after eight hours by default. Permissions are re-read on every request, so revoking one takes effect immediately.',
  },
  {
    title: 'Sign-in protection',
    body: 'Rate-limited sign-in, account lockout after repeated failures, and the same error message for every failure so accounts can’t be probed.',
  },
  {
    title: 'History that can’t be rewritten',
    body: 'Stock movements, ledgers, financial transactions and the audit log are append-only — the application’s database role is not allowed to update or delete them.',
  },
  {
    title: 'Approvals where money or stock moves',
    body: 'Discounts above the branch limit, stock adjustments and returns each require a user with the matching approval permission.',
  },
] as const;
