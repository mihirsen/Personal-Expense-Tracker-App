import React, { useState, useEffect } from "react";
import { Expense } from "../types";
import { calculateCategoryTotals, getCategoryColor } from "../utils/helpers";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { BarChart3, PieChart } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ChartSectionProps {
  expenses: Expense[];
}

type ChartType = "doughnut" | "bar";

const ChartSection: React.FC<ChartSectionProps> = ({ expenses }) => {
  const [chartType, setChartType] = useState<ChartType>("doughnut");
  const { formatAmount } = useCurrency();

  if (expenses.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Spending Overview</h2>
        <div className="flex justify-center items-center h-64 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Add expenses to see your spending charts
          </p>
        </div>
      </div>
    );
  }

  const categoryTotals = calculateCategoryTotals(expenses);
  const categories = Object.keys(categoryTotals);
  const totals = Object.values(categoryTotals);
  const backgroundColors = categories.map((category) =>
    getCategoryColor(category)
  );

  const doughnutData = {
    labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: totals,
        backgroundColor: backgroundColors,
        borderColor: "transparent",
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        label: "Spending by Category",
        data: totals,
        backgroundColor: backgroundColors,
        borderColor: "transparent",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatAmount(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Spending Overview</h2>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
          <button
            className={`p-1 rounded ${
              chartType === "doughnut"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setChartType("doughnut")}
            aria-label="Show pie chart"
          >
            <PieChart className="h-4 w-4" />
          </button>
          <button
            className={`p-1 rounded ${
              chartType === "bar"
                ? "bg-white dark:bg-gray-600 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setChartType("bar")}
            aria-label="Show bar chart"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-64">
        {chartType === "doughnut" ? (
          <Doughnut data={doughnutData} options={chartOptions} />
        ) : (
          <Bar data={barData} options={chartOptions} />
        )}
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Top Categories
        </h3>
        <div className="space-y-2">
          {categories
            .map((category, index) => ({
              category,
              amount: totals[index],
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3)
            .map(({ category, amount }) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <span className="text-sm capitalize">{category}</span>
                </div>
                <span className="text-sm font-medium">
                  {formatAmount(amount)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
