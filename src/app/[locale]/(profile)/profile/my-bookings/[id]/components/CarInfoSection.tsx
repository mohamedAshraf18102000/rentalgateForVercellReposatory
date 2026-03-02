'use client';

/**
 * Car Info Section Component
 * Displays car name, category, passengers, rental duration, and price
 */

import React from 'react';
import { PriceIcon } from '@/constants/icons';
import { formatPrice } from '../utils/formatters';

interface CarInfoSectionProps {
  carName: string;
  numberOfPassengers: number;
  days: number;
  total: number;
  totalDiscount: number;
  carType: string;
  locale: string;
  reservationId: string;
  // Optional fields for formatted car name
  modelArabicName?: string;
  modelEnglishName?: string;
  brandArabicName?: string;
  brandName?: string;
  year?: number;
}

export default function CarInfoSection({
  reservationId,
  carName,
  days,
  total,
  totalDiscount,
  numberOfPassengers,
  carType,
  locale,
  modelArabicName,
  modelEnglishName,
  brandArabicName,
  brandName,
  year,
}: CarInfoSectionProps) {
  const isArabic = locale === 'ar';

  // Build car name in same format as ReservationCard
  const displayCarName = modelArabicName && modelEnglishName && brandArabicName && brandName && year
    ? `${isArabic ? modelArabicName : modelEnglishName} - ${isArabic ? brandArabicName : brandName} - ${year}`
    : carName;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-base sm:text-[18px] text-gray-700 mb-2 font-bold wrap-break-word">
          {displayCarName}
        </p>
        <div className="shrink-0 min-h-[32px] flex items-start">
          <span className="text-[#1A1A1A] text-[12px] font-semibold block bg-[#ECEEF2] rounded-lg px-2 py-1">
            <span className='text-[#595959] pl-[2px]' > {isArabic ? 'رقم الحجز:' : 'Reservation Number:'}</span> {"  "} {reservationId}
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 sm:gap-3 items-center">
          <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
            {carType}
          </span>
          <span className="text-gray-700 text-[12px] sm:text-[14px]">
            {isArabic ? `${numberOfPassengers} راكب` : `${numberOfPassengers} Passengers`}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <p className="flex gap-2 items-center flex-wrap">
            <span className="text-[#1A1A1A] font-normal text-[12px] sm:text-[14px]">
              {isArabic ? 'مدة الإيجار:' : 'Rental Duration:'}
            </span>
            <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
              {days} {isArabic ? 'يوم' : 'days'}
            </span>
          </p>
          <div className="flex items-baseline gap-2">
            {totalDiscount > 0 && (
              <span className="text-xs sm:text-sm text-[#949494] font-normal line-through">
                {formatPrice(total > 0 && totalDiscount > 0 ? total + totalDiscount : 0)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(total > 0 ? total : 0)}
              <PriceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

