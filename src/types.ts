export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
}

export interface Household {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'rent' | 'utilities' | 'groceries' | 'subscriptions' | 'other';
  paidBy: User;
  splitWith: User[];
  date: string;
  status: 'pending' | 'settled';
  householdId: string;
}

export interface Split {
  userId: string;
  amount: number;
  settled: boolean;
}
