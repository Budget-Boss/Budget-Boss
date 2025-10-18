import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { TargetIcon } from './icons/TargetIcon';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300 transform hover:-translate-y-1">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-900 mb-4 border border-gray-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="mb-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-400">Unlock Your Financial Potential</h2>
      <p className="max-w-3xl mx-auto text-gray-300 mb-10">
        Budget Boss is more than just a calculator. It's your personal AI financial advisor, dedicated to creating a customized roadmap to help you achieve your dreams, whether that's early retirement, a down payment on a house, or simply living with financial peace of mind.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BrainCircuitIcon className="h-6 w-6 text-cyan-400" />}
          title="AI-Powered Personalization"
          description="Leverage the power of AI to get a budget that's truly yours. Our system analyzes your unique income and spending habits to craft a realistic and effective plan."
        />
        <FeatureCard
          icon={<ChartBarIcon className="h-6 w-6 text-green-400" />}
          title="Maximize Your Savings"
          description="Discover hidden savings opportunities. Choose between a balanced 'Standard' mode or an aggressive 'Minimalist' mode to accelerate your journey to your financial goals."
        />
        <FeatureCard
          icon={<TargetIcon className="h-6 w-6 text-yellow-400" />}
          title="Clear & Actionable Goals"
          description="No more confusing spreadsheets. Receive a clear breakdown of your recommended budget, potential savings, and actionable tips you can implement immediately."
        />
      </div>
    </section>
  );
};
