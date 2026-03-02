import React from 'react';

interface CancelledIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const CancelledIcon: React.FC<CancelledIconProps> = ({ 
  className = '', 
  width = 22, 
  height = 22 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 22 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M11.0007 1.08398C16.4772 1.08432 20.9167 5.52437 20.9167 11.001C20.9165 16.4774 16.4771 20.9167 11.0007 20.917C5.52395 20.917 1.08386 16.4776 1.08368 11.001C1.0837 5.52417 5.52386 1.08398 11.0007 1.08398ZM16.2897 5.70996C15.8993 5.31992 15.2661 5.31982 14.8757 5.70996L10.9987 9.58594L7.12274 5.70996C6.73223 5.31985 6.09909 5.31967 5.70868 5.70996C5.3183 6.10034 5.31856 6.73346 5.70868 7.12402L9.58466 11.001L5.70966 14.877C5.3194 15.2674 5.31952 15.9005 5.70966 16.291C6.10014 16.6813 6.73324 16.6813 7.12372 16.291L10.9987 12.415L14.8747 16.291C15.2652 16.6812 15.8983 16.6814 16.2888 16.291C16.6791 15.9006 16.679 15.2675 16.2888 14.877L12.4128 11.001L16.2897 7.12402C16.68 6.73353 16.68 6.10041 16.2897 5.70996Z" fill="white"/>
    </svg>
  );
};

export default CancelledIcon;


