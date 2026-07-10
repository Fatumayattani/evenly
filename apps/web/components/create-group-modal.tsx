"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { parseMoneyInput, useProductStore } from "@/lib/product-store";

export function CreateGroupModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const { createGroup } = useProductStore();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [goal, setGoal] = useState("100000");
  const [contribution, setContribution] = useState("5000");
  const [members, setMembers] = useState("");
  const [approvals, setApprovals] = useState("2");

  if (!open) return null;
  const goalMinor = parseMoneyInput(goal);
  const contributionMinor = parseMoneyInput(contribution);
  const valid = name.trim().length >= 2 && purpose.trim().length >= 4 && goalMinor > 0 && contributionMinor > 0;

  const submit = () => {
    if (!valid) return;
    const id = createGroup({
      name,
      purpose,
      goalMinor,
      contributionMinor,
      approvalsRequired: Math.max(1, Number(approvals) || 1),
      memberNames: members.split(","),
    });
    setName("");
    setPurpose("");
    setMembers("");
    onCreated(id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal-card" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={19}/></button>
        <span className="success-icon group-modal-icon"><Users size={24}/></span>
        <p className="eyebrow">New group</p>
        <h2>Coordinate money with people you trust.</h2>
        <p className="modal-copy">Set a shared outcome, recurring contribution, and approval rule. Personal income and private balances are never exposed.</p>
        <label className="field-label" htmlFor="group-name">Group name</label>
        <input id="group-name" className="text-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Studio Equipment Fund"/>
        <label className="field-label" htmlFor="group-purpose">What is the group preparing for?</label>
        <input id="group-purpose" className="text-input" value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="A clear shared outcome"/>
        <div className="form-grid">
          <div><label className="field-label" htmlFor="group-goal">Shared goal</label><div className="money-input-wrap"><span>KSh</span><input id="group-goal" value={goal} onChange={(event) => setGoal(event.target.value.replace(/[^0-9.]/g, ""))}/></div></div>
          <div><label className="field-label" htmlFor="group-contribution">Contribution</label><div className="money-input-wrap"><span>KSh</span><input id="group-contribution" value={contribution} onChange={(event) => setContribution(event.target.value.replace(/[^0-9.]/g, ""))}/></div></div>
        </div>
        <label className="field-label" htmlFor="group-members">Invite members</label>
        <input id="group-members" className="text-input" value={members} onChange={(event) => setMembers(event.target.value)} placeholder="Amina, James, Zuri"/>
        <label className="field-label" htmlFor="group-approvals">Approvals required for shared payouts</label>
        <input id="group-approvals" className="text-input" type="number" min="1" value={approvals} onChange={(event) => setApprovals(event.target.value)}/><p className="field-help">The threshold is capped at the number of initial members.</p>
        <button className="primary-button wide" onClick={submit} disabled={!valid}>Create group · {formatMoney(contributionMinor)} each cycle</button>
      </section>
    </div>
  );
}
