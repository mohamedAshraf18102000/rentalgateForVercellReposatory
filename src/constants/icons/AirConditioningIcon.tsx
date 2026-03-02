import React from 'react';

interface AirConditioningIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const AirConditioningIcon: React.FC<AirConditioningIconProps> = ({ 
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
        d="M23.3333 29.3337C26.2788 29.3337 28.6667 26.9458 28.6667 24.0003C28.6667 22.5783 28.1103 21.2865 27.2032 20.3303C26.5276 19.6182 26.1897 19.2621 26.0949 19.0242C26 18.7863 26 18.4717 26 17.8423V5.33366C26 3.8609 24.8061 2.66699 23.3333 2.66699C21.8605 2.66699 20.6667 3.8609 20.6667 5.33366V17.8423C20.6667 18.4717 20.6667 18.7863 20.5717 19.0242C20.4769 19.2621 20.1391 19.6182 19.4635 20.3303C18.5564 21.2865 18 22.5783 18 24.0003C18 26.9458 20.3879 29.3337 23.3333 29.3337Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12.0605 6.66699V11.542M12.0605 11.542V19.1254M12.0605 11.542L14.7878 8.83366M12.0605 11.542L9.33325 8.83366M12.0605 19.1254L12.0605 24.0003M12.0605 19.1254L9.33325 21.8337M12.0605 19.1254L14.7878 21.8337M5.51507 12.6253L8.24235 15.3337M8.24235 15.3337L5.51507 18.0419M8.24235 15.3337H15.3333M8.24235 15.3337H3.33325" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AirConditioningIcon;

