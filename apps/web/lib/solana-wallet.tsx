"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

type BrowserWalletProvider = {
  isConnected?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(transaction: Transaction): Promise<{ signature: string } | string>;
};

declare global {
  interface Window {
    solana?: BrowserWalletProvider;
  }
}

interface WalletContextValue {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMemo: (memo: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const provider = window.solana;
    if (provider?.isConnected && provider.publicKey) setAddress(provider.publicKey.toString());
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const provider = window.solana;
      if (!provider) throw new Error("No Solana browser wallet found. Install Phantom or another compatible wallet.");
      const response = await provider.connect();
      setAddress(response.publicKey.toString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wallet connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await window.solana?.disconnect();
    setAddress(null);
  }, []);

  const sendMemo = useCallback(async (memo: string) => {
    const provider = window.solana;
    if (!provider || !address) throw new Error("Connect a Solana wallet first.");
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
    const connection = new Connection(rpcUrl, "confirmed");
    const memoProgram = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
    const instruction = new TransactionInstruction({
      keys: [],
      programId: memoProgram,
      data: Buffer.from(memo, "utf8"),
    });
    const latest = await connection.getLatestBlockhash("confirmed");
    const transaction = new Transaction({
      feePayer: new PublicKey(address),
      recentBlockhash: latest.blockhash,
    }).add(instruction);
    const response = await provider.signAndSendTransaction(transaction);
    const signature = typeof response === "string" ? response : response.signature;
    await connection.confirmTransaction({ signature, ...latest }, "confirmed");
    return signature;
  }, [address]);

  const value = useMemo(() => ({
    address,
    isConnected: Boolean(address),
    isConnecting,
    error,
    connect,
    disconnect,
    sendMemo,
  }), [address, isConnecting, error, connect, disconnect, sendMemo]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useSolanaWallet(): WalletContextValue {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useSolanaWallet must be used inside SolanaWalletProvider");
  return value;
}
