import React from "react";
import { Filter } from "lucide-react";
import { CategoryOption, DateRangeOption, ExpenseFilters } from "../types";

interface FilterBarProps {
  filters: ExpenseFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExpenseFilters>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  const categoryOptions: CategoryOption[] = [
    { value: "all", label: "All Categories", color: "#6B7280" },
    { value: "food", label: "Food & Dining", color: "#3B82F6" },
    { value: "transport", label: "Transportation", color: "#10B981" },
    { value: "entertainment", label: "Entertainment", color: "#F59E0B" },
    { value: "bills", label: "Bills & Utilities", color: "#EF4444" },
    { value: "shopping", label: "Shopping", color: "#8B5CF6" },
    { value: "health", label: "Health & Medical", color: "#EC4899" },
    { value: "other", label: "Other", color: "#6B7280" },
  ];

  const dateRangeOptions: DateRangeOption[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "last90days", label: "Last 90 Days" },
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, dateRange: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ category: "all", dateRange: "all", search: "" });
  };

  const isFiltering =
    filters.category !== "all" ||
    filters.dateRange !== "all" ||
    filters.search !== "";

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search expenses..."
          className="input pl-8 h-9 text-sm w-full md:w-40 lg:w-48"
          value={filters.search}
          onChange={handleSearchChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex items-center space-x-2">
        <select
          className="select h-9 text-sm"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="select h-9 text-sm"
          value={filters.dateRange}
          onChange={handleDateRangeChange}
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {isFiltering && (
          <button
            onClick={handleClearFilters}
            className="btn btn-outline h-9 text-sm py-0 px-3"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
