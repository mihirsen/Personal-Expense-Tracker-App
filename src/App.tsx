import { useTheme } from "./context/ThemeContext";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ExpenseList from "./components/ExpenseList";
import AddExpenseForm from "./components/AddExpenseForm";
import { useExpense } from "./context/ExpenseContext";
import ChartSection from "./components/ChartSection";
import { useState } from "react";
import FilterBar from "./components/FilterBar";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Footer from "./components/Footer";

function App() {
  const { isDarkMode } = useTheme();
  const { expenses } = useExpense();
  const { user } = useAuth();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    dateRange: "all",
    search: "",
  });

  const handleToggleAddExpense = () => {
    setIsAddingExpense(!isAddingExpense);
  };

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <Dashboard
            expenses={expenses}
            onAddExpense={handleToggleAddExpense}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Expenses</h2>
                  <FilterBar filters={filters} setFilters={setFilters} />
                </div>
                <ExpenseList filters={filters} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ChartSection expenses={expenses} />
            </div>
          </div>
        </main>
      </div>

      {isAddingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-in max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Expense</h2>
                <button
                  onClick={handleToggleAddExpense}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <AddExpenseForm onClose={handleToggleAddExpense} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
