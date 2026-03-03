import React from 'react';
import { SelectSeparator } from '@/app/(components)/ui/select';
import { PriceIcon } from '@/constants/icons';

interface CarInfoSectionProps {
  carName: string;
  categoryText: string;
  numberOfPassengers: number;
  discountPercentage: number;
  t: (key: string) => string;
  currentPrice: number;
  originalPrice: number;
  // Optional fields for formatted car name
  modelArabicName?: string;
  modelEnglishName?: string;
  brandArabicName?: string;
  brandName?: string;
  year?: number;
  locale?: string;
}

export const CarInfoSection: React.FC<CarInfoSectionProps> = ({
  carName,
  categoryText,
  numberOfPassengers,
  discountPercentage,
  currentPrice,
  originalPrice,
  t,
  modelArabicName,
  modelEnglishName,
  brandArabicName,
  brandName,
  year,
  locale = 'ar',
}) => {
  const hasOffer = originalPrice > currentPrice;
  const isArabic = locale === 'ar';
  
  // Build car name in same format as ReservationCard
  const displayCarName = modelArabicName && modelEnglishName && brandArabicName && brandName && year
    ? `${isArabic ? modelArabicName : modelEnglishName} - ${isArabic ? brandArabicName : brandName} - ${year}`
    :  '';
  
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-base sm:text-[18px] text-gray-700 mb-2 font-bold wrap-break-word ">{displayCarName}</p>
        {discountPercentage > 0 && (
          <div className="bg-[#187749] text-white py-1 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded-full ">
             {discountPercentage}% -
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">

        <div className="flex gap-2 sm:gap-3 items-center flex-wrap mt-4 sm:mt-6 mb-4 sm:mb-6">
          <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
            {categoryText}
          </span>
          <span className="text-gray-700 text-[12px] sm:text-[14px]">
            {numberOfPassengers} {t('passengers')}
          </span>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
         
          <div className="flex items-baseline gap-2">
            {hasOffer && (
              <span className="text-[10px] sm:text-[12px] text-[#949494] font-extralight line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-[12px] sm:text-[14px] font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(currentPrice > 0 ? currentPrice : 0)}
              <PriceIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
        </div>
      </div>
      <SelectSeparator />
    </div>
  );
};

