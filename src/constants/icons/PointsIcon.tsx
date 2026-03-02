import React from 'react';

interface PointsIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const PointsIcon: React.FC<PointsIconProps> = ({ 
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
        d="M10.6665 15.8661C8.53104 15.8661 6.79987 14.135 6.79987 11.9995C6.79987 9.86398 8.53104 8.13281 10.6665 8.13281C12.802 8.13281 14.5332 9.86398 14.5332 11.9995C14.5332 14.135 12.802 15.8661 10.6665 15.8661Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17.3333 19.9993H14.6667C13.9594 19.9993 13.2811 19.7184 12.781 19.2183C12.281 18.7182 12 18.0399 12 17.3327C12 16.6254 12.281 15.9472 12.781 15.4471C13.2811 14.947 13.9594 14.666 14.6667 14.666H18.6667C19.4667 14.666 20.1333 14.9327 20.5333 15.466L28 22.666" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M22.6666 28.0004L20.5333 26.1337C20.1333 25.6004 19.4666 25.3337 18.6666 25.3337H13.3333C11.8666 25.3337 10.5333 24.8004 9.59996 23.7337L3.46663 17.867C2.95211 17.3808 2.65181 16.7101 2.63181 16.0025C2.61181 15.2948 2.87373 14.6082 3.35996 14.0937C3.84619 13.5792 4.5169 13.2789 5.22454 13.2589C5.93217 13.2389 6.61877 13.5008 7.13329 13.987L12.7333 19.187" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M29.3334 21.334L21.3334 29.334" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M24 10.666C21.7909 10.666 20 8.87515 20 6.66602C20 4.45688 21.7909 2.66602 24 2.66602C26.2091 2.66602 28 4.45688 28 6.66602C28 8.87515 26.2091 10.666 24 10.666Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PointsIcon;

