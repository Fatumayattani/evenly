export type AllocationBucket =
  | "available"
  | "bills"
  | "payday"
  | "emergency"
  | "groups"
  | "tax";

export interface AllocationRule {
  bucket: AllocationBucket;
  label: string;
  percentage: number;
  priority: number;
}

export interface AllocationResult {
  amountMinor: number;
  allocations: Record<AllocationBucket, number>;
  unallocatedMinor: number;
}

const BUCKETS: AllocationBucket[] = [
  "available",
  "bills",
  "payday",
  "emergency",
  "groups",
  "tax",
];

export function validateRules(rules: AllocationRule[]): void {
  if (rules.length === 0) throw new Error("At least one allocation rule is required.");
  const seen = new Set<AllocationBucket>();
  let total = 0;
  for (const rule of rules) {
    if (!Number.isFinite(rule.percentage) || rule.percentage < 0 || rule.percentage > 100) {
      throw new Error(`Invalid percentage for ${rule.label}.`);
    }
    if (seen.has(rule.bucket)) throw new Error(`Duplicate bucket: ${rule.bucket}.`);
    seen.add(rule.bucket);
    total += rule.percentage;
  }
  if (Math.abs(total - 100) > 0.000001) {
    throw new Error(`Allocation rules must total 100%; received ${total}%.`);
  }
}

/**
 * Allocates integer minor units using the largest-remainder method.
 * This guarantees the resulting allocations add up exactly to the input.
 */
export function allocateIncome(amountMinor: number, rules: AllocationRule[]): AllocationResult {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error("Income must be a positive integer in minor units.");
  }
  validateRules(rules);

  const ranked = rules.map((rule) => {
    const exact = (amountMinor * rule.percentage) / 100;
    const floor = Math.floor(exact);
    return { rule, floor, remainder: exact - floor };
  });

  let distributed = ranked.reduce((sum, item) => sum + item.floor, 0);
  let leftovers = amountMinor - distributed;

  ranked.sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder;
    return a.rule.priority - b.rule.priority;
  });

  for (let i = 0; i < leftovers; i += 1) {
    const item = ranked[i % ranked.length];
    if (item) item.floor += 1;
  }

  const allocations = Object.fromEntries(BUCKETS.map((bucket) => [bucket, 0])) as Record<
    AllocationBucket,
    number
  >;
  for (const item of ranked) allocations[item.rule.bucket] = item.floor;
  distributed = Object.values(allocations).reduce((sum, value) => sum + value, 0);

  return {
    amountMinor,
    allocations,
    unallocatedMinor: amountMinor - distributed,
  };
}

export type Readiness = "ready" | "building" | "at-risk";

export function readinessStatus(
  preparedMinor: number,
  targetMinor: number,
  daysUntilDue: number,
): Readiness {
  if (targetMinor <= 0 || preparedMinor >= targetMinor) return "ready";
  const ratio = preparedMinor / targetMinor;
  if (daysUntilDue <= 3 && ratio < 0.9) return "at-risk";
  if (daysUntilDue <= 7 && ratio < 0.65) return "at-risk";
  return "building";
}

export function protectedWeeks(bufferMinor: number, weeklyPaydayMinor: number): number {
  if (weeklyPaydayMinor <= 0) return 0;
  return Math.max(0, bufferMinor / weeklyPaydayMinor);
}

export function clampMinor(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
