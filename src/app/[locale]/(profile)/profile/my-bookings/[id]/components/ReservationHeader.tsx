'use client';

/**
 * Reservation Header Component
 * Displays reservation status and action buttons
 */

import React from 'react';
import { getStatusConfig } from '../utils/statusConfig';
import ReservationActions from './ReservationActions';

interface ReservationHeaderProps {
  reservationStatus: number;
  reservationId: number;
  locale: string;
  currentEndDate?: string;
  finalAmount?: number;
}

export default function ReservationHeader({
  reservationStatus,
  reservationId,
  locale,
  currentEndDate,
  finalAmount,
}: ReservationHeaderProps) {
  const isArabic = locale === 'ar';
  
  // Determine status based on finalAmount condition (like the condition in ReservationCard)
  // If finalAmount >= 0, use reservationStatus; otherwise, if status is 1, use 2, else use reservationStatus
  const statusForConfig = (finalAmount ?? 0) >= 0
    ? reservationStatus
    : (reservationStatus == 1 ? 2 : reservationStatus);
  
  const statusConfig = getStatusConfig(statusForConfig, isArabic);

  // Status 4 (Active Now) should use flex-col on mobile - use original reservationStatus
  const isStatus4 = reservationStatus == 4;

  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className={`flex flex-row  justify-between ${isStatus4 ? 'max-md:flex-col max-md:items-start' : '  items-center   sm:items-center'} bg-white gap-3 sm:gap-0 py-3 px-4 sm:py-[15px] sm:px-[18px] border-b-2 border-[#ECEEF2]`}>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-medium text-gray-700">
            {isArabic ? 'الحالة:' : 'Status:'}
          </span>
          <div className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-2 ${statusConfig.className}`}>
            {statusConfig.label}
          </div>
        </div>
        <ReservationActions
          reservationStatus={reservationStatus}
          reservationId={reservationId}
          locale={locale}
          currentEndDate={currentEndDate}
        />
      </div>
    </div>
  );
}

