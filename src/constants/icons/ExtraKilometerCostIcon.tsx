import React from 'react';

interface ExtraKilometerCostIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ExtraKilometerCostIcon: React.FC<ExtraKilometerCostIconProps> = ({ 
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
        d="M5 2.5L2.5 17.5M15 2.5L17.5 17.5" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8.05068 14.0547C8.89226 12.4629 9.31309 11.667 9.99984 11.667C10.6866 11.667 11.1074 12.4629 11.949 14.0547L12.5221 15.1387C13.1684 16.3611 13.4916 16.9723 13.2567 17.2662C13.1935 17.3452 13.1103 17.4104 13.0134 17.4567C12.6533 17.6287 11.9922 17.2821 10.6701 16.5888C10.3768 16.435 10.2302 16.3582 10.0698 16.3444C10.0233 16.3404 9.97642 16.3404 9.92984 16.3444C9.76951 16.3582 9.62284 16.435 9.32959 16.5888C8.00746 17.2821 7.3464 17.6287 6.98627 17.4567C6.88946 17.4104 6.80621 17.3452 6.74304 17.2662C6.50808 16.9723 6.83125 16.3611 7.47758 15.1387L8.05068 14.0547Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1.25"
      />
      <path 
        d="M10 2.5V4.16667" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 7.5V9.16667" 
        stroke="currentColor" 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExtraKilometerCostIcon;

