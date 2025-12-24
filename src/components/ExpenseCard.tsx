import { Receipt, Users, Check } from 'lucide-react';
import { Expense, User } from '../types';

interface ExpenseCardProps {
  expense: Expense;
  currentUser: User;
}

const categoryColors = {
  rent: 'from-blue-500 to-blue-600',
  utilities: 'from-green-500 to-green-600',
  groceries: 'from-orange-500 to-orange-600',
  subscriptions: 'from-purple-500 to-purple-600',
  other: 'from-gray-500 to-gray-600',
};

const categoryIcons = {
  rent: '🏠',
  utilities: '⚡',
  groceries: '🛒',
  subscriptions: '📱',
  other: '💰',
};

export default function ExpenseCard({ expense, currentUser }: ExpenseCardProps) {
  const splitAmount = expense.amount / expense.splitWith.length;
  const isPayer = expense.paidBy.id === currentUser.id;
  const date = new Date(expense.date);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[expense.category]} rounded-xl flex items-center justify-center text-2xl`}>
            {categoryIcons[expense.category]}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">{expense.title}</h3>
            <p className="text-sm text-gray-500">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${expense.amount.toFixed(2)}
          </div>
          {expense.status === 'settled' && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium mt-1">
              <Check className="w-4 h-4" />
              Settled
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Split {expense.splitWith.length} ways</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            {isPayer ? 'You paid' : `${expense.paidBy.name} paid`}
          </div>
          <div className={`font-semibold ${isPayer ? 'text-green-600' : 'text-primary-600'}`}>
            {isPayer ? '+' : '-'}${splitAmount.toFixed(2)} per person
          </div>
        </div>
      </div>
    </div>
  );
}
