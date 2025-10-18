import React, { useMemo } from 'react';
import type { BudgetPlan, FinancialData, ExpenseItem, BudgetItem } from '../types';
import { PiggyBankIcon } from './icons/PiggyBankIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

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

  const { totalRecommendedExpenses, totalAvailableWithPlan } = useMemo(() => {
    if (!plan || !originalData) {
      return { totalRecommendedExpenses: 0, totalAvailableWithPlan: 0 };
    }
    const totalExpenses = plan.budgetBreakdown.reduce((sum, item) => sum + item.recommendedAmount, 0);
    // This is the total unspent money: income minus what the plan recommends for spending.
    const totalAvailable = originalData.income - totalExpenses;
    return {
      totalRecommendedExpenses: totalExpenses,
      // Ensure it's not a tiny negative number from floating point math
      totalAvailableWithPlan: totalAvailable > 0.001 ? totalAvailable : 0,
    };
  }, [plan, originalData]);
  
  const comprehensiveRecommendedBudget = useMemo(() => {
    if (!plan || !userExpenses.length) {
      return plan?.budgetBreakdown || [];
    }

    const recommendedMap = new Map(
      plan.budgetBreakdown.map(item => [item.category.toLowerCase(), item])
    );

    return userExpenses.map(userExpense => {
      const recommendedItem = recommendedMap.get(userExpense.category.toLowerCase());
      
      if (recommendedItem) {
        return recommendedItem;
      } else {
        return {
          category: userExpense.category,
          recommendedAmount: 0,
          notes: 'This expense was removed to help you reach your savings goal.',
        };
      }
    });
  }, [plan, userExpenses]);


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
        
        {originalData?.savingsGoal && originalData.savingsGoal > 0 && (
          <div className="bg-green-800/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-center mb-8 flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 mr-3" />
            <p className="font-semibold">
              Goal Achieved! This plan meets your monthly savings goal of {formatCurrency(originalData.savingsGoal)}.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 text-center flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Current Savings</h3>
            <p className={`text-4xl font-bold ${currentUserSavings < 0 ? 'text-red-400' : 'text-white'}`}>{formatCurrency(currentUserSavings)}</p>
            <p className={`text-md mt-1 ${currentUserSavings < 0 ? 'text-red-300' : 'text-gray-400'}`}>({formatCurrency(currentUserSavings * 12)} annually)</p>
          </div>
          <div className="bg-green-800/30 p-6 rounded-xl border border-green-700 text-center flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Total Available with Plan</h3>
            <p className="text-4xl font-bold text-white">{formatCurrency(totalAvailableWithPlan)}</p>
            <p className="text-md text-green-400 mt-1">({formatCurrency(totalAvailableWithPlan * 12)} annually)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200">Your Current Expenses</h3>
            <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
              <div className="space-y-3">
                {userExpenses.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-gray-300">
                    <span>{item.category}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-500 mt-3 pt-3 space-y-2">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(totalUserExpenses)}</span>
                </div>
                <div className={`flex justify-between items-center font-bold ${currentUserSavings < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  <span>{currentUserSavings < 0 ? 'Money Lost' : 'Money Left Over'}</span>
                  <span>{formatCurrency(currentUserSavings)}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-200">Recommended Budget</h3>
            <div className="space-y-4">
              {comprehensiveRecommendedBudget.map((item, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-cyan-300">{item.category}</span>
                    <span className="font-bold text-lg text-white">{formatCurrency(item.recommendedAmount)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{item.notes}</p>
                </div>
              ))}
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 space-y-2">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(totalRecommendedExpenses)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-green-400">
                  <span>Total Available (Savings + Surplus)</span>
                  <span>{formatCurrency(totalAvailableWithPlan)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {plan.surplusSuggestions && plan.surplusSuggestions.length > 0 && (
        <section className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 mt-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-yellow-400 flex items-center justify-center">
            <LightbulbIcon className="h-8 w-8 mr-3" />
            Ideas for Your Surplus
          </h3>
          <ol className="space-y-4 max-w-3xl mx-auto">
            {plan.surplusSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-yellow-500/50 transition-colors duration-300">
                <span className="text-yellow-400 font-bold mr-4 flex-shrink-0 mt-1 text-lg">{index + 1}.</span>
                <p className="text-gray-300">{suggestion}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      
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