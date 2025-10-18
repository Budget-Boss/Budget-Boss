import React from 'react';

interface HeaderProps {
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  return (
    <header className="relative bg-gray-900 text-white text-center min-h-screen flex flex-col justify-center border-b border-gray-800 overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(128, 128, 128, 0.2)" strokeWidth="1"/>
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