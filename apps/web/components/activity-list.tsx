"use client";

import { ArrowDownLeft, FileCheck2, Landmark, ReceiptText, Repeat2 } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { useProductStore } from "@/lib/product-store";

const icons = { allocation: ArrowDownLeft, group: Landmark, bill: ReceiptText, proof: FileCheck2, payday: Repeat2 };

export function ActivityList() {
  const { state } = useProductStore();
  return <section className="activity-section"><div className="section-heading compact"><div><p className="eyebrow">Activity</p><h2>Recent movement</h2></div></div><div className="activity-list">{state.activity.slice(0, 6).map((item) => { const Icon = icons[item.type]; return <div className="activity-row" key={item.id}><span className="activity-icon"><Icon size={16}/></span><div><strong>{item.title}</strong><span>{new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(item.at))}</span></div>{item.amountMinor ? <strong>{formatMoney(item.amountMinor)}</strong> : item.signature ? <a href={`https://explorer.solana.com/tx/${item.signature}?cluster=devnet`} target="_blank" rel="noreferrer">Explorer</a> : null}</div>; })}</div></section>;
}
