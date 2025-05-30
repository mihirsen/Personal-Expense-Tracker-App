import { format, subDays, isWithinInterval, parseISO } from "date-fns";
import { Expense, CategoryType } from "../types";

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const getCategoryColor = (category: CategoryType | string): string => {
  const colors: Record<string, string> = {
    food: "#3B82F6", // blue
    transport: "#10B981", // green
    entertainment: "#F59E0B", // amber
    bills: "#EF4444", // red
    shopping: "#8B5CF6", // purple
    health: "#EC4899", // pink
    other: "#6B7280", // gray
  };

  return colors[category as CategoryType] || colors.other;
};

export const filterExpensesByDateRange = (
  expenses: Expense[],
  dateRange: string
): Expense[] => {
  if (dateRange === "all") return expenses;

  const today = new Date();
  const dateRanges: Record<string, { start: Date; end: Date }> = {
    today: {
      start: new Date(today.setHours(0, 0, 0, 0)),
      end: new Date(today.setHours(23, 59, 59, 999)),
    },
    last7days: {
      start: subDays(today, 7),
      end: today,
    },
    last30days: {
      start: subDays(today, 30),
      end: today,
    },
    last90days: {
      start: subDays(today, 90),
      end: today,
    },
  };

  const range = dateRanges[dateRange];
  if (!range) return expenses;

  return expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, range);
  });
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateCategoryTotals = (
  expenses: Expense[]
): Record<string, number> => {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  return categoryTotals;
};

export const getExpensesByCategory = (
  expenses: Expense[],
  category: string
): Expense[] => {
  if (category === "all") return expenses;
  return expenses.filter((expense) => expense.category === category);
};

export const getFilteredExpenses = (
  expenses: Expense[],
  filters: { category: string; dateRange: string; search: string }
): Expense[] => {
  let filteredExpenses = [...expenses];

  // Filter by category
  if (filters.category !== "all") {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.category === filters.category
    );
  }

  // Filter by date range
  filteredExpenses = filterExpensesByDateRange(
    filteredExpenses,
    filters.dateRange
  );

  // Filter by search query
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredExpenses = filteredExpenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(searchLower) ||
        expense.notes?.toLowerCase().includes(searchLower)
    );
  }

  return filteredExpenses;
};
