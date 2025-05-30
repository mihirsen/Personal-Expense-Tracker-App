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
  const [transactionType, setTransactionType] = useState<
    "expense" | "give" | "borrow"
  >("expense");
  const [contact, setContact] = useState("");
  const [sendEmailReminder, setSendEmailReminder] = useState(false);
  const [sendSmsReminder, setSendSmsReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState("");

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

    // Prepare the expense object
    const newExpense = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
      currency: currentCurrency.code,
      transactionType, // Always include transaction type
      contact:
        transactionType === "give" || transactionType === "borrow"
          ? contact
          : undefined, // Only include contact for give/borrow
      sendEmailReminder:
        transactionType === "give" || transactionType === "borrow"
          ? sendEmailReminder
          : undefined, // Only include reminder preferences for give/borrow
      sendSmsReminder:
        transactionType === "give" || transactionType === "borrow"
          ? sendSmsReminder
          : undefined,
      // Only include reminderDate if it's a give/borrow transaction AND a reminder is set
      reminderDate:
        (transactionType === "give" || transactionType === "borrow") &&
        (sendEmailReminder || sendSmsReminder) &&
        reminderDate
          ? reminderDate
          : undefined,
    };

    addExpense(newExpense);

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
      {/* Group basic expense details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      {/* Group Category and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      {/* Transaction Type */} {/* This will remain full-width for clarity */}
      <div>
        <label
          htmlFor="transactionType"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Transaction Type
        </label>
        <select
          id="transactionType"
          className="select w-full"
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value as "expense" | "give" | "borrow")
          }
        >
          <option value="expense">Expense</option>
          <option value="give">Money Given</option>
          <option value="borrow">Money Borrowed</option>
        </select>
      </div>
      {(transactionType === "give" || transactionType === "borrow") && (
        <>
          {/* Contact and Reminder options - potentially side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Recipient/Lender Contact (Email or Phone)
              </label>
              <input
                type="text"
                id="contact"
                className="input w-full"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or Phone Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Set Reminder
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={sendEmailReminder}
                    onChange={(e) => setSendEmailReminder(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={sendSmsReminder}
                    onChange={(e) => setSendSmsReminder(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    SMS
                  </span>
                </label>
              </div>
            </div>
          </div>

          {(sendEmailReminder || sendSmsReminder) && (
            <div>
              {" "}
              {/* Reminder date remains full width for now */}
              <label
                htmlFor="reminderDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Reminder Date
              </label>
              <input
                type="date"
                id="reminderDate"
                className="input w-full"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                required
              />
            </div>
          )}
        </>
      )}
      {/* Notes field */}
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
      {/* Action buttons */}
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
