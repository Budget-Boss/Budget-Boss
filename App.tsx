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
import { BudgetModesExplainedSection } from './components/BudgetModesExplainedSection';

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
    <div className="relative min-h-screen text-gray-100 flex flex-col overflow-hidden">
      {/* Background SVG - now covers the entire page */}
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
            </pattern>
            {/* Central glow effect */}
            <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{stopColor: 'rgba(34, 211, 238, 0.25)'}} />
              <stop offset="100%" style={{stopColor: 'rgba(34, 211, 238, 0)'}} />
            </radialGradient>
          </defs>
          
          {/* Layer 1: Grid pattern */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Layer 2: Central glow */}
          <rect width="100%" height="100%" fill="url(#glow)" />
        </svg>
      </div>

      <Header onGetStarted={handleGetStarted} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AboutSection />
          <AboutUsSection />
          <BudgetModesExplainedSection />
          
          <section id="budget-form" className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl mb-12 border border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">Create Your Budget</h2>
            <p className="text-center text-gray-400 mb-6">Select a mode and enter your financial details below.</p>
            <ModeSelector currentMode={budgetMode} onModeChange={setBudgetMode} />
            <BudgetForm onSubmit={handleFormSubmit} isLoading={isLoading} budgetMode={budgetMode} />
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