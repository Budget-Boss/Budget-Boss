import React from 'react';

interface HeaderProps {
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  return (
    <header className="relative text-white text-center min-h-screen flex flex-col justify-center">
      {/* Background SVG has been moved to App.tsx */}

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          <span className="text-cyan-400">Budget</span>
          <span className="text-white">Boss</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Retire effortlessly with your personal AI financial planner.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-cyan-500/30"
        >
          Get Started
        </button>
      </div>
    </header>
  );
};