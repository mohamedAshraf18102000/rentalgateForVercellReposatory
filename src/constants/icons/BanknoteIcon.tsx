import React from 'react';

interface BanknoteIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const BanknoteIcon: React.FC<BanknoteIconProps> = ({
  className = '',
  width = 32,
  height = 32,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.68945 18C5.62221 18 7.99969 20.3775 7.99969 23.3103"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 23.3103V23.1877C24 20.3227 26.3227 18 29.1877 18"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99969 4.6875C7.99969 7.62027 5.62221 9.99774 2.68945 9.99774"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 4.6875C24 7.59459 26.3587 9.95607 29.2564 9.99719"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.3327 4.66699H10.666C6.89478 4.66699 5.00916 4.66699 3.83759 5.83857C2.66602 7.01014 2.66602 8.89575 2.66602 12.667V15.3337C2.66602 19.1049 2.66602 20.9905 3.83759 22.1621C5.00916 23.3337 6.89478 23.3337 10.666 23.3337H21.3327C25.1039 23.3337 26.9895 23.3337 28.1611 22.1621C29.3327 20.9905 29.3327 19.1049 29.3327 15.3337V12.667C29.3327 8.89575 29.3327 7.01014 28.1611 5.83857C26.9895 4.66699 25.1039 4.66699 21.3327 4.66699Z"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66602 27.333H25.3327"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14C20 16.2092 18.2092 18 16 18C13.7908 18 12 16.2092 12 14C12 11.7909 13.7908 10 16 10C18.2092 10 20 11.7909 20 14Z"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

