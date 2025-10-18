import React, { useState } from 'react';
import type { FinancialData } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';

interface BudgetFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
}

const calculateTotalExpenses = (expensesString: string): number => {
  // This regex finds all numbers (including decimals) in the string.
  const numbers = expensesString.match(/\d+(\.\d+)?/g) || [];
  // Fix: By providing an initial value of 0, TypeScript can correctly infer the types for the reduce function, resolving the error.
  return numbers.reduce((sum, numStr) => sum + parseFloat(numStr), 0);
};

export const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, isLoading }) => {
  const [income, setIncome] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(income);

    if (!incomeNum || incomeNum <= 0 || !expenses.trim()) {
      setError('Please enter a valid monthly income and a list of your expenses.');
      return;
    }
    
    const totalExpenses = calculateTotalExpenses(expenses);

    if (incomeNum < totalExpenses) {
      const formattedExpenses = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalExpenses);
      setError(`Your listed expenses (${formattedExpenses}) exceed your income. Please review your entries.`);
      return;
    }

    setError(null);
    onSubmit({ income: incomeNum, expenses });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
      
      <div>
        <label htmlFor="income" className="flex items-center text-lg font-semibold text-gray-300 mb-2">
          <DollarSignIcon className="h-5 w-5 mr-2 text-green-400" />
          Monthly Income (after tax)
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            id="income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g., 4500"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-7 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            min="0"
            step="100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="expenses" className="flex items-center text-lg font-semibold text-gray-300 mb-2">
          <ReceiptIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Monthly Expenses
        </label>
        <textarea
          id="expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
          placeholder="List your expenses here. Be as detailed as you like!&#10;e.g., Rent 1500, Groceries 400, Gas 100, Internet 60, Eating out 250"
          rows={5}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        />
        <p className="text-xs text-gray-500 mt-1">The more detail you provide, the better your budget plan will be.</p>
      </div>

      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-full text-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 flex items-center justify-center mx-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Plan...
            </>
          ) : (
            'Generate My Budget Plan'
          )}
        </button>
      </div>
    </form>
  );
};
