import type { AllocationBucket, AllocationRule } from "@evenly/core";

export type Space = "life" | "groups";

export interface Commitment {
  id: string;
  title: string;
  subtitle: string;
  targetMinor: number;
  preparedMinor: number;
  dueDate: string;
  icon: "home" | "wifi" | "shield" | "goal";
  sharedWith: string[];
}

export interface GroupMember {
  id: string;
  name: string;
  role: string;
  contributedMinor: number;
  status: "paid" | "partial" | "preparing";
}

export interface PayoutProposal {
  id: string;
  title: string;
  recipient: string;
  amountMinor: number;
  approvals: number;
  executed: boolean;
}

export interface Group {
  id: string;
  name: string;
  purpose: string;
  goalMinor: number;
  treasuryMinor: number;
  contributionMinor: number;
  dueDate: string;
  approvalsRequired: number;
  members: GroupMember[];
  payoutProposal?: PayoutProposal;
}

export interface Activity {
  id: string;
  type: "allocation" | "group" | "bill" | "proof" | "payday";
  title: string;
  amountMinor?: number;
  at: string;
  signature?: string;
}

export interface ProductState {
  activeSpace: Space;
  currency: "KES";
  rules: AllocationRule[];
  balances: Record<AllocationBucket, number>;
  weeklyPaydayMinor: number;
  commitments: Commitment[];
  groups: Group[];
  activity: Activity[];
}
