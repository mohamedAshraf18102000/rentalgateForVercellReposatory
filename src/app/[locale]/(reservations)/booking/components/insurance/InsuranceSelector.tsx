'use client';

/**
 * Insurance Selector Component
 * Allows users to select comprehensive insurance for their booking
 */

import React from 'react';
import Image from 'next/image';
import { Checkbox } from '@/app/(components)/ui/checkbox';
import type { InsuranceSelectorProps } from './InsuranceSelector.types';

export const InsuranceSelector: React.FC<InsuranceSelectorProps> = ({
  locale,
  insurancePrice,
  isSelected,
  onSelectionChange,
}) => {
  return (
    <div className="mt-6">
      <div
        onClick={() => onSelectionChange(!isSelected)}
        className="bg-white rounded-[18px] p-4 shadow-sm cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-4"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Icon - Shield with car */}
        <div className="shrink-0 w-[43px] h-[43px] flex items-center justify-center">
          <div className={`w-[43px] h-[43px] ${locale === 'ar' ? 'order-1' : 'order-3'}`}>
            <Image
              src={"/shared/insurance.png"}
              alt={"Insurance"}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content - Right side in RTL */}
        <div className="flex flex-col  ">
          <h3 className="text-sm font-bold text-black mb-1">
            {locale === 'ar' ? 'تأمين شامل' : 'Comprehensive Insurance'}
          </h3>
          {insurancePrice > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {insurancePrice.toFixed(2)} {locale === 'ar' ? '﷼' : 'SAR'}
              </span>
              <span className="text-sm text-gray-400 ">
                {locale === 'ar' ? '/ يوم ' : '/Day'}
              </span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>
        {/* Checkbox */}
        <div className="shrink-0">
          <Checkbox
            id="insurance-checkbox"
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(checked === true)}
            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

