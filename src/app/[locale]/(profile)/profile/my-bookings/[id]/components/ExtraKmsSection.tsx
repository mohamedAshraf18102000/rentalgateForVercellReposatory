'use client';

/**
 * Extra Kms Section Component
 * Displays the selected extra kilometers package with price and favorite badge
 */

import React from 'react';
import { PriceIcon } from '@/constants/icons';
import { formatPrice } from '../utils/formatters';

interface ExtraKmsSectionProps {
    extraKmCost: number;
    extraKmPackage: number;
    locale: string;
}

export default function ExtraKmsSection({
    extraKmCost,
    extraKmPackage,
    locale,
}: ExtraKmsSectionProps) {
    const isArabic = locale === 'ar';

    if (!extraKmCost || !extraKmPackage) {
        return null;
    }

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isArabic ? 'الباقة المحددة:' : 'The selected package:'}
            </h3>
            <div className="bg-[#ECEEF2] rounded-lg p-4 shadow-sm relative">
                <div className="flex items-center justify-between gap-4">

                    {/* Right side - Kilometers */}
                    <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-gray-900">
                            + {extraKmPackage} {isArabic ? 'كم' : 'km'}
                        </span>
                    </div>
                    {/* Left side - Price */}
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(extraKmCost > 0 ? extraKmCost : 0)}
                        </span>
                        <PriceIcon className="w-5 h-5 text-gray-900" />
                    </div>

                </div>
            </div>
        </div>
    );
};