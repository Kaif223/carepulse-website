import { BarChart3, Boxes, Receipt, Truck, Users, Wallet, type LucideIcon } from 'lucide-react';

export interface SystemNode {
  id: 'sales' | 'inventory' | 'purchasing' | 'customers' | 'finance' | 'reports';
  label: string;
  icon: LucideIcon;
  /** What this module contributes to the shared record — each line is a real product behaviour. */
  role: string;
  /** Position in the 720×560 diagram. */
  x: number;
  y: number;
  /** Where the node sits before the system connects it (px offset). */
  scatter: { x: number; y: number };
  /** The event this module records during the credit-sale walkthrough, if any. */
  event?: string;
}

export const SYSTEM_VIEWBOX = { width: 720, height: 560 } as const;
export const SYSTEM_CORE = { x: 360, y: 280 } as const;

export const SYSTEM_NODES: SystemNode[] = [
  { id: 'sales', label: 'Sales', icon: Receipt, role: 'POS, held sales, returns', x: 112, y: 104, scatter: { x: -46, y: -34 }, event: 'SALE 1,000.00' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, role: 'Batches, expiry, FEFO', x: 360, y: 58, scatter: { x: 30, y: -48 }, event: 'MOVEMENT · FEFO' },
  { id: 'purchasing', label: 'Purchasing', icon: Truck, role: 'Receipts, returns, supplier ledger', x: 608, y: 104, scatter: { x: 56, y: -22 } },
  { id: 'customers', label: 'Customers', icon: Users, role: 'Credit limits, ledger, payments', x: 112, y: 456, scatter: { x: -52, y: 30 }, event: 'DEBIT 600.00' },
  { id: 'finance', label: 'Finance', icon: Wallet, role: 'Cash shifts, expenses, transactions', x: 608, y: 456, scatter: { x: 48, y: 40 }, event: 'CASH_IN 400.00' },
  { id: 'reports', label: 'Reports', icon: BarChart3, role: 'Cash summary, expense breakdown', x: 360, y: 504, scatter: { x: -24, y: 54 }, event: 'CASH SUMMARY' },
];

/** A gentle curve from the core to a node, bowing away from the centre line. */
export function linkPath(node: Pick<SystemNode, 'x' | 'y'>): string {
  const { x: cx, y: cy } = SYSTEM_CORE;
  const mx = (cx + node.x) / 2;
  const my = (cy + node.y) / 2;
  // Offset the control point perpendicular to the link for a soft arc.
  const dx = node.x - cx;
  const dy = node.y - cy;
  const length = Math.hypot(dx, dy) || 1;
  const bow = 0.12 * length;
  const qx = mx + (-dy / length) * bow;
  const qy = my + (dx / length) * bow;
  return `M ${cx} ${cy} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${node.x} ${node.y}`;
}

export const SYSTEM_STEPS = [
  {
    title: 'Most stores run on separate records.',
    body: 'A till, a stock register, a supplier file, a credit notebook and a cash book. Each one is right on its own — and they rarely agree at the end of the month.',
  },
  {
    title: 'CarePulse makes them one system.',
    body: 'Sales, inventory, purchasing, customers, finance and reporting share one database and one set of rules, scoped to the branch they happen at.',
  },
  {
    title: 'One action updates every record it touches.',
    body: 'A credit sale takes stock from the right batch, adds the unpaid remainder to the customer’s ledger and posts the cash to the open shift — in a single transaction that either fully happens or doesn’t happen at all.',
  },
] as const;
