/**
 * Extend Booking Header Component
 * Header for extension booking page with pricing and action button
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/app/(components)/ui/button';
import { PriceIcon } from '@/icons';

interface ExtendBookingHeaderProps {
    days: number;
    currentPrice: number;
    originalPrice: number;
    formatPrice: (price: number) => string;
    onExtendNow: () => void;
    isLoading: boolean;
    isFormValid: boolean;
}

export const ExtendBookingHeader: React.FC<ExtendBookingHeaderProps> = ({
    days,
    currentPrice,
    originalPrice,
    formatPrice,
    onExtendNow,
    isLoading,
    isFormValid,
}) => {
    const t = useTranslations('carDetails');
    const hasDiscount = currentPrice > 0 && originalPrice > 0 && currentPrice < originalPrice;

    return (
        <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-white py-3 px-4 sm:py-[15px] sm:px-[18px] border-b-2 border-[#ECEEF2]">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
                <p className="flex gap-2 items-center flex-wrap">
                    <span className="text-[#1A1A1A] font-normal text-[12px] sm:text-[14px]">
                        {t('rentalDuration')}:
                    </span>
                    <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
                        {days} {t('days')}
                    </span>
                </p>
                <div className="flex items-baseline gap-2">
                    {hasDiscount && (
                        <span className="text-xs sm:text-sm text-[#949494] font-normal line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1">
                        {formatPrice(currentPrice > 0 ? currentPrice : 0)}
                        <PriceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                </div>
            </div>
            {isLoading ? (
                <div className="h-10 w-24 max-md:w-20 bg-gray-200 rounded-lg animate-pulse" />
            ) : (
                <Button
                    onClick={onExtendNow}
                    disabled={isLoading || (!isFormValid && currentPrice > 0)}
                    className="bg-primary hover:bg-primary-hover text-white px-8 rounded-lg max-md:px-4"
                    size="lg"
                >
                    {t('extendNow')}
                </Button>
            )}
        </div>
    );
};

