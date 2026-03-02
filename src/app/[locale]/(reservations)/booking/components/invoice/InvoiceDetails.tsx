'use client';

/**
 * Invoice Details Component
 * Displays detailed breakdown of booking pricing including:
 * - Rental duration cost
 * - Additional services
 * - Pickup and delivery fees
 * - Discounts and offers
 * - Final total
 */

import React from 'react';
import { PriceIcon, FreeIcon } from '@/constants/icons';
import type { InvoiceDetailsProps } from './InvoiceDetails.types';

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  pricingData,
  locale,
  formatPrice,
}) => {
  const isArabic = locale === 'ar';

  // Calculate rental duration cost
  const rentalDurationCost = pricingData.dailyPriceAfterDiscount * pricingData.numOfDays;

  // Calculate points value from totalPoints (50 points = 1 SAR)
  const POINTS_SPENT_PER_SAR = 50;
  const pointsValue = pricingData.totalPoints > 0 
    ? pricingData.totalPoints / POINTS_SPENT_PER_SAR 
    : 0;

  // Use basePrice directly from API, fallback to calculated value if not available
  // Check for basePrice with proper null/undefined/0 handling


  return (
    <div className="space-y-6 mt-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* تفاصيل السعر - Price Details */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isArabic ? 'تفاصيل السعر' : 'Price Details'}
      </h3>
      <div className="border border-[#ECEEF2] rounded-[18px] shadow-sm p-4 flex flex-col gap-4">

        <div >
          {/* تكلفة مدة الإيجار: */}
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-bold text-gray-900">
              {isArabic ? (
                <>
                  تكلفة مدة الإيجار: <span className="text-[#595959]"> ( {pricingData.numOfDays} يوم )</span>
                </>
              ) : (
                <>
                  Rental duration cost (<span className="text-[#595959]">{pricingData.numOfDays} days</span>)
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {/* المجموع الفرعي */}
            <div className="flex justify-between items-center mt-4" >
              <span className="text-sm text-gray-700">
                {isArabic
                  ? 'المجموع الفرعي (غير شامل الضريبة)'
                  : 'Subtotal (excluding tax)'}
              </span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {formatPrice(pricingData.basePrice ? pricingData.basePrice : pricingData.dailyPriceAfterDiscount)}
                <PriceIcon className="w-4 h-4" />
              </span>
            </div>

            {/* سعر الساعات الأضافية */}
            {pricingData.extraHoursCostWithVat > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'سعر الساعات الأضافية' : 'Additional hours price'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(pricingData.extraHoursCostWithVat > 0 ? pricingData.extraHoursCostWithVat : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* سعر الخدمة الأضافية */}
            {pricingData.extraServicesCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'سعر الخدمة الأضافية' : 'Additional service price'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(pricingData.extraServicesCost > 0 ? pricingData.extraServicesCost : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* التأمين الشامل */}
            {pricingData.insurance > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'التأمين الشامل' : 'Comprehensive insurance'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(pricingData.insurance > 0 ? pricingData.insurance : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}

            {/* باقات الكيلومترات الإضافية */}
            {pricingData.extraKmCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  {isArabic ? 'باقات الكيلومترات الإضافية' : 'Extra kilometers packages'}
                </span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {formatPrice(pricingData.extraKmCost > 0 ? pricingData.extraKmCost : 0)}
                  <PriceIcon className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>

        </div>
        {/* رسوم الأستلام والتسليم - Pickup and Delivery Fees */}
        {pricingData.anotherBranchPrice > 0 && (
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
                    {formatPrice(pricingData.anotherBranchPrice > 0 ? pricingData.anotherBranchPrice : 0)}
                    <PriceIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* الخصومات و العروض - Discounts & Offers */}
        {(pricingData.membershipDiscount > 0 ||
          pricingData.totalPoints > 0 ||
          pricingData.totalPromoValue > 0 ||
          pricingData.extraHoursCostWithVat < 0) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isArabic ? 'الخصومات و العروض' : 'Discounts & Offers'}
              </h3>
              <div className="space-y-3">
                {/* خصم عضوية */}
                {pricingData.membershipDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {isArabic ? 'خصم عضوية' : 'Membership discount'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                      <div className=" leading-none mt-0.5">

                        - {formatPrice(pricingData.membershipDiscount > 0 ? pricingData.membershipDiscount : 0)}
                      </div>
                      <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                    </span>
                  </div>
                )}

                {/* خصم أستبدال */}
                {pricingData.totalPoints > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {isArabic
                        ? `خصم النقاط (${pricingData.totalPoints} نقطة)`
                        : `Points discount (${pricingData.totalPoints} points)`}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                      <div className=" leading-none mt-0.5">
                        - {formatPrice(pointsValue > 0 ? pointsValue : 0)}
                      </div>
                      <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                    </span>
                  </div>
                )}

                {/* خصم كوبون */}
                {pricingData.totalPromoValue > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {isArabic ? 'خصم (كوبون)' : 'Discount (coupon)'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                      <div className=" leading-none mt-0.5">
                        - {formatPrice(pricingData.totalPromoValue > 0 ? pricingData.totalPromoValue : 0)}
                      </div>
                      <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                    </span>
                  </div>
                )}

                {/* خصم الساعات الأضافية */}
                {pricingData.extraHoursCostWithVat < 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {isArabic ? 'خصم الساعات الأضافية' : 'Additional hours discount'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#DCFDEB] text-[#064D3B] px-3 py-1 rounded-md text-sm font-normal leading-none">
                      <div className=" leading-none mt-0.5">
                        - {formatPrice(pricingData.extraHoursCostWithVat < 0 ? Math.abs(pricingData.extraHoursCostWithVat) : 0)}
                      </div>
                      <PriceIcon className="w-4 h-4 text-[#064D3B]" />
                    </span>
                  </div>
                )}

              </div>
            </div>
          )}
        <hr className="border-t border-[#ECEEF2]" />

        {/* المبلغ غير شامل الضريبة - Amount excluding tax */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {isArabic ? 'إجمالي المبلغ (غير شامل الضريبة)' : 'Amount excluding tax'}
          </span>
          <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
            {formatPrice(pricingData.finalTotalPrice > 0 && pricingData.tax > 0 ? pricingData.finalTotalPrice - pricingData.tax : 0)}
            <PriceIcon className="w-4 h-4" />
          </span>
        </div>


        {/* الضريبة - Tax */}
        {pricingData.tax > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {isArabic ? 'الضريبة (15%)' : 'Tax (15%)'}
            </span>
            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
              {formatPrice(pricingData.tax > 0 ? pricingData.tax : 0)}
              <PriceIcon className="w-4 h-4" />
            </span>
          </div>
        )}
        <hr className="border-t border-[#ECEEF2]" />

        {/* الأجمالي - Total */}
        <div className="   border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {isArabic ? 'الأجمالي' : 'Total'}
            </span>
            <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(pricingData.finalTotalPrice > 0 ? pricingData.finalTotalPrice : 0)}
              <PriceIcon className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

