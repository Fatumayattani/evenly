import { createContext, useContext, ReactNode } from 'react';
import { useEmbeddedWallet } from '../hooks/useEmbeddedWallet';

interface WalletContextValue {
  address: string;
  balance: number;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useEmbeddedWallet();

  if (!wallet) {
    // Show a simple loading placeholder until wallet is ready
    return <div className="min-h-screen flex items-center justify-center">Loading wallet...</div>;
  }

  const { address, balance } = wallet;

  return (
    <WalletContext.Provider value={{ address, balance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWalletContext must be used inside WalletProvider');
  return context;
}
