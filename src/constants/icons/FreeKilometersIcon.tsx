import React from 'react';

interface FreeKilometersIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const FreeKilometersIcon: React.FC<FreeKilometersIconProps> = ({ 
  className = '', 
  width = 20, 
  height = 20 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M4.16667 2.5L1.5 17.5" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13.3335 2.5L14.4198 8.78036" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8.75 2.5V5.83333" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8.75 8.33301V11.6663" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8.75 14.167V17.5003" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12.084 14.167H17.084M14.584 16.667V11.667" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FreeKilometersIcon;

