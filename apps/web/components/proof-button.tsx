"use client";

import { useState } from "react";
import { ExternalLink, FileCheck2, LoaderCircle } from "lucide-react";
import { useProductStore } from "@/lib/product-store";
import { useSolanaWallet } from "@/lib/solana-wallet";

export function ProofButton() {
  const { state, addProofActivity } = useProductStore();
  const { isConnected, sendMemo } = useSolanaWallet();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [signature, setSignature] = useState("");

  const record = async () => {
    if (!isConnected) return;
    setStatus("sending");
    try {
      const snapshot = JSON.stringify({
        v: 1,
        balances: state.balances,
        groups: state.groups.map((group) => ({ id: group.id, treasury: group.treasuryMinor })),
        at: new Date().toISOString(),
      });
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(snapshot));
      const hash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      const sig = await sendMemo(`coordination:v1:${hash}`);
      setSignature(sig);
      addProofActivity(sig);
      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "done" && signature) {
    return (
      <a className="proof-link" href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} target="_blank" rel="noreferrer">
        <FileCheck2 size={16} /> Proof recorded <ExternalLink size={14} />
      </a>
    );
  }

  return (
    <button className="secondary-button" onClick={record} disabled={!isConnected || status === "sending"} title={!isConnected ? "Connect your Solana wallet first" : "Record a compact state fingerprint on Devnet"}>
      {status === "sending" ? <LoaderCircle className="spin" size={16} /> : <FileCheck2 size={16} />}
      {status === "sending" ? "Recording…" : status === "error" ? "Try proof again" : "Record Solana proof"}
    </button>
  );
}
