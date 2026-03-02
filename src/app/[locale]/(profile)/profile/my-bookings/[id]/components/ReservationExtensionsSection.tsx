'use client';

/**
 * Reservation Extensions Section Component
 * Displays all reservation extensions with their dates and details
 */

import React from 'react';
import { SeparatorWithContent } from '@/app/(components)';
import { formatDateTime, formatPrice } from '../utils/formatters';
import { ReservationExtension } from '@/lib/api/reservation-details';
import { PriceIcon } from '@/constants/icons';
import { getStatusConfig as getStatusConfigUtil } from '../utils/statusConfig';

interface ReservationExtensionsSectionProps {
  extensions: ReservationExtension[];
  locale: string;
}

export default function ReservationExtensionsSection({
  extensions,
  locale,
}: ReservationExtensionsSectionProps) {
  const isArabic = locale === 'ar';

  // Status button styles and icons to match design (same as ReservationCard)
  const getStatusConfig = (status: number, finalAmount: number) => {
    // Determine status based on finalAmount condition (like the condition in ReservationCard)
    // If finalAmount >= 0, use status; otherwise, if status is 1, use 2, else use status
    const statusForConfig = finalAmount > 0
      ? status
      : (status === 1 ? 2 : status);

    return getStatusConfigUtil(statusForConfig, isArabic);
  };

  if (!extensions || extensions.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 mt-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {isArabic ? 'تواريخ التمديدات' : 'Extension Dates'}
        </h3>
      </SeparatorWithContent>

      <div className="space-y-4 mt-4 border border-[#ECEEF2] rounded-[18px] p-4 bg-[#ECEEF2]">
        {extensions.map((extension, index) => {
          const extensionDateTime = formatDateTime(extension.extensionDate, isArabic);
          const endDateTime = formatDateTime(`${extension.endDate}T${extension.endTime}`, isArabic);

          // Calculate start date by subtracting days from end date
          const endDateObj = new Date(`${extension.endDate}T${extension.endTime}`);
          const startDateObj = new Date(endDateObj);
          startDateObj.setDate(startDateObj.getDate() - extension.days);
          const startDateTime = formatDateTime(startDateObj.toISOString(), isArabic);

          // Get status config using the same logic as ReservationCard
          const statusConfig = getStatusConfig(extension.reservationStatus, extension.finalAmount);

          return (
            <div
              key={extension.reservationExtensionId}
              className="bg-white border border-[#ECEEF2] rounded-[18px] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-3">
                {/* Extension Number */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    {isArabic ? `تمديد #${extension.reservationExtensionId}` : `Extension #${extension.reservationExtensionId}`}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Extension Date */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'تاريخ بدا التمديد' : 'Extension Start Date'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {startDateTime.date} {startDateTime.time}
                  </span>
                </div>

                {/* New End Date */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'تاريخ انتهاء التمديد' : 'Extension End Date'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {endDateTime.date} {endDateTime.time}
                  </span>
                </div>

                {/* Days */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isArabic ? 'عدد الأيام' : 'Days'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {extension.days} {isArabic ? 'يوم' : 'days'}
                  </span>
                </div>

                {/* Invoice Details Section */}
                <div className="pt-2 border-t border-[#ECEEF2] space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {isArabic ? 'تفاصيل الفاتورة' : 'Invoice Details'}
                  </h4>

                  {/* Base Price */}
                  {extension.basePrice !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'السعر الأساسي' : 'Base Price'}
                        <span className="text-[#595959] text-xs"> {isArabic ? '(غير شامل الضريبة)' : '(excluding tax)'}  </span>
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {formatPrice(extension.basePrice)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Insurance */}
                  {extension.insurance === 1 && extension.insuranceValue !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'التأمين' : 'Insurance'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {formatPrice(extension.insuranceValue)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Services Cost */}
                  {extension.servicesCost !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'تكلفة الخدمات' : 'Services Cost'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {formatPrice(extension.servicesCost > 0 ? extension.servicesCost : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Extra Hours */}
                  {extension.extraHours !== 0 && extension.extraHoursValue !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'ساعات إضافية' : 'Extra Hours'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {extension.extraHours} {isArabic ? 'ساعة' : 'hours'} - {formatPrice(extension.extraHoursValue > 0 ? extension.extraHoursValue : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Points */}
                  {extension.points !== 0 && extension.pointsValue !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'النقاط المستخدمة' : 'Points Used'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {extension.points} {isArabic ? 'نقطة' : 'points'} - {formatPrice(extension.pointsValue > 0 ? extension.pointsValue : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Promo Code */}
                  {extension.promoCode && extension.promoValue !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'كود الخصم' : 'Promo Code'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        - {formatPrice(extension.promoValue > 0 ? extension.promoValue : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Amount */}
                  {extension.amount !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'المبلغ' : 'Amount'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {formatPrice(extension.amount > 0 ? extension.amount : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Discount */}
                  {/* {extension.discount !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-600">
                        {isArabic ? 'الخصم' : 'Discount'}
                      </span>
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        -{formatPrice(extension.discount > 0 ? extension.discount : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )} */}

                  {/* Tax */}
                  {extension.tax !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isArabic ? 'الضريبة (15%)' : 'Tax (15%)'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        {formatPrice(extension.tax > 0 ? extension.tax : 0)}
                        <PriceIcon className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Final Amount */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#ECEEF2]">
                    <span className="text-sm font-semibold text-gray-900">
                      {isArabic ? 'المبلغ النهائي' : 'Final Amount'}
                    </span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      {formatPrice(extension.finalAmount > 0 ? extension.finalAmount : 0)}
                      <PriceIcon className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

