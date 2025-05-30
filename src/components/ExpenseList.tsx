import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import ExpenseItem from './ExpenseItem';
import { getFilteredExpenses } from '../utils/helpers';
import { ExpenseFilters } from '../types';

interface ExpenseListProps {
  filters: ExpenseFilters;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ filters }) => {
  const { expenses } = useExpense();
  const filteredExpenses = getFilteredExpenses(expenses, filters);
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {filteredExpenses.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No expenses found.</p>
          {(filters.category !== 'all' || filters.dateRange !== 'all' || filters.search) && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Try adjusting your filters.
            </p>
          )}
        </div>
      ) : (
        filteredExpenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))
      )}
    </div>
  );
};

export default ExpenseList;