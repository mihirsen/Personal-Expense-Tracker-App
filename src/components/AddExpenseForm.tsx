import React, { useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import { CategoryType } from "../types";
import { useCurrency } from "../context/CurrencyContext";

interface AddExpenseFormProps {
  onClose: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onClose }) => {
  const { addExpense } = useExpense();
  const { currentCurrency } = useCurrency();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryType>("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const categoryOptions: { value: CategoryType; label: string }[] = [
    { value: "food", label: "Food & Dining" },
    { value: "transport", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "bills", label: "Bills & Utilities" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health & Medical" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    addExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
      currency: currentCurrency.code,
    });

    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto space-y-4"
    >
      {error && (
        <div className="mb-4 p-3 bg-warning-100 text-warning-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          className="input w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., Grocery shopping"
          required
        />
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Amount ({currentCurrency.symbol})
        </label>
        <input
          type="number"
          id="amount"
          className="input w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          className="select w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryType)}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          className="input w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          className="input min-h-[80px] w-full"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional details..."
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline w-full sm:w-auto"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          Save Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
