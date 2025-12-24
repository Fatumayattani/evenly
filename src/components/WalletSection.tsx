import { Wallet, Copy, ExternalLink, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { useState } from 'react';

interface WalletSectionProps {
  user: User;
}

export default function WalletSection({ user }: WalletSectionProps) {
  const [copied, setCopied] = useState(false);

  const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const mockBalance = 245.67;

  const mockTransactions = [
    {
      id: '1',
      type: 'receive' as const,
      amount: 60,
      from: 'Jane Smith',
      description: 'Electricity Bill split',
      date: new Date().toISOString(),
      status: 'completed' as const,
    },
    {
      id: '2',
      type: 'send' as const,
      amount: 42.75,
      to: 'Jane Smith',
      description: 'Grocery Shopping split',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed' as const,
    },
    {
      id: '3',
      type: 'receive' as const,
      amount: 1200,
      from: 'Jane Smith',
      description: 'Monthly Rent split',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed' as const,
    },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(mockWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-500 to-accent-400 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm opacity-90">Wallet Balance</div>
            <div className="text-4xl font-bold">${mockBalance.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-xs opacity-75 mb-2">Wallet Address</div>
          <div className="flex items-center justify-between gap-4">
            <code className="text-sm font-mono">{mockWalletAddress}</code>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              title="Copy address"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Send
          </button>
          <button className="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2">
            <ArrowDownRight className="w-5 h-5" />
            Receive
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Recent Transactions</h3>
          <a
            href="#"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'receive'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {tx.type === 'receive' ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-gray-500">
                    {tx.type === 'receive' ? `From ${tx.from}` : `To ${tx.to}`} •{' '}
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    tx.type === 'receive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-xl">⚡</span>
          Powered by Movement
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your wallet uses Movement blockchain for instant, low-cost transactions. All payments are secured and transparent.
        </p>
      </div>
    </div>
  );
}
