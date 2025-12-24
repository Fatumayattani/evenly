import { X, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { User, Expense } from '../types';

interface AddExpenseModalProps {
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id' | 'paidBy' | 'date' | 'status' | 'householdId'>) => void;
  currentUser: User;
}

const categories: Array<{ value: Expense['category']; label: string; icon: string }> = [
  { value: 'rent', label: 'Rent', icon: '🏠' },
  { value: 'utilities', label: 'Utilities', icon: '⚡' },
  { value: 'groceries', label: 'Groceries', icon: '🛒' },
  { value: 'subscriptions', label: 'Subscriptions', icon: '📱' },
  { value: 'other', label: 'Other', icon: '💰' },
];

export default function AddExpenseModal({ onClose, onAdd, currentUser }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('other');

  const mockRoommates = [
    currentUser,
    { id: '2', email: 'jane@example.com', name: 'Jane Smith' },
  ];

  const [selectedMembers, setSelectedMembers] = useState<User[]>(mockRoommates);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && amount && selectedMembers.length > 0) {
      onAdd({
        title,
        amount: parseFloat(amount),
        category,
        splitWith: selectedMembers,
      });
    }
  };

  const toggleMember = (member: User) => {
    if (selectedMembers.find(m => m.id === member.id)) {
      if (selectedMembers.length > 1) {
        setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
      }
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const splitAmount = selectedMembers.length > 0 ? parseFloat(amount || '0') / selectedMembers.length : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-3xl font-bold mb-2">Add Expense</h2>
        <p className="text-gray-600 mb-6">Split a new expense with your household</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Monthly Rent, Grocery Shopping"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category === cat.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Split With
            </label>
            <div className="space-y-2">
              {mockRoommates.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    selectedMembers.find(m => m.id === member.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                  {selectedMembers.find(m => m.id === member.id) && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {amount && selectedMembers.length > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Each person pays</div>
              <div className="text-2xl font-bold text-gray-900">
                ${splitAmount.toFixed(2)}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Add & Split Expense
          </button>
        </form>
      </div>
    </div>
  );
}
