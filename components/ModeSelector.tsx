
import React from 'react';
import { BudgetMode } from '../types';

interface ModeSelectorProps {
  currentMode: BudgetMode;
  onModeChange: (mode: BudgetMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes = [BudgetMode.STANDARD, BudgetMode.MINIMALIST];

  return (
    <div className="flex justify-center items-center bg-gray-900/50 rounded-full p-1 mb-6 max-w-sm mx-auto border border-gray-700">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`w-full text-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800
            ${currentMode === mode ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};
