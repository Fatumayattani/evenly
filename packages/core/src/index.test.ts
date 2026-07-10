import { describe, expect, it } from "vitest";
import { allocateIncome, protectedWeeks, readinessStatus, type AllocationRule } from "./index";

const rules: AllocationRule[] = [
  { bucket: "available", label: "Available", percentage: 40, priority: 1 },
  { bucket: "bills", label: "Bills", percentage: 20, priority: 2 },
  { bucket: "payday", label: "Payday", percentage: 15, priority: 3 },
  { bucket: "emergency", label: "Emergency", percentage: 10, priority: 4 },
  { bucket: "groups", label: "Groups", percentage: 10, priority: 5 },
  { bucket: "tax", label: "Tax", percentage: 5, priority: 6 },
];

describe("allocateIncome", () => {
  it("preserves every minor unit", () => {
    const result = allocateIncome(10_001, rules);
    expect(Object.values(result.allocations).reduce((sum, n) => sum + n, 0)).toBe(10_001);
    expect(result.unallocatedMinor).toBe(0);
  });

  it("rejects rules that do not total 100", () => {
    expect(() => allocateIncome(100, rules.slice(0, 2))).toThrow(/100%/);
  });
});

describe("readiness", () => {
  it("marks fully funded commitments ready", () => {
    expect(readinessStatus(5_000, 5_000, 1)).toBe("ready");
  });
  it("marks a near-term low-funded commitment at risk", () => {
    expect(readinessStatus(2_000, 5_000, 3)).toBe("at-risk");
  });
});

describe("protectedWeeks", () => {
  it("returns fractional weeks", () => {
    expect(protectedWeeks(43_000, 10_000)).toBe(4.3);
  });
});
