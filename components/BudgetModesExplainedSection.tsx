import React from 'react';
import { PiggyBankIcon } from './icons/PiggyBankIcon';
import { TargetIcon } from './icons/TargetIcon';

const ModeCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col bg-gray-900/50 p-6 rounded-xl border border-gray-700 h-full">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 mb-4 border border-gray-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
        <p className="text-gray-400 text-center flex-grow">{description}</p>
    </div>
  );
};

export const BudgetModesExplainedSection: React.FC = () => {
  return (
    <section id="budget-modes" className="mb-16">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400 text-center">Understanding The Budget Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModeCard
            icon={<PiggyBankIcon className="h-6 w-6 text-green-400" />}
            title="Standard Mode"
            description="Perfect for sustainable, long-term financial health. This mode creates a balanced budget, often following the 50/30/20 rule (needs/wants/savings), allowing you to live comfortably while consistently growing your savings."
          />
          <ModeCard
            icon={<TargetIcon className="h-6 w-6 text-yellow-400" />}
            title="Minimalist Mode"
            description="Designed for aggressive, short-term goals. This 'frugal survival' approach strips expenses down to absolute necessities, maximizing every dollar towards a critical objective like paying off debt or saving for a down payment quickly."
          />
        </div>
      </div>
    </section>
  );
};