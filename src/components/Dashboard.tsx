import React from "react";
import { Plus, TrendingUp, Wallet, CreditCard } from "lucide-react";
import { calculateTotalExpenses } from "../utils/helpers";
import { Expense } from "../types";
import { useCurrency } from "../context/CurrencyContext";

interface DashboardProps {
  expenses: Expense[];
  onAddExpense: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, onAddExpense }) => {
  const { formatAmount } = useCurrency();
  const totalExpenses = calculateTotalExpenses(expenses);

  const currentMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const currentMonthTotal = calculateTotalExpenses(currentMonthExpenses);

  const lastMonthExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const lastMonthTotal = calculateTotalExpenses(lastMonthExpenses);

  const percentChange =
    lastMonthTotal === 0
      ? 100
      : Math.round(
          ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6 hover:shadow-md transition-shadow animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Expenses
            </p>
            <h3 className="text-2xl font-bold mt-1">
              {formatAmount(totalExpenses)}
            </h3>
          </div>
          <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-primary-500" />
          </div>
        </div>
      </div>

      <div className="card p-6 hover:shadow-md transition-shadow animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This Month
            </p>
            <h3 className="text-2xl font-bold mt-1">
              {formatAmount(currentMonthTotal)}
            </h3>
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  percentChange > 0 ? "text-warning-500" : "text-success-500"
                }`}
              >
                {percentChange > 0 ? "+" : ""}
                {percentChange}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>
          <div className="bg-success-100 dark:bg-success-900 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-success-500" />
          </div>
        </div>
      </div>

      <div className="card p-6 hover:shadow-md transition-shadow animate-fade-in bg-primary-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Add New Expense</h3>
            <p className="text-sm text-primary-100 mt-1">Track your spending</p>
          </div>
          <button
            onClick={onAddExpense}
            className="bg-white text-primary-500 rounded-full p-2 hover:bg-primary-50 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
