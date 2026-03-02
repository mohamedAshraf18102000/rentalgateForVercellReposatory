import React from 'react';

interface ApprovedIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ApprovedIcon: React.FC<ApprovedIconProps> = ({ 
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
      <path d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625L12.375 11ZM12.375 11H14.6667H12.375ZM11 9.625V5.5V9.625Z" fill="white"/>
      <path d="M12.375 11C12.375 11.7594 11.7594 12.375 11 12.375C10.2406 12.375 9.625 11.7594 9.625 11C9.625 10.2406 10.2406 9.625 11 9.625M12.375 11C12.375 10.2406 11.7594 9.625 11 9.625M12.375 11H14.6667M11 9.625V5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.67801 2.75C7.48192 2.82327 7.28908 2.90319 7.09975 2.98949M18.9915 14.9427C19.0852 14.7399 19.1715 14.533 19.2502 14.3225M16.9575 17.751C17.1149 17.604 17.267 17.4516 17.4135 17.2938M13.9967 19.5913C14.1747 19.5242 14.3498 19.4517 14.5222 19.3738M11.1432 20.1611C10.9316 20.1684 10.7185 20.1684 10.5067 20.1611M7.13861 19.3787C7.30435 19.4532 7.47276 19.523 7.64364 19.5876M4.28342 17.3441C4.40871 17.4769 4.53801 17.6059 4.67112 17.7309M2.41355 14.3591C2.48219 14.5404 2.55653 14.7188 2.63632 14.8943M1.83813 11.4632C1.83219 11.2724 1.8322 11.0805 1.83813 10.8895M2.40691 8.00904C2.47434 7.82985 2.54733 7.65337 2.62567 7.47982M4.26826 5.02263C4.40087 4.88138 4.53797 4.74442 4.67937 4.61197" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.1667 11.0007C20.1667 5.93804 16.0626 1.83398 11 1.83398" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ApprovedIcon;


