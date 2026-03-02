'use client';

/**
 * Cancellation Reason Section Component
 * Displays cancellation reason if reservation was cancelled
 */

import React from 'react';
import { ReservationDetails } from '@/lib/api/reservation-details';

interface CancellationReasonSectionProps {
  reservation: ReservationDetails;
  locale: string;
}

export default function CancellationReasonSection({
  reservation,
  locale,
}: CancellationReasonSectionProps) {
  const isArabic = locale === 'ar';

  if (!reservation.cancellationReasonAr && !reservation.cancellationReasonEn) {
    return null;
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
      <h4 className="font-bold text-red-800 mb-2">
        {isArabic ? 'سبب الإلغاء' : 'Cancellation Reason'}
      </h4>
      <p className="text-sm text-red-700">
        {isArabic ? reservation.cancellationReasonAr : reservation.cancellationReasonEn}
      </p>
      {reservation.cancellationReasonNotes && (
        <p className="text-sm text-red-600 mt-2 italic">
          {reservation.cancellationReasonNotes}
        </p>
      )}
    </div>
  );
}

