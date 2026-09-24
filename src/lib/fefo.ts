/**
 * A faithful, dependency-free port of the product's FEFO planner
 * (apps/api/src/modules/inventory/fefo.service.ts) so the interactive demo on
 * the Inventory section behaves exactly like CarePulse does:
 *
 *  - candidates are ordered `expiryDate ASC NULLS LAST`, then `receivedAt ASC`
 *  - expired batches (expiry before today) are never allocated
 *  - quarantined batches are never allocated
 *  - a request is filled batch by batch; anything left over is a shortfall
 */

export interface DemoBatch {
  batchNumber: string;
  /** ISO date (yyyy-mm-dd), or null for goods that do not expire. */
  expiryDate: string | null;
  receivedAt: string;
  quantity: number;
  isQuarantined?: boolean;
  quarantineReason?: string;
}

export type ExclusionReason = 'EXPIRED' | 'QUARANTINED';

export interface BatchAllocation {
  batchNumber: string;
  quantity: number;
  availableBefore: number;
  balanceAfter: number;
}

export interface AllocationPlan {
  requested: number;
  allocated: number;
  shortfall: number;
  fulfillable: boolean;
  allocations: BatchAllocation[];
  /** Candidate order after sorting — the order FEFO walks the shelf in. */
  order: string[];
  excluded: Array<{ batchNumber: string; reason: ExclusionReason }>;
}

export function exclusionReason(batch: DemoBatch, today: string): ExclusionReason | null {
  if (batch.isQuarantined) return 'QUARANTINED';
  if (batch.expiryDate !== null && batch.expiryDate < today) return 'EXPIRED';
  return null;
}

export function compareFefo(a: DemoBatch, b: DemoBatch): number {
  if (a.expiryDate !== b.expiryDate) {
    if (a.expiryDate === null) return 1;
    if (b.expiryDate === null) return -1;
    return a.expiryDate < b.expiryDate ? -1 : 1;
  }
  if (a.receivedAt === b.receivedAt) return 0;
  return a.receivedAt < b.receivedAt ? -1 : 1;
}

export function planFefo(batches: DemoBatch[], requested: number, today: string): AllocationPlan {
  const excluded: AllocationPlan['excluded'] = [];
  const candidates: DemoBatch[] = [];

  for (const batch of batches) {
    const reason = exclusionReason(batch, today);
    if (reason) excluded.push({ batchNumber: batch.batchNumber, reason });
    else if (batch.quantity > 0) candidates.push(batch);
  }

  candidates.sort(compareFefo);

  const allocations: BatchAllocation[] = [];
  let remaining = Math.max(0, requested);

  for (const batch of candidates) {
    if (remaining <= 0) break;
    const take = Math.min(batch.quantity, remaining);
    allocations.push({
      batchNumber: batch.batchNumber,
      quantity: take,
      availableBefore: batch.quantity,
      balanceAfter: batch.quantity - take,
    });
    remaining -= take;
  }

  const safeRequested = Math.max(0, requested);
  return {
    requested: safeRequested,
    allocated: safeRequested - remaining,
    shortfall: remaining,
    fulfillable: remaining <= 0,
    allocations,
    order: candidates.map((b) => b.batchNumber),
    excluded,
  };
}
