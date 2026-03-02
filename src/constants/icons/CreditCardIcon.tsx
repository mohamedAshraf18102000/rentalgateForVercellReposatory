import React from 'react';

interface CreditCardIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const CreditCardIcon: React.FC<CreditCardIconProps> = ({
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
        d="M2.66602 15.9997C2.66602 11.283 2.66602 8.9247 4.06975 7.35021C4.29427 7.09838 4.54172 6.86547 4.8093 6.65417C6.48219 5.33301 8.98791 5.33301 13.9993 5.33301H17.9993C23.0108 5.33301 25.5165 5.33301 27.1893 6.65417C27.4569 6.86547 27.7044 7.09838 27.9289 7.35021C29.3327 8.9247 29.3327 11.283 29.3327 15.9997C29.3327 20.7163 29.3327 23.0746 27.9289 24.6491C27.7044 24.901 27.4569 25.1338 27.1893 25.3451C25.5165 26.6663 23.0108 26.6663 17.9993 26.6663H13.9993C8.98791 26.6663 6.48219 26.6663 4.8093 25.3451C4.54172 25.1338 4.29427 24.901 4.06975 24.6491C2.66602 23.0746 2.66602 20.7163 2.66602 15.9997Z"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.334 21.333H15.334"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.334 21.333H24.0007"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66602 12H29.3327"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

