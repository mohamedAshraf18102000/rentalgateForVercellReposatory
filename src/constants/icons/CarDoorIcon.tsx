import React from 'react';

interface CarDoorIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const CarDoorIcon: React.FC<CarDoorIconProps> = ({ 
  className = '', 
  width = 24, 
  height = 26 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 26" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 11.0778V22.7567C1 23.8083 1.8525 24.6608 2.90411 24.6608H20.5658C21.6174 24.6608 22.4699 23.8083 22.4699 22.7567V11.0778M1 11.0778H22.4699M1 11.0778C1 10.6289 1.17832 10.1984 1.49572 9.88097L9.36556 2.01113C9.51285 1.86384 9.68322 1.74111 9.87084 1.65062C10.3163 1.43574 10.6572 1.28634 11.1178 1.11361C11.3226 1.0368 11.5401 1 11.7588 1H20.5658C21.6174 1 22.4699 1.8525 22.4699 2.90411V11.0778M18.877 14.7583H14.0573" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CarDoorIcon;

