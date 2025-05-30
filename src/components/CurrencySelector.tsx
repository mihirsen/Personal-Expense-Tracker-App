import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Currency } from '../types';

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = currencies.find(c => c.code === event.target.value);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Currency
      </label>
      <select
        id="currency"
        className="select h-9 text-sm"
        value={currentCurrency.code}
        onChange={handleCurrencyChange}
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;