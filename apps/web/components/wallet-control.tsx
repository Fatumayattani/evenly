"use client";

import { LoaderCircle, LogOut, Wallet } from "lucide-react";
import { shortAddress } from "@/lib/format";
import { useSolanaWallet } from "@/lib/solana-wallet";

export function WalletControl() {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useSolanaWallet();

  if (isConnected && address) {
    return (
      <button className="wallet-button connected" onClick={disconnect} title="Disconnect Solana wallet">
        <span className="status-dot" />
        <span>{shortAddress(address)}</span>
        <LogOut size={15} />
      </button>
    );
  }

  return (
    <div className="wallet-wrap">
      <button className="wallet-button" onClick={connect} disabled={isConnecting}>
        {isConnecting ? <LoaderCircle className="spin" size={16} /> : <Wallet size={16} />}
        {isConnecting ? "Connecting…" : "Connect wallet"}
      </button>
      {error ? <span className="wallet-error">{error}</span> : null}
    </div>
  );
}
