import React from 'react';

interface CarSeatIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const CarSeatIcon: React.FC<CarSeatIconProps> = ({ 
  className = '', 
  width = 32, 
  height = 32 
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
        d="M20.6912 24.0003H8.03715C6.54395 24.0003 5.33342 22.8106 5.33342 21.3431C5.33342 19.3337 8.03715 18.6858 8.03715 18.6858C8.03715 18.6858 12.9542 16.7955 18.6668 18.667C18.6668 18.667 18.8521 11.8306 21.7203 4.22788C22.2862 2.72787 24.1318 2.21572 25.4862 3.10312C26.38 3.68872 26.8258 4.74654 26.6152 5.78172L23.3424 21.8642C23.0896 23.1063 21.98 24.0003 20.6912 24.0003Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15.3333 14H7.99992" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CarSeatIcon;

