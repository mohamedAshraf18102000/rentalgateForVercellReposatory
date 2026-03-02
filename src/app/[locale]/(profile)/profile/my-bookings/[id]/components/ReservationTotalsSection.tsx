'use client';

/**
 * Reservation Totals Section Component
 * Displays total costs after all extensions including:
 * - Total base cost
 * - Total extra hours cost
 * - Total services cost
 * - Total insurance cost
 * - Total final amount
 * - Total days
 * - Last end date and time
 */

import React from 'react';
import { SeparatorWithContent } from '@/app/(components)';
import { formatDateTime, formatPrice } from '../utils/formatters';
import { ReservationTotals } from '@/lib/api/reservation-details';
import { PriceIcon } from '@/constants/icons';

interface ReservationTotalsSectionProps {
  totals: ReservationTotals;
  locale: string;
}

export default function ReservationTotalsSection({
  totals,
  locale,
}: ReservationTotalsSectionProps) {
  const isArabic = locale === 'ar';
  const lastEndDateTime = formatDateTime(`${totals.lastEndDate}T${totals.lastEndTime}`, isArabic);

  return (
    <div className="mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {isArabic ? 'الإجماليات النهائية بعد التمديدات' : 'Final Totals After Extensions'}
        </h3>
      </SeparatorWithContent>

      <div className="border border-[#ECEEF2] rounded-[18px] p-4 mt-4 bg-[#ECEEF2]">
        <div className="space-y-4">
          {/* Total Days */}
          <div className="flex justify-between items-center pb-3 border-b border-[#ECEEF2]">
            <span className="text-sm font-semibold text-gray-700">
              {isArabic ? 'إجمالي الأيام' : 'Total Days'}
            </span>
            <span className="text-sm font-bold text-gray-900">
              {totals.totalDays} {isArabic ? 'يوم' : 'days'}
            </span>
          </div>

          {/* Last End Date */}
          <div className="flex justify-between items-center pb-3 border-b border-[#ECEEF2]">
            <span className="text-sm font-semibold text-gray-700">
              {isArabic ? 'آخر تاريخ انتهاء' : 'Last End Date'}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {lastEndDateTime.date} {lastEndDateTime.time}
            </span>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              {isArabic ? 'تفاصيل التكلفة' : 'Cost Breakdown'}
            </h4>

            {/* Total Base Cost */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {isArabic ? 'إجمالي التكلفة الأساسية' : 'Total Base Cost'}
              </span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {formatPrice(totals.totalBaseCost > 0 ? totals.totalBaseCost : 0)}
                <PriceIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Total Extra Hours Cost */}
            {totals.totalExtraHoursCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'إجمالي تكلفة الساعات الإضافية' : 'Total Extra Hours Cost'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(totals.totalExtraHoursCost > 0 ? totals.totalExtraHoursCost : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* Total Services Cost */}
            {totals.totalServicesCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'إجمالي تكلفة الخدمات' : 'Total Services Cost'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(totals.totalServicesCost > 0 ? totals.totalServicesCost : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* Total Insurance Cost */}
            {totals.totalInsuranceCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'إجمالي تكلفة التأمين' : 'Total Insurance Cost'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(totals.totalInsuranceCost > 0 ? totals.totalInsuranceCost : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>

          {/* Total Final Amount */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
            <span className="text-lg font-bold text-gray-900">
              {isArabic ? 'الإجمالي النهائي' : 'Total Final Amount'}
            </span>
            <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(totals.totalFinalAmount > 0 ? totals.totalFinalAmount : 0)}
              <PriceIcon className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

