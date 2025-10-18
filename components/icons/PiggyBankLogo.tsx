import React from 'react';

export const PiggyBankLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 5.5V4M12 4h.01M12 4a2 2 0 1 0 4 0V2.5" />
    <path d="M12.5 10.5c.5-1 1.5-1.5 2.5-1.5s2 1 2 2-1 2-2 2h-1" />
    <path d="M8.5 10.5c-.5-1-1.5-1.5-2.5-1.5s-2 1-2 2 1 2 2 2h1" />
    <path d="M3.5 15.5c0-3.5 2-5 5.5-5h6c3.5 0 5.5 1.5 5.5 5v2.5c0 1-1 2.5-2.5 2.5H6c-1.5 0-2.5-1.5-2.5-2.5V15.5Z" />
    <path d="M15 18.5v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" />
  </svg>
);