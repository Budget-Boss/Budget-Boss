export enum BudgetMode {
  STANDARD = 'Standard',
  MINIMALIST = 'Minimalist',
}

export interface FinancialData {
  income: number;
  expenses: string; // User inputs a string of expenses
  savingsGoal?: number; // Optional: for Standard mode
}

export interface BudgetItem {
  category: string;
  recommendedAmount: number;
  notes: string;
}

export interface ExpenseItem {
  category: string;
  amount: number;
}

export interface BudgetPlan {
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  summary: string;
  budgetBreakdown: BudgetItem[];
  financialTips: string[];
  surplusSuggestions?: string[];
}