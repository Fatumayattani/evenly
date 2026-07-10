"use client";

import { ProductStoreProvider } from "@/lib/product-store";
import { SolanaWalletProvider } from "@/lib/solana-wallet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaWalletProvider>
      <ProductStoreProvider>{children}</ProductStoreProvider>
    </SolanaWalletProvider>
  );
}
