"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { AllocationBucket } from "@evenly/core";
import { formatMoney } from "@/lib/format";
import { parseMoneyInput, useProductStore } from "@/lib/product-store";

const labels: Record<AllocationBucket, string> = {
  available: "Available now",
  bills: "Bills",
  payday: "Personal payday",
  emergency: "Emergency",
  groups: "Group commitments",
  tax: "Tax reserve",
};

export function AddIncomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, addIncome } = useProductStore();
  const [amount, setAmount] = useState("60000");
  const [source, setSource] = useState("Design client");
  const [result, setResult] = useState<Record<AllocationBucket, number> | null>(null);
  const amountMinor = useMemo(() => parseMoneyInput(amount), [amount]);

  if (!open) return null;

  const submit = () => {
    if (amountMinor <= 0) return;
    setResult(addIncome({ amountMinor, source }));
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal-card" onMouseDown={(event) => event.stopPropagation()} aria-modal="true" role="dialog">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
        {!result ? (
          <>
            <p className="eyebrow">New income</p>
            <h2>Prepare what matters first.</h2>
            <p className="modal-copy">This demo applies your current allocation rules immediately. Nothing is moved onchain until you authorize it.</p>
            <label className="field-label" htmlFor="source">Source</label>
            <input id="source" className="text-input" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Client or income source" />
            <label className="field-label" htmlFor="amount">Amount received</label>
            <div className="money-input-wrap"><span>KSh</span><input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} /></div>
            <div className="rule-preview">
              {state.rules.map((rule) => (
                <div key={rule.bucket}><span>{rule.label}</span><strong>{rule.percentage}%</strong></div>
              ))}
            </div>
            <button className="primary-button wide" onClick={submit} disabled={amountMinor <= 0}>Allocate {formatMoney(amountMinor)} <ArrowRight size={17} /></button>
          </>
        ) : (
          <div className="success-view">
            <span className="success-icon"><Check size={25} /></span>
            <p className="eyebrow">Allocation complete</p>
            <h2>Every shilling has a job.</h2>
            <div className="allocation-results">
              {(Object.entries(result) as [AllocationBucket, number][]).map(([bucket, value]) => (
                <div key={bucket}><span>{labels[bucket]}</span><strong>{formatMoney(value)}</strong></div>
              ))}
            </div>
            <button className="primary-button wide" onClick={() => { setResult(null); onClose(); }}>View updated plan</button>
          </div>
        )}
      </section>
    </div>
  );
}
