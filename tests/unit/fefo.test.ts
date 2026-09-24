import { describe, expect, it } from 'vitest';

import { DEMO_TODAY, PANADOL_BATCHES } from '@/data/demo';
import { planFefo, type DemoBatch } from '@/lib/fefo';

const TODAY = '2026-10-01';

describe('planFefo — mirrors the product FEFO planner', () => {
  it('matches the worked example in the product README', () => {
    const batches: DemoBatch[] = [
      { batchNumber: 'C', expiryDate: null, receivedAt: '2026-01-01', quantity: 100 },
      { batchNumber: 'B', expiryDate: '2027-06-30', receivedAt: '2026-01-01', quantity: 50 },
      { batchNumber: 'A', expiryDate: '2027-01-31', receivedAt: '2026-01-01', quantity: 20 },
    ];
    const plan = planFefo(batches, 60, TODAY);
    expect(plan.allocations.map((a) => [a.batchNumber, a.quantity])).toEqual([
      ['A', 20],
      ['B', 40],
    ]);
    expect(plan.order).toEqual(['A', 'B', 'C']);
    expect(plan.fulfillable).toBe(true);
  });

  it('never allocates expired or quarantined batches', () => {
    const batches: DemoBatch[] = [
      { batchNumber: 'OLD', expiryDate: '2026-09-30', receivedAt: '2025-01-01', quantity: 500 },
      { batchNumber: 'HOLD', expiryDate: '2026-11-01', receivedAt: '2025-01-01', quantity: 500, isQuarantined: true },
      { batchNumber: 'OK', expiryDate: '2027-01-01', receivedAt: '2025-01-01', quantity: 10 },
    ];
    const plan = planFefo(batches, 30, TODAY);
    expect(plan.allocations).toEqual([{ batchNumber: 'OK', quantity: 10, availableBefore: 10, balanceAfter: 0 }]);
    expect(plan.excluded).toEqual([
      { batchNumber: 'OLD', reason: 'EXPIRED' },
      { batchNumber: 'HOLD', reason: 'QUARANTINED' },
    ]);
    expect(plan.shortfall).toBe(20);
    expect(plan.fulfillable).toBe(false);
  });

  it('treats a batch expiring today as still sellable', () => {
    const plan = planFefo([{ batchNumber: 'T', expiryDate: TODAY, receivedAt: '2025-01-01', quantity: 5 }], 5, TODAY);
    expect(plan.fulfillable).toBe(true);
  });

  it('puts no-expiry stock last and breaks ties by date received (FIFO)', () => {
    const batches: DemoBatch[] = [
      { batchNumber: 'N2', expiryDate: null, receivedAt: '2026-03-01', quantity: 5 },
      { batchNumber: 'N1', expiryDate: null, receivedAt: '2026-02-01', quantity: 5 },
      { batchNumber: 'E', expiryDate: '2030-01-01', receivedAt: '2026-04-01', quantity: 5 },
    ];
    expect(planFefo(batches, 12, TODAY).order).toEqual(['E', 'N1', 'N2']);
  });

  it('produces the allocation shown on the website: 2 Box of Panadol', () => {
    const plan = planFefo(PANADOL_BATCHES, 200, DEMO_TODAY);
    expect(plan.allocations.map((a) => [a.batchNumber, a.quantity, a.balanceAfter])).toEqual([
      ['PAN-2401', 120, 0],
      ['PAN-2402', 80, 220],
    ]);
  });
});
