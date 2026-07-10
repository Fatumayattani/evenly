"use client";
import { useState } from "react";
import { Check, CheckCheck, ChevronRight, Clock3, Shield, Users } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/format";
import { useProductStore } from "@/lib/product-store";
import type { Group } from "@/lib/types";
import { CreateGroupModal } from "./create-group-modal";

function GroupCard({ group, onSelect }: { group: Group; onSelect: () => void }) {
  const progress = Math.min(100, (group.treasuryMinor / group.goalMinor) * 100);
  const self = group.members.find((member) => member.id === "you");
  return (
    <button className="group-card" onClick={onSelect}>
      <div className="group-card-top"><span className="group-avatar">{group.name.split(" ").map((part) => part[0]).slice(0,2).join("")}</span><span className="member-count"><Users size={14} /> {group.members.length}</span></div>
      <h3>{group.name}</h3><p>{group.purpose}</p>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="group-values"><div><small>Treasury</small><strong>{formatMoney(group.treasuryMinor)}</strong></div><div><small>Your status</small><strong className={`member-status ${self?.status}`}>{self?.status === "paid" ? "Paid" : self?.status === "partial" ? "Partial" : "Preparing"}</strong></div></div>
      <footer><span>Next due {formatDate(group.dueDate)}</span><ChevronRight size={17} /></footer>
    </button>
  );
}

function GroupDetail({ group, onClose }: { group: Group; onClose: () => void }) {
  const { state, contributeToGroup, approvePayout } = useProductStore();
  const self = group.members.find((member) => member.id === "you");
  const remaining = Math.max(0, group.contributionMinor - (self?.contributedMinor ?? 0));
  const ready = Math.min(remaining, state.balances.groups);
  return (
    <div className="detail-panel">
      <button className="text-button panel-back" onClick={onClose}>← All groups</button>
      <div className="detail-hero"><span className="group-avatar large">{group.name.split(" ").map((part) => part[0]).slice(0,2).join("")}</span><div><p className="eyebrow">Group</p><h2>{group.name}</h2><p>{group.purpose}</p></div></div>
      <div className="detail-stat-grid"><div><span>Treasury</span><strong>{formatMoney(group.treasuryMinor)}</strong></div><div><span>Goal</span><strong>{formatMoney(group.goalMinor)}</strong></div><div><span>Approvals</span><strong>{group.approvalsRequired} required</strong></div></div>
      <section className="prepared-card"><div><p className="eyebrow light">Your next commitment</p><h3>{formatMoney(ready)} prepared</h3><p>{remaining > ready ? `${formatMoney(remaining - ready)} still needed before ${formatDate(group.dueDate)}.` : "Your full contribution is ready to send."}</p></div><button className="light-button" disabled={ready <= 0} onClick={() => contributeToGroup(group.id)}>Contribute {ready > 0 ? formatMoney(ready) : ""}</button></section>
      {group.payoutProposal ? <section className="proposal-card"><div className="proposal-heading"><span><Shield size={18} /></span><div><p className="eyebrow">Treasury proposal</p><h3>{group.payoutProposal.title}</h3></div></div><dl><div><dt>Amount</dt><dd>{formatMoney(group.payoutProposal.amountMinor)}</dd></div><div><dt>Recipient</dt><dd>{group.payoutProposal.recipient}</dd></div><div><dt>Status</dt><dd>{group.payoutProposal.executed ? "Executed" : `${group.payoutProposal.approvals} of ${group.approvalsRequired} approvals`}</dd></div></dl><button className="primary-button wide" disabled={group.payoutProposal.executed} onClick={() => approvePayout(group.id)}>{group.payoutProposal.executed ? <><CheckCheck size={17}/> Executed after approval</> : <><Check size={17}/> Approve proposal</>}</button></section> : null}
      <section><div className="section-heading compact"><div><p className="eyebrow">Members</p><h2>Contribution status</h2></div></div><div className="member-list">{group.members.map((member) => <div className="member-row" key={member.id}><span className="member-avatar">{member.name.slice(0,1)}</span><div><strong>{member.name}</strong><span>{member.role}</span></div><div className="member-payment"><strong>{formatMoney(member.contributedMinor)}</strong><span className={`member-status ${member.status}`}>{member.status === "paid" ? <Check size={13}/> : <Clock3 size={13}/>} {member.status}</span></div></div>)}</div></section>
    </div>
  );
}

export function GroupsView() {
  const { state } = useProductStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const group = selected ? state.groups.find((item) => item.id === selected) : null;
  return (
    <>
      {group ? (
        <GroupDetail group={group} onClose={() => setSelected(null)} />
      ) : (
        <div className="view-stack">
          <section className="groups-intro"><div><p className="eyebrow light">Shared commitments</p><h1>Build together, without financial guesswork.</h1><p>Everyone sees what was agreed, what has been contributed, and how shared money moves. Personal finances stay personal.</p></div><div className="privacy-rule"><Shield size={19}/><span><strong>Private income.</strong> Transparent commitments.</span></div></section>
          <section><div className="section-heading"><div><p className="eyebrow">Your groups</p><h2>Money coordinated with others</h2></div><button className="primary-button" onClick={() => setCreateOpen(true)}>Create group</button></div><div className="groups-grid">{state.groups.map((item) => <GroupCard key={item.id} group={item} onSelect={() => setSelected(item.id)} />)}<button className="new-group-card" onClick={() => setCreateOpen(true)}><span>+</span><strong>Start a new group</strong><p>Choose shared savings, support, expenses, rotating payouts, or a custom plan.</p></button></div></section>
        </div>
      )}
      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={setSelected}/>
    </>
  );
}
