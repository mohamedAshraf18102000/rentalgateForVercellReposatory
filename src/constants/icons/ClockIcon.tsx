import React from 'react';

interface ClockIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ClockIcon: React.FC<ClockIconProps> = ({
  className = '',
  width = 16,
  height = 16,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.33765 13.9993H6.40362C4.01345 13.9993 2.81837 13.9993 2.07584 13.2427C1.33331 12.4861 1.33331 11.2683 1.33331 8.83268C1.33331 6.39709 1.33331 5.1793 2.07584 4.42266C2.81837 3.66602 4.01345 3.66602 6.40362 3.66602H8.93878C11.3289 3.66602 12.524 3.66602 13.2666 4.42266C13.8378 5.00481 13.9696 5.85995 14 7.33268"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5667 12.566L11.6667 11.966V10.466M8.66669 11.666C8.66669 13.3229 10.0098 14.666 11.6667 14.666C13.3236 14.666 14.6667 13.3229 14.6667 11.666C14.6667 10.0091 13.3236 8.66602 11.6667 8.66602C10.0098 8.66602 8.66669 10.0091 8.66669 11.666Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 3.66732L10.6005 3.46128C10.2704 2.43458 10.1054 1.92123 9.71262 1.6276C9.31975 1.33398 8.79802 1.33398 7.75442 1.33398H7.57895C6.53538 1.33398 6.01359 1.33398 5.62076 1.6276C5.22793 1.92123 5.06293 2.43458 4.73291 3.46128L4.66669 3.66732"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockIcon;
