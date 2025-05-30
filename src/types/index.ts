export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes?: string;
  created_at: string;
  transactionType?: "expense" | "give" | "borrow";
  contact?: string;
  sendEmailReminder?: boolean;
  sendSmsReminder?: boolean;
  reminderDate?: string;
}

export type CategoryType =
  | "food"
  | "transport"
  | "entertainment"
  | "bills"
  | "shopping"
  | "health"
  | "other";

export interface CategoryOption {
  value: CategoryType | "all";
  label: string;
  color: string;
}

export interface DateRangeOption {
  value: string;
  label: string;
}

export interface ExpenseFilters {
  category: string;
  dateRange: string;
  search: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface User {
  id: string;
  email: string;
  currency_preference: string;
}
