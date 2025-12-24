import { Plus, Home, Wallet, Settings, LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { User, Expense } from '../types';
import ExpenseCard from './ExpenseCard';
import { useState } from 'react';
import AddExpenseModal from './AddExpenseModal';
import WalletSection from './WalletSection';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'wallet'>('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Monthly Rent',
      amount: 2400,
      category: 'rent',
      paidBy: user,
      splitWith: [user, { id: '2', email: 'jane@example.com', name: 'Jane Smith' }],
      date: new Date().toISOString(),
      status: 'settled',
      householdId: '1',
    },
    {
      id: '2',
      title: 'Electricity Bill',
      amount: 120,
      category: 'utilities',
      paidBy: { id: '2', email: 'jane@example.com', name: 'Jane Smith' },
      splitWith: [user, { id: '2', email: 'jane@example.com', name: 'Jane Smith' }],
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'settled',
      householdId: '1',
    },
    {
      id: '3',
      title: 'Grocery Shopping',
      amount: 85.50,
      category: 'groceries',
      paidBy: user,
      splitWith: [user, { id: '2', email: 'jane@example.com', name: 'Jane Smith' }],
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'settled',
      householdId: '1',
    },
  ]);

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'paidBy' | 'date' | 'status' | 'householdId'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      paidBy: user,
      date: new Date().toISOString(),
      status: 'settled',
      householdId: '1',
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddExpense(false);
  };

  const totalPaid = expenses
    .filter(e => e.paidBy.id === user.id)
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOwed = expenses
    .filter(e => e.paidBy.id !== user.id)
    .reduce((sum, e) => sum + (e.amount / e.splitWith.length), 0);

  const balance = totalPaid - totalOwed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Evenly
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">You Paid</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalPaid.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">You Owe</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalOwed.toFixed(2)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-accent-400 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium opacity-90">Balance</span>
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold">
              {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              activeTab === 'expenses'
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="ml-auto px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {activeTab === 'expenses' ? (
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first shared expense</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add First Expense
                </button>
              </div>
            ) : (
              expenses.map(expense => (
                <ExpenseCard key={expense.id} expense={expense} currentUser={user} />
              ))
            )}
          </div>
        ) : (
          <WalletSection user={user} />
        )}
      </main>

      {showAddExpense && (
        <AddExpenseModal
          onClose={() => setShowAddExpense(false)}
          onAdd={handleAddExpense}
          currentUser={user}
        />
      )}
    </div>
  );
}
