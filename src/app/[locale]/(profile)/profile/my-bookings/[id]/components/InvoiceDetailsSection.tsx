'use client';

/**
 * Invoice Details Section Component
 * Displays detailed breakdown of reservation pricing including:
 * - Rental duration cost
 * - Additional services
 * - Pickup and delivery fees
 * - Discounts and offers
 * - Final total
 */

import React from 'react';
import { PriceIcon, FreeIcon } from '@/constants/icons';
import { formatPrice } from '../utils/formatters';
import { ReservationDetails } from '@/lib/api/reservation-details';

interface InvoiceDetailsSectionProps {
  reservation: ReservationDetails;
  locale: string;
}

export default function InvoiceDetailsSection({
  reservation,
  locale,
}: InvoiceDetailsSectionProps) {
  const isArabic = locale === 'ar';

  // Calculate rental duration cost (basePrice is total for all days)
  // TODO: Backend should provide dailyPriceAfterDiscount
  const dailyPriceAfterDiscount = reservation.basePrice / reservation.days;
  const rentalDurationCost = dailyPriceAfterDiscount * reservation.days;

  // Calculate subtotal (excluding tax) - already provided by API
  const subtotal = reservation.basePrice;

  // Calculate points from discount (50 points = 1 SAR)
  const POINTS_SPENT_PER_SAR = 50;
  const calculatedPoints = reservation.pointsDiscount > 0 
    ? Math.round(reservation.pointsDiscount * POINTS_SPENT_PER_SAR)
    : 0;

  // TODO: Backend should provide:
  // - dailyPriceAfterDiscount: السعر اليومي بعد الخصم
  // - carOfferDiscount: خصم عرض السيارة (إذا كان هناك عرض)
  // - totalPoints: عدد النقاط المستخدمة (حالياً نحسبها من pointsDiscount)

  return (
    <div className="space-y-6 mt-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* تفاصيل السعر - Price Details */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isArabic ? 'تفاصيل السعر' : 'Price Details'}
      </h3>
      <div className="border border-[#ECEEF2] rounded-[18px] p-4 flex flex-col gap-4">
        <div>
          {/* تكلفة مدة الإيجار: */}
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-bold text-gray-900">
              {isArabic ? (
                <>
                  تكلفة مدة الإيجار: <span className="text-[#595959]"> ( {reservation.days} يوم )</span>
                </>
              ) : (
                <>
                  Rental duration cost (<span className="text-[#595959]">{reservation.days} days</span>)
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {/* المجموع الفرعي */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                {isArabic
                  ? 'المجموع الفرعي (غير شامل الضريبة)'
                  : 'Subtotal (excluding tax)'}
              </span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {formatPrice(subtotal)}
                <PriceIcon className="w-4 h-4" />
              </span>
            </div>

            {/* سعر الساعات الأضافية */}
            {reservation.extraHoursCostWithVat > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'سعر الساعات الأضافية' : 'Additional hours price'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(reservation.extraHoursCostWithVat)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* سعر الخدمة الأضافية */}
            {reservation.servicesCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'سعر الخدمة الأضافية' : 'Additional service price'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(reservation.servicesCost)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* التأمين الشامل */}
            {reservation.insuranceValue > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'التأمين الشامل' : 'Comprehensive insurance'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(reservation.insuranceValue)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* باقات الكيلومترات الإضافية */}
            {reservation.extraKmCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'باقات الكيلومترات الإضافية' : 'Extra kilometers packages'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(reservation.extraKmCost)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* رسوم الأستلام والتسليم - Pickup and Delivery Fees */}
        {reservation.anotherBranchCost > 0 && (
          <>
            <hr className="border-t border-[#ECEEF2]" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isArabic ? 'رسوم الأستلام والتسليم' : 'Pickup and Delivery Fees'}
              </h3>
              <div className="space-y-3">
                {/* رسوم فرع آخر */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {isArabic ? 'رسوم فرع آخر' : 'Another Branch Price'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {formatPrice(reservation.anotherBranchCost)}
                    <PriceIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* الخصومات و العروض - Discounts & Offers */}
        {(reservation.memberShipDiscount > 0 ||
          reservation.pointsDiscount > 0 ||
          reservation.promoDiscount > 0 ||
          reservation.extraHoursCostWithVat < 0 ||
          (reservation.totalDiscount > 0 && reservation.totalDiscount !== (reservation.pointsDiscount + reservation.promoDiscount + reservation.memberShipDiscount))) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isArabic ? 'الخصومات و العروض' : 'Discounts & Offers'}
            </h3>
            <div className="space-y-3">
              {/* خصم عضوية */}
              {reservation.memberShipDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {isArabic ? 'خصم عضوية' : 'Membership discount'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                    <div className="leading-none mt-0.5">
                      - {formatPrice(reservation.memberShipDiscount > 0 ? reservation.memberShipDiscount : 0)}
                    </div>
                    <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                  </span>
                </div>
              )}

              {/* خصم أستبدال (النقاط) */}
              {reservation.pointsDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {isArabic
                      ? `خصم النقاط${calculatedPoints > 0 ? ` (${calculatedPoints.toLocaleString()} نقطة)` : ''}`
                      : `Points discount${calculatedPoints > 0 ? ` (${calculatedPoints.toLocaleString()} points)` : ''}`}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                    <div className="leading-none mt-0.5">
                      - {formatPrice(reservation.pointsDiscount > 0 ? reservation.pointsDiscount : 0)}
                    </div>
                    <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                  </span>
                </div>
              )}

              {/* خصم كوبون */}
              {reservation.promoDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {isArabic ? 'خصم (كوبون)' : 'Discount (coupon)'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                    <div className="leading-none mt-0.5">
                      - {formatPrice(reservation.promoDiscount > 0 ? reservation.promoDiscount : 0)}
                    </div>
                    <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                  </span>
                </div>
              )}

              {/* خصم الساعات الأضافية */}
              {reservation.extraHoursCostWithVat < 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    {isArabic ? 'خصم الساعات الأضافية' : 'Additional hours discount'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                    <div className="leading-none mt-0.5">
                      - {formatPrice(reservation.extraHoursCostWithVat < 0 ? Math.abs(reservation.extraHoursCostWithVat) : 0)}
                    </div>
                    <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                  </span>
                </div>
              )}

            </div>
          </div>
        )}
        <hr className="border-t border-[#ECEEF2]" />

        {/* الضريبة - Tax */}
        {reservation.tax > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {isArabic ? 'الضريبة (15%)' : 'Tax (15%)'}
            </span>
            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
              {formatPrice(reservation.tax > 0 ? reservation.tax : 0)}
              <PriceIcon className="w-4 h-4" />
            </span>
          </div>
        )}

        {/* الأجمالي - Total */}
        <div className="border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {isArabic ? 'الأجمالي' : 'Total'}
            </span>
            <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(reservation.total > 0 ? reservation.total : 0)}
              <PriceIcon className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

