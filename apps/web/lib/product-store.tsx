"use client";

import { allocateIncome, clampMinor, type AllocationBucket } from "@evenly/core";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialState } from "./demo-data";
import type { ProductState, Space } from "./types";

const STORAGE_KEY = "financial-coordination-demo-v1";

type AddIncomeInput = { amountMinor: number; source: string };
export type CreateGroupInput = {
  name: string;
  purpose: string;
  goalMinor: number;
  contributionMinor: number;
  approvalsRequired: number;
  memberNames: string[];
};

interface ProductStoreValue {
  state: ProductState;
  setActiveSpace: (space: Space) => void;
  addIncome: (input: AddIncomeInput) => Record<AllocationBucket, number>;
  releasePayday: () => boolean;
  contributeToGroup: (groupId: string) => number;
  approvePayout: (groupId: string) => void;
  createGroup: (input: CreateGroupInput) => string;
  resetDemo: () => void;
  addProofActivity: (signature: string) => void;
}

const ProductStore = createContext<ProductStoreValue | null>(null);

function deepCloneInitial(): ProductState {
  return JSON.parse(JSON.stringify(initialState)) as ProductState;
}

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProductState>(deepCloneInitial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as ProductState);
    } catch {
      // Demo state remains available when storage is blocked.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const setActiveSpace = useCallback((space: Space) => {
    setState((current) => ({ ...current, activeSpace: space }));
  }, []);

  const addIncome = useCallback((input: AddIncomeInput) => {
    const result = allocateIncome(input.amountMinor, state.rules);
    setState((current) => {
      const balances = { ...current.balances };
      for (const [bucket, amount] of Object.entries(result.allocations) as [AllocationBucket, number][]) {
        balances[bucket] += amount;
      }
      const commitments = current.commitments.map((item) => {
        if (item.id === "rent") return { ...item, preparedMinor: item.preparedMinor + result.allocations.bills };
        if (item.id === "emergency") return { ...item, preparedMinor: item.preparedMinor + result.allocations.emergency };
        return item;
      });
      return {
        ...current,
        balances,
        commitments,
        activity: [
          {
            id: crypto.randomUUID(),
            type: "allocation",
            title: `${input.source || "Income"} allocated`,
            amountMinor: input.amountMinor,
            at: new Date().toISOString(),
          },
          ...current.activity,
        ],
      };
    });
    return result.allocations;
  }, [state.rules]);

  const releasePayday = useCallback(() => {
    let released = false;
    setState((current) => {
      if (current.balances.payday < current.weeklyPaydayMinor) return current;
      released = true;
      return {
        ...current,
        balances: {
          ...current.balances,
          payday: current.balances.payday - current.weeklyPaydayMinor,
          available: current.balances.available + current.weeklyPaydayMinor,
        },
        activity: [
          {
            id: crypto.randomUUID(),
            type: "payday",
            title: "Personal payday released",
            amountMinor: current.weeklyPaydayMinor,
            at: new Date().toISOString(),
          },
          ...current.activity,
        ],
      };
    });
    return released;
  }, []);

  const contributeToGroup = useCallback((groupId: string) => {
    let moved = 0;
    setState((current) => {
      const group = current.groups.find((item) => item.id === groupId);
      if (!group) return current;
      const self = group.members.find((member) => member.id === "you");
      const remaining = Math.max(0, group.contributionMinor - (self?.contributedMinor ?? 0));
      moved = Math.min(remaining, current.balances.groups);
      if (moved <= 0) return current;
      return {
        ...current,
        balances: { ...current.balances, groups: current.balances.groups - moved },
        groups: current.groups.map((item) => {
          if (item.id !== groupId) return item;
          return {
            ...item,
            treasuryMinor: item.treasuryMinor + moved,
            members: item.members.map((member) => {
              if (member.id !== "you") return member;
              const contributedMinor = member.contributedMinor + moved;
              return {
                ...member,
                contributedMinor,
                status: contributedMinor >= item.contributionMinor ? "paid" : "partial",
              };
            }),
          };
        }),
        activity: [
          {
            id: crypto.randomUUID(),
            type: "group",
            title: `Contribution sent to ${group.name}`,
            amountMinor: moved,
            at: new Date().toISOString(),
          },
          ...current.activity,
        ],
      };
    });
    return moved;
  }, []);

  const approvePayout = useCallback((groupId: string) => {
    setState((current) => ({
      ...current,
      groups: current.groups.map((group) => {
        if (group.id !== groupId || !group.payoutProposal || group.payoutProposal.executed) return group;
        const approvals = Math.min(group.approvalsRequired, group.payoutProposal.approvals + 1);
        const canExecute = approvals >= group.approvalsRequired && group.treasuryMinor >= group.payoutProposal.amountMinor;
        return {
          ...group,
          treasuryMinor: canExecute ? group.treasuryMinor - group.payoutProposal.amountMinor : group.treasuryMinor,
          payoutProposal: {
            ...group.payoutProposal,
            approvals,
            executed: canExecute,
          },
        };
      }),
    }));
  }, []);

  const createGroup = useCallback((input: CreateGroupInput) => {
    const id = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "group"}-${Date.now()}`;
    const invited = input.memberNames
      .map((name, index) => ({
        id: `member-${Date.now()}-${index}`,
        name: name.trim(),
        role: "Member",
        contributedMinor: 0,
        status: "preparing" as const,
      }))
      .filter((member) => member.name.length > 0);
    const members = [
      { id: "you", name: "You", role: "Admin", contributedMinor: 0, status: "preparing" as const },
      ...invited,
    ];
    setState((current) => ({
      ...current,
      groups: [
        {
          id,
          name: input.name.trim(),
          purpose: input.purpose.trim(),
          goalMinor: input.goalMinor,
          treasuryMinor: 0,
          contributionMinor: input.contributionMinor,
          dueDate: new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10),
          approvalsRequired: Math.min(Math.max(1, input.approvalsRequired), members.length),
          members,
        },
        ...current.groups,
      ],
    }));
    return id;
  }, []);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(deepCloneInitial());
  }, []);

  const addProofActivity = useCallback((signature: string) => {
    setState((current) => ({
      ...current,
      activity: [
        {
          id: crypto.randomUUID(),
          type: "proof",
          title: "State proof recorded on Solana Devnet",
          at: new Date().toISOString(),
          signature,
        },
        ...current.activity,
      ],
    }));
  }, []);

  const value = useMemo(
    () => ({ state, setActiveSpace, addIncome, releasePayday, contributeToGroup, approvePayout, createGroup, resetDemo, addProofActivity }),
    [state, setActiveSpace, addIncome, releasePayday, contributeToGroup, approvePayout, createGroup, resetDemo, addProofActivity],
  );

  return <ProductStore.Provider value={value}>{children}</ProductStore.Provider>;
}

export function useProductStore(): ProductStoreValue {
  const value = useContext(ProductStore);
  if (!value) throw new Error("useProductStore must be used within ProductStoreProvider");
  return value;
}

export function parseMoneyInput(value: string): number {
  const numeric = Number(value.replace(/,/g, ""));
  return clampMinor(numeric * 100);
}
