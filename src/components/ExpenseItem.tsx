import React, { useState } from "react";
import { Expense } from "../types";
import { formatDate, getCategoryColor } from "../utils/helpers";
import { Edit, Trash2, X, Check } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { useCurrency } from "../context/CurrencyContext";

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const { deleteExpense, editExpense } = useExpense();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(expense.title);
  const [editedAmount, setEditedAmount] = useState(expense.amount.toString());
  const [editedNotes, setEditedNotes] = useState(expense.notes || "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { formatAmount } = useCurrency();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(expense.title);
    setEditedAmount(expense.amount.toString());
    setEditedNotes(expense.notes || "");
  };

  const handleSaveEdit = () => {
    if (!editedTitle.trim() || parseFloat(editedAmount) <= 0) {
      return;
    }

    editExpense(expense.id, {
      title: editedTitle.trim(),
      amount: parseFloat(editedAmount),
      notes: editedNotes.trim(),
      currency: expense.currency,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (isConfirmingDelete) {
      deleteExpense(expense.id);
    } else {
      setIsConfirmingDelete(true);

      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 3000);
    }
  };

  const categoryColor = getCategoryColor(expense.category);

  return (
    <div className="py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {isEditing ? (
        <div className="animate-fade-in">
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="input mr-2 flex-1"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <input
              type="number"
              className="input w-32"
              value={editedAmount}
              onChange={(e) => setEditedAmount(e.target.value)}
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="mb-2">
            <textarea
              className="input w-full min-h-[60px]"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Notes (optional)"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              className="btn btn-outline p-2"
              aria-label="Cancel edit"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleSaveEdit}
              className="btn btn-primary p-2"
              aria-label="Save edit"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <div
              className="w-4 h-4 rounded-full mt-1.5"
              style={{ backgroundColor: categoryColor }}
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {expense.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatDate(expense.date)}</span>
                <span className="hidden sm:block mx-2">•</span>
                <span className="capitalize">{expense.category}</span>
              </div>
              {expense.notes && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                  {expense.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatAmount(expense.amount)}
            </span>
            <div className="flex ml-4">
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Edit expense"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className={`p-1.5 ${
                  isConfirmingDelete
                    ? "text-warning-500 hover:text-warning-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                aria-label={
                  isConfirmingDelete ? "Confirm delete" : "Delete expense"
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseItem;
