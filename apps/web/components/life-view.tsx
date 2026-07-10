"use client";

import { CalendarDays, ChevronRight, Home, ShieldCheck, Sparkles, WalletCards, Wifi } from "lucide-react";
import { protectedWeeks, readinessStatus } from "@evenly/core";
import { daysUntil, formatDate, formatMoney } from "@/lib/format";
import { useProductStore } from "@/lib/product-store";
import type { Commitment } from "@/lib/types";

const iconMap = { home: Home, wifi: Wifi, shield: ShieldCheck, goal: Sparkles };

function CommitmentCard({ commitment }: { commitment: Commitment }) {
  const Icon = iconMap[commitment.icon];
  const days = daysUntil(commitment.dueDate);
  const status = readinessStatus(commitment.preparedMinor, commitment.targetMinor, days);
  const progress = Math.min(100, (commitment.preparedMinor / commitment.targetMinor) * 100);
  const statusLabel = status === "at-risk" ? "At risk" : status === "ready" ? "Ready" : "Building";
  return (
    <article className="commitment-card">
      <div className="commitment-top">
        <span className="commitment-icon"><Icon size={19} /></span>
        <span className={`status-pill ${status}`}>{statusLabel}</span>
      </div>
      <div>
        <h3>{commitment.title}</h3>
        <p>{commitment.subtitle}</p>
      </div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="commitment-values">
        <strong>{formatMoney(commitment.preparedMinor)}</strong>
        <span>of {formatMoney(commitment.targetMinor)}</span>
      </div>
      <footer>
        <span><CalendarDays size={14} /> {status === "ready" ? `Ready before ${formatDate(commitment.dueDate)}` : `${days} days left`}</span>
        {commitment.sharedWith.length ? <span>Shared with {commitment.sharedWith.length}</span> : null}
      </footer>
    </article>
  );
}

export function LifeView({ onAddIncome }: { onAddIncome: () => void }) {
  const { state, releasePayday, setActiveSpace } = useProductStore();
  const weeks = protectedWeeks(state.balances.payday, state.weeklyPaydayMinor);
  return (
    <div className="view-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow light">Your financial runway</p>
          <h1>{weeks.toFixed(1)} weeks protected</h1>
          <p>Your next {Math.floor(weeks)} personal paydays are already backed by money you own.</p>
          <div className="hero-actions">
            <button className="light-button" onClick={onAddIncome}>Add income</button>
            <button className="ghost-light-button" onClick={() => releasePayday()}>Release payday</button>
          </div>
        </div>
        <div className="payday-orbit">
          <div className="orbit-ring"><span /></div>
          <div className="orbit-center"><small>Next payday</small><strong>{formatMoney(state.weeklyPaydayMinor)}</strong><span>Friday</span></div>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="metric-card"><span className="metric-icon"><WalletCards size={19} /></span><div><p>Available today</p><strong>{formatMoney(state.balances.available)}</strong></div><span className="metric-note">Safe to spend</span></article>
        <article className="metric-card"><span className="metric-icon warm"><ShieldCheck size={19} /></span><div><p>Emergency reserve</p><strong>{formatMoney(state.balances.emergency)}</strong></div><span className="metric-note">Building steadily</span></article>
        <button className="metric-card group-metric" onClick={() => setActiveSpace("groups")}><span className="metric-icon dark"><Sparkles size={19} /></span><div><p>Group money prepared</p><strong>{formatMoney(state.balances.groups)}</strong></div><span className="metric-note">View commitments <ChevronRight size={14} /></span></button>
      </section>

      <section>
        <div className="section-heading"><div><p className="eyebrow">Life commitments</p><h2>What needs to be ready</h2></div><button className="text-button">Manage plan <ChevronRight size={16} /></button></div>
        <div className="commitments-grid">{state.commitments.map((item) => <CommitmentCard key={item.id} commitment={item} />)}</div>
      </section>

      <section className="allocation-card">
        <div><p className="eyebrow">Automatic readiness</p><h2>Your current allocation rule</h2><p>Each incoming payment is divided before it becomes easy to spend.</p></div>
        <div className="allocation-bars">
          {state.rules.map((rule) => <div key={rule.bucket} className="allocation-row"><span>{rule.label}</span><div><i style={{ width: `${rule.percentage}%` }} /></div><strong>{rule.percentage}%</strong></div>)}
        </div>
      </section>
    </div>
  );
}
