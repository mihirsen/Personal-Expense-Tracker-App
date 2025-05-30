import React, { createContext, useContext, useState } from "react";
import { Currency } from "../types";

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    currencies[0]
  );

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currentCurrency.code,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider
      value={{ currentCurrency, setCurrency, formatAmount }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
