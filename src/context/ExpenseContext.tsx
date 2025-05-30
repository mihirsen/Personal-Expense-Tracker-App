import React, { createContext, useContext, useState, useEffect } from "react";
import { Expense } from "../types";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useCurrency } from "./CurrencyContext";
import toast from "react-hot-toast";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "created_at">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  editExpense: (id: string, updatedExpense: Partial<Expense>) => Promise<void>;
  loading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentCurrency } = useCurrency();

  useEffect(() => {
    if (user) {
      // Initial fetch of expenses
      fetchExpenses();

      // Subscribe to real-time changes
      const subscription = supabase
        .channel("expenses_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "expenses",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setExpenses((current) => [payload.new as Expense, ...current]);
            } else if (payload.eventType === "DELETE") {
              setExpenses((current) =>
                current.filter((expense) => expense.id !== payload.old.id)
              );
            } else if (payload.eventType === "UPDATE") {
              setExpenses((current) =>
                current.map((expense) =>
                  expense.id === payload.new.id
                    ? (payload.new as Expense)
                    : expense
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setExpenses(data || []);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, "id" | "created_at">) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("expenses").insert([
        {
          ...expense,
          user_id: user.id,
          currency: currentCurrency.code,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      await fetchExpenses();
      toast.success("Expense added successfully");
    } catch (error) {
      toast.error("Failed to add expense");
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchExpenses();
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error("Error deleting expense:", error);
    }
  };

  const editExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .update(updatedExpense)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchExpenses();
      toast.success("Expense updated successfully");
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, deleteExpense, editExpense, loading }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
};
