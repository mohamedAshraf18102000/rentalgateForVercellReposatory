import React from 'react';

interface OffersIconProps {
    className?: string;
    width?: number | string;
    height?: number | string;
}

const OffersIcon: React.FC<OffersIconProps> = ({
    className = '',
    width = 15,
    height = 24
}) => {
    return (

        <svg width="18" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C11.6117 4.48692 11.2315 5.82158 10 8C8.79908 7.4449 8.5 7 8 5.75C6 8 4 11 4 14C4 18.4183 7.58172 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 17L14 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 13H10.009M13.991 17H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export default OffersIcon;

