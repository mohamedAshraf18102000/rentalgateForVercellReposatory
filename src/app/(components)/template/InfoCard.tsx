'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowIcon } from '@/constants/icons';

interface InfoCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  locale?: string;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  image,
  icon,
  onClick,
  isSelected = false,
  locale = 'en',
  className = '',
}) => {
  const isRTL = locale === 'ar';

  return (
    <div
      className={`referral-card-wrapper rounded-[18px] ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`referral-card-inner rounded-[18px] py-[12px] px-[14px] relative overflow-hidden w-full h-full ${isSelected ? 'bg-primary/5' : ''}`}>
        <div className="relative z-10 flex items-center justify-between gap-4 " dir={"rtl"}>
          {/* Left Arrow Icon or Custom Icon */}
          <div className={`${isRTL ? 'order-3' : 'order-1'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              {icon ? (
                <div className="h-full w-full flex items-center justify-center">
                  {icon}
                </div>
              ) : (
                <ArrowIcon
                  className={`h-full w-full text-black ${isRTL ? '' : 'rotate-180'}`}
                />
              )}
            </div>
          </div>

          {/* Center Content */}
          <div
            className={`flex-1 ${isRTL ? 'text-right order-2' : 'text-left order-2'}`}
          >
            <h3 className="text-sm font-bold text-black mb-2 max-md:text-[14px]">
              {title}
            </h3>
            <p className="text-sm text-[#757575] leading-relaxed max-md:text-[9px]">
              {description}
            </p>
          </div>

          {/* Right Image */}
          {image && (
            <div className={`w-[43px] h-[43px] ${isRTL ? 'order-1' : 'order-3'}`}>
              <Image
                src={image}
                alt={title}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

