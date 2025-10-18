import React, { useState } from 'react';
import { GeminiLogo } from './icons/GeminiLogo';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { TargetIcon } from './icons/TargetIcon';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col text-center bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-72"
    >
      <div className="flex-grow flex items-center justify-center">
        {isHovered ? (
          <p className="text-gray-400">{description}</p>
        ) : (
          <h3 className="text-3xl font-bold text-white leading-tight">{title}</h3>
        )}
      </div>
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-900 mt-4 border border-gray-600">
        {icon}
      </div>
    </div>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="mb-64 pt-40">
      <div className="max-w-4xl mx-auto text-center bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-400">Unlock Your Financial Potential</h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg">
          Budget Boss is more than just a calculator. It's your personal AI financial advisor, dedicated to creating a customized roadmap to help you achieve your dreams, whether that's early retirement, a down payment on a house, or simply living with financial peace of mind.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <FeatureCard
          icon={<GeminiLogo className="h-6 w-6 text-cyan-400" />}
          title="AI-Powered Personalization"
          description="Leverage the power of the Gemini AI Backend to get a budget that's truly yours. Our system analyzes your unique income and spending habits to craft a realistic and effective plan."
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
