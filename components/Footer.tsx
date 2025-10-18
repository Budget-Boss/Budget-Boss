
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-700">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Budget Boss. All rights reserved.</p>
        <p className="text-sm mt-1">Your AI-powered path to financial freedom.</p>
      </div>
    </footer>
  );
};