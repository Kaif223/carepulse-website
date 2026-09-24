/**
 * Sample data for the recreated product UI.
 *
 * Products, packaging levels, prices, branches, suppliers and customers are
 * taken from the product's own development seed
 * (packages/database/prisma/seed.ts), which uses fictional trading entities.
 * Document-number formats (LHR-2026-000482, LHR-PUR-…, TRF-…) follow the
 * application's DocumentNumberService. Nothing here is a real customer or a
 * real business result.
 */

import type { DemoBatch } from '@/lib/fefo';

export const DEMO_BRANCH = { code: 'LHR', name: 'Lahore Main Pharmacy' } as const;

export const BRANCHES = [
  { code: 'LHR', name: 'Lahore Main Pharmacy', type: 'Retail', city: 'Lahore' },
  { code: 'KHI', name: 'Karachi Clifton Pharmacy', type: 'Retail', city: 'Karachi' },
  { code: 'CWH', name: 'Central Warehouse — Lahore', type: 'Warehouse', city: 'Lahore' },
] as const;

/** A fixed "today" so expiry states in the demo never drift with the calendar. */
export const DEMO_TODAY = '2026-10-01';

export interface DemoUnit {
  name: string;
  abbreviation: string;
  conversionFactor: number;
  sellingPrice: number;
  isSaleDefault?: boolean;
}

export const PANADOL = {
  name: 'Panadol 500mg Tablet',
  code: 'MED-PAN-500T',
  baseUnit: 'Tablet',
  units: [
    { name: 'Tablet', abbreviation: 'Tab', conversionFactor: 1, sellingPrice: 3.5, isSaleDefault: true },
    { name: 'Strip', abbreviation: 'Strip', conversionFactor: 10, sellingPrice: 32 },
    { name: 'Box', abbreviation: 'Box', conversionFactor: 100, sellingPrice: 310 },
  ] satisfies DemoUnit[],
};

export const PANADOL_BATCHES: DemoBatch[] = [
  { batchNumber: 'PAN-2398', expiryDate: '2026-09-12', receivedAt: '2025-09-02', quantity: 40 },
  { batchNumber: 'PAN-2402', expiryDate: '2027-06-30', receivedAt: '2026-07-14', quantity: 300 },
  { batchNumber: 'PAN-2401', expiryDate: '2027-01-31', receivedAt: '2026-05-03', quantity: 120 },
  {
    batchNumber: 'PAN-2399',
    expiryDate: '2027-03-31',
    receivedAt: '2026-04-20',
    quantity: 80,
    isQuarantined: true,
    quarantineReason: 'Recall hold',
  },
  { batchNumber: 'PAN-2403', expiryDate: '2028-03-31', receivedAt: '2026-09-11', quantity: 500 },
];

export interface CartLineDemo {
  product: string;
  unit: string;
  quantity: number;
  price: number;
}

export const POS_CART: CartLineDemo[] = [
  { product: 'Panadol 500mg Tablet', unit: 'Strip', quantity: 2, price: 32 },
  { product: 'Calpol Syrup 120ml', unit: 'Bottle', quantity: 1, price: 165 },
  { product: 'ORS Orange Sachet', unit: 'Sachet', quantity: 4, price: 25 },
];

export const POS_DISCOUNT_PERCENT = 5;
export const POS_CASH_RECEIVED = 500;
export const POS_INVOICE = 'LHR-2026-000482';

export function posTotals() {
  const subtotal = POS_CART.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const discount = Math.round(subtotal * POS_DISCOUNT_PERCENT) / 100;
  const grandTotal = Math.round((subtotal - discount) * 100) / 100;
  const change = Math.round((POS_CASH_RECEIVED - grandTotal) * 100) / 100;
  return { subtotal, discount, tax: 0, grandTotal, change };
}

export const SUPPLIER = { name: 'Shifa Distributors' } as const;
export const PURCHASE_NUMBER = 'LHR-PUR-2026-000042';
export const TRANSFER_NUMBER = 'TRF-2026-000017';

export const CUSTOMER = { name: 'Fatima Khan', creditLimit: 50000 } as const;

export const SEEDED_ROLES = [
  { name: 'Admin', description: 'Full system access, including users, roles and settings' },
  { name: 'Manager', description: 'Runs a branch: full operations, reporting and approvals' },
  { name: 'Pharmacist', description: 'Dispensing, batch control and inventory operations' },
  { name: 'Cashier', description: 'Point of sale and cash drawer only' },
  { name: 'Accountant', description: 'Finance, ledgers and reporting; read-only on operations' },
] as const;

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Salaries & Wages',
  'Transport & Delivery',
  'Repairs & Maintenance',
  'Bank Charges',
] as const;
