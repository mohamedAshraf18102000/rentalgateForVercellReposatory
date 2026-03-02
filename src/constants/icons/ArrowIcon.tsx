import React from 'react';

interface ArrowIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ 
  className = '', 
  width = 15, 
  height = 24 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 15 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M10.5 18L4.5 12L10.5 6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;

