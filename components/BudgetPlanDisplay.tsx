import React, { useMemo } from 'react';
import type { BudgetPlan, FinancialData, ExpenseItem } from '../types';
import { PiggyBankIcon } from './icons/PiggyBankIcon';

interface BudgetPlanDisplayProps {
  plan: BudgetPlan | null;
  isLoading: boolean;
  error: string | null;
  originalData: FinancialData | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const parseExpenses = (expensesString: string): ExpenseItem[] => {
  if (!expensesString) return [];
  const items = expensesString.split(/,|\n/).map(item => item.trim()).filter(Boolean);
  const parsedItems: ExpenseItem[] = [];

  items.forEach(itemStr => {
    const match = itemStr.match(/^(.*?)\s*(\d+(\.\d+)?)$/);
    if (match && match[1] && match[2]) {
      const category = match[1].trim();
      const amount = parseFloat(match[2]);
      parsedItems.push({ category, amount });
    }
  });

  return parsedItems;
};

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-12 bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-24 bg-gray-700 rounded-lg"></div>
      <div className="h-24 bg-gray-700 rounded-lg"></div>
    </div>
    <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded-lg w-1/2"></div>
        <div className="h-16 bg-gray-700 rounded-lg"></div>
        <div className="h-16 bg-gray-700 rounded-lg"></div>
        <div className="h-16 bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

export const BudgetPlanDisplay: React.FC<BudgetPlanDisplayProps> = ({ plan, isLoading, error, originalData }) => {
  const { userExpenses, totalUserExpenses, currentUserSavings } = useMemo(() => {
    if (!originalData) {
      return { userExpenses: [], totalUserExpenses: 0, currentUserSavings: 0 };
    }
    const parsed = parseExpenses(originalData.expenses);
    const total = parsed.reduce((sum, item) => sum + item.amount, 0);
    const savings = originalData.income - total;
    return { userExpenses: parsed, totalUserExpenses: total, currentUserSavings: savings };
  }, [originalData]);

  // Client-side calculation for potential savings for greater accuracy
  const { totalRecommendedExpenses, potentialMonthlySavings, potentialAnnualSavings } = useMemo(() => {
    if (!plan || !originalData) {
      return { totalRecommendedExpenses: 0, potentialMonthlySavings: 0, potentialAnnualSavings: 0 };
    }
    const totalExpenses = plan.budgetBreakdown.reduce((sum, item) => sum + item.recommendedAmount, 0);
    const savings = originalData.income - totalExpenses;
    return {
      totalRecommendedExpenses: totalExpenses,
      potentialMonthlySavings: savings,
      potentialAnnualSavings: savings * 12
    };
  }, [plan, originalData]);


  if (isLoading) {
    return <section className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700"><LoadingSkeleton /></section>;
  }

  if (error) {
    return (
      <section className="bg-red-900/50 text-red-300 p-8 rounded-2xl text-center border border-red-700">
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h3>
        <p>{error}</p>
      </section>
    );
  }

  if (!plan) {
    return (
        <section className="bg-gray-800/50 p-8 rounded-2xl text-center border-2 border-dashed border-gray-700">
            <PiggyBankIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-400">Your Personalized Budget Plan Will Appear Here</h3>
            <p className="text-gray-500">Fill out the form above to get started on your path to financial freedom.</p>
        </section>
    );
  }

  return (
    <>
      <section className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">Your Budget Boss Plan</h2>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">{plan.summary}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 text-center flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Current Savings</h3>
            <p className="text-4xl font-bold text-white">{formatCurrency(currentUserSavings)}</p>
            <p className="text-md text-gray-400 mt-1">({formatCurrency(currentUserSavings * 12)} annually)</p>
          </div>
          <div className="bg-green-800/30 p-6 rounded-xl border border-green-700 text-center flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Potential Savings with Plan</h3>
            <p className="text-4xl font-bold text-white">{formatCurrency(potentialMonthlySavings)}</p>
            <p className="text-md text-green-400 mt-1">({formatCurrency(potentialAnnualSavings)} annually)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200">Your Current Expenses</h3>
            <div className="space-y-3 bg-gray-700/30 p-4 rounded-lg border border-gray-600">
              {userExpenses.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-gray-300">
                  <span>{item.category}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t border-gray-500 my-2"></div>
              <div className="flex justify-between items-center font-bold text-white">
                <span>Total Expenses</span>
                <span>{formatCurrency(totalUserExpenses)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200">Recommended Budget</h3>
            <div className="space-y-4">
              {plan.budgetBreakdown.map((item, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-cyan-300">{item.category}</span>
                    <span className="font-bold text-lg text-white">{formatCurrency(item.recommendedAmount)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.notes}</p>
                </div>
              ))}
              <div className="border-t border-gray-500 my-2"></div>
              <div className="flex justify-between items-center font-bold text-white bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(totalRecommendedExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 mt-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-cyan-400">Top Financial Tips</h3>
        <ol className="space-y-4 max-w-3xl mx-auto">
          {plan.financialTips.map((tip, index) => (
            <li key={index} className="flex items-start p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-cyan-500/50 transition-colors duration-300">
              <span className="text-cyan-400 font-bold mr-4 flex-shrink-0 mt-1 text-lg">{index + 1}.</span>
              <p className="text-gray-300">{tip}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};