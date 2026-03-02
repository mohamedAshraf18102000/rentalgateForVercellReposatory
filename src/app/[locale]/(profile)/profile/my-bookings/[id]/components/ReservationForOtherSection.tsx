'use client';

/**
 * Reservation For Other Section Component
 * Displays information about the person the reservation is made for
 */

import React from 'react';
import { SeparatorWithContent } from '@/app/(components)';
import { InfoCard } from '@/app/(components)/template/InfoCard';
import Image from 'next/image';

interface ReservationForOtherSectionProps {
  reservationForOther: {
    id: number;
    reservationId: number;
    fullName: string;
    phone: string;
    nationalId: string;
    licenseImage: string;
  };
  locale: string;
}

export default function ReservationForOtherSection({
  reservationForOther,
  locale,
}: ReservationForOtherSectionProps) {
  const isArabic = locale === 'ar';
  const licenseImageUrl = `https://viganium.co/uploads/${reservationForOther.licenseImage}`;

  return (
    <div className="mb-6 space-y-4 ">
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {isArabic ? 'هذا الحجز تم لشخص آخر' : 'This reservation was made for another person'}
        </h3>
      </SeparatorWithContent>

      <div className="bg-[#ECEEF2] border border-blue-200 rounded-lg p-4 space-y-4"> 
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-600"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h4 className="text-base font-semibold text-gray-900">
              {isArabic ? 'معلومات الشخص:' : 'Person Information:'}
            </h4>
          </div>

          {/* Full Name */}
          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-600 min-w-[80px]">
              {isArabic ? 'الاسم الكامل:' : 'Full Name:'}
            </span>
            <span className="text-sm text-gray-900 font-medium flex-1">
              {reservationForOther.fullName}
            </span>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-600 min-w-[80px]">
              {isArabic ? 'رقم الجوال:' : 'Phone Number:'}
            </span>
            <span className="text-sm text-gray-900 font-medium" dir="ltr">
              {reservationForOther.phone}
            </span>
          </div>

          {/* National ID */}
          <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-600 min-w-[80px]">
              {isArabic ? 'رقم الهوية:' : 'National ID:'}
            </span>
            <span className="text-sm text-gray-900 font-mono font-medium flex-1">
              {reservationForOther.nationalId}
            </span>
          </div>
        </div>

        {/* License Image */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-600"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h4 className="text-base font-semibold text-gray-900">
              {isArabic ? 'صورة الرخصة:' : 'License Image:'}
            </h4>
          </div>
          <div className="relative w-full max-w-full h-[200px] mx-auto rounded-lg overflow-hidden border border-gray-300 bg-gray-50 py-4">
            <Image
              src={licenseImageUrl}
              alt={isArabic ? 'صورة الرخصة' : 'License Image'}
              fill
              className="object-contain py-4"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

