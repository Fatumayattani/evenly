import { useWallets, useCreateWallet } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export function useEmbeddedWallet() {
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    async function setupWallet() {
      if (wallets && wallets.length > 0) {
        setWallet(wallets[0]); // use existing wallet
      } else {
        try {
          const newWallet = await createWallet();
          setWallet(newWallet);
        } catch (err: any) {
          // If wallet already exists, just use it
          if (err.message.includes("already has an embedded wallet")) {
            setWallet(wallets[0] ?? null);
          } else {
            console.error("Failed to create wallet:", err);
          }
        }
      }
    }

    setupWallet();
  }, [wallets, createWallet]);

  return wallet;
}
