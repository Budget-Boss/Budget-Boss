import React, { useState } from 'react';
import type { FinancialData } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';

interface BudgetFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: string;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, isLoading }) => {
  const [income, setIncome] = useState<string>('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([
    { id: crypto.randomUUID(), category: '', amount: '' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleAddExpense = () => {
    setExpenseItems([...expenseItems, { id: crypto.randomUUID(), category: '', amount: '' }]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenseItems(expenseItems.filter((item) => item.id !== id));
  };

  const handleExpenseChange = (id: string, field: 'category' | 'amount', value: string) => {
    setExpenseItems(
      expenseItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(income);

    const filledExpenses = expenseItems.filter(
      (item) => item.category.trim() !== '' || item.amount.trim() !== ''
    );

    if (!incomeNum || incomeNum <= 0) {
      setError('Please enter a valid monthly income.');
      return;
    }
    
    if (filledExpenses.length === 0) {
        setError('Please enter at least one expense.');
        return;
    }
    
    for (const item of filledExpenses) {
        if (!item.category.trim() || !item.amount.trim() || parseFloat(item.amount) <= 0) {
            setError('Please ensure all expense rows have a valid category and a positive amount.');
            return;
        }
    }

    const totalExpenses = filledExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    if (incomeNum < totalExpenses) {
      const formattedExpenses = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExpenses);
      setError(`Your listed expenses (${formattedExpenses}) exceed your income. Please review your entries.`);
      return;
    }

    setError(null);
    const expensesString = filledExpenses
      .map(item => `${item.category.trim()} ${item.amount}`)
      .join(', ');
      
    onSubmit({ income: incomeNum, expenses: expensesString });
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
        <label className="flex items-center text-lg font-semibold text-gray-300 mb-2">
            <ReceiptIcon className="h-5 w-5 mr-2 text-yellow-400" />
            Monthly Expenses
        </label>
        <div className="space-y-3">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-x-2 items-center px-1 text-sm text-gray-400">
                <span>Category</span>
                <span>Monthly Cost</span>
            </div>
            {expenseItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-x-2 items-center">
                    <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleExpenseChange(item.id, 'category', e.target.value)}
                        placeholder="e.g., Rent"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        aria-label="Expense Category"
                    />
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleExpenseChange(item.id, 'amount', e.target.value)}
                            placeholder="e.g., 1500"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-7 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            min="0"
                            step="0.01"
                            aria-label="Expense Amount"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleRemoveExpense(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        aria-label="Remove expense"
                        disabled={expenseItems.length <= 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddExpense}
                className="w-full flex items-center justify-center text-cyan-400 border-2 border-dashed border-gray-600 hover:border-cyan-500 hover:bg-gray-700/50 rounded-lg py-2.5 transition-colors duration-200 mt-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Expense
            </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Add your spending categories and their monthly costs.</p>
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