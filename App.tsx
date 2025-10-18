import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { BudgetForm } from './components/BudgetForm';
import { BudgetPlanDisplay } from './components/BudgetPlanDisplay';
import { Footer } from './components/Footer';
import { generateBudgetPlan } from './services/geminiService';
import { BudgetMode, type FinancialData, type BudgetPlan } from './types';
import { ModeSelector } from './components/ModeSelector';
import { AboutSection } from './components/AboutSection';
import { AboutUsSection } from './components/AboutUsSection';

const App: React.FC = () => {
  const [budgetMode, setBudgetMode] = useState<BudgetMode>(BudgetMode.STANDARD);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlan | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    document.getElementById('budget-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = useCallback(async (data: FinancialData) => {
    setIsLoading(true);
    setError(null);
    setBudgetPlan(null);
    setFinancialData(data); // Store original data
    try {
      const plan = await generateBudgetPlan(data, budgetMode);
      setBudgetPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate budget plan: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [budgetMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header onGetStarted={handleGetStarted} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <AboutSection />
          <AboutUsSection />
          
          <section id="budget-form" className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl mb-12 border border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">Create Your Budget</h2>
            <p className="text-center text-gray-400 mb-6">Select a mode and enter your financial details below.</p>
            <ModeSelector currentMode={budgetMode} onModeChange={setBudgetMode} />
            <BudgetForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </section>

          <BudgetPlanDisplay
            plan={budgetPlan}
            isLoading={isLoading}
            error={error}
            originalData={financialData}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;