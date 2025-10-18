import React from 'react';

export const PiggyBankIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Body */}
    <path d="M18.5 15.5c-1.93 1.63-4.43 2.5-7 2.5-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5c2.57 0 5.07.87 7 2.5" />
    {/* Snout */}
    <path d="M18.5 15.5C20.12 14.59 21 13.11 21 11.5c0-1.61-.88-3.09-2.5-4" />
    {/* Legs */}
    <path d="M6 18v2" />
    <path d="M12 18v2" />
    {/* Ear */}
    <path d="M9 7l1-2" />
    {/* Slot */}
    <path d="M14.5 7.5h2" />
    {/* Tail */}
    <path d="M4 14c-.5 1.5-1.5 2-1.5 3s1 1.5 1.5 1.5" />
  </svg>
);