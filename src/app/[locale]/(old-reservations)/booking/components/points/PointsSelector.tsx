'use client';

/**
 * Points Selector Component
 * Allows users to use their reward points for the booking
 */

import React, { useState, useEffect } from 'react';
import { PointsIcon, PriceIcon } from '@/constants/icons';

interface PointsSelectorProps {
    totalPoints: number;
    pointsSpentPerSAR: number;
    maxPointsPerUse: number;
    maxPointsUsable: number;
    selectedPoints: number;
    onPointsChange: (points: number) => void;
    locale: string;
}

export const PointsSelector: React.FC<PointsSelectorProps> = ({
    totalPoints,
    pointsSpentPerSAR,
    maxPointsPerUse,
    maxPointsUsable,
    selectedPoints,
    onPointsChange,
    locale,
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    const isArabic = locale === 'ar';

    // Update input when selectedPoints changes externally
    useEffect(() => {
        if (selectedPoints > 0) {
            setInputValue(selectedPoints.toString());
        } else {
            setInputValue('');
        }
    }, [selectedPoints]);

    // Calculate maximum points that can be used - Same as Algazal
    // الحد الأقصى = الأقل بين (حد النظام، نقاط المستخدم، الحد المسموح من السعر)
    const maxUsablePoints = Math.min(totalPoints, maxPointsPerUse, maxPointsUsable);

    // Calculate SAR value - Same as Algazal: discount = points / POINTS_SPENT_PER_SAR
    const totalPointsValueInSAR = totalPoints / pointsSpentPerSAR;

    // Calculate SAR value of input points
    const inputPointsValueInSAR = (parseInt(inputValue) || 0) / pointsSpentPerSAR;

    const handleInputChange = (value: string) => {
        // Allow empty input
        if (value === '') {
            setInputValue('');
            return;
        }

        // Only allow numbers
        if (!/^\d+$/.test(value)) {
            return;
        }

        const numValue = parseInt(value, 10);

        // Limit to max usable points
        if (numValue > maxUsablePoints) {
            setInputValue(maxUsablePoints.toString());
            return;
        }

        setInputValue(value);
    };

    const handleRedeem = () => {
        const points = parseInt(inputValue) || 0;
        if (points > 0 && points <= maxUsablePoints) {
            onPointsChange(points);
        }
    };

    if (totalPoints <= 0) {
        return null;
    }

    return (
        <div className="mt-4 bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100">
            {/* Green Header Section */}
            <div
                className=" relative overflow-hidden"
                style={{
                    background: 'linear-gradient(0deg, #09703E, #09703E), linear-gradient(177.66deg, #187749 11.76%, #2DDD88 39.13%)'
                }}
            >
                {/* Decorative corner */}
                <div className='px-5 py-3'>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>

                    <div className="relative flex items-center  gap-5 justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
                        <div className="text-white flex flex-row justify-center items-center">
                            <div className="text-sm font-medium mb-1 opacity-90">
                             
                            </div>
                            <div className="text-[16px] font-bold flex items-baseline gap-2">
                                <span>    {isArabic ? 'لديك' : 'You have'} {" "}{totalPoints}</span>
                                <span className="text-base font-normal opacity-90">
                                    {isArabic ? 'نقطة' : 'points'}
                                </span>
                            </div>
                        </div>

                        <div className="text-white text-center">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.728 0.0767996C9.89867 -0.0512 9.984 -0.0191998 9.984 0.1728V1.4848C9.984 1.69813 9.97333 1.8688 9.952 1.9968C9.93067 2.1248 9.84533 2.2528 9.696 2.3808C9.35467 2.67947 9.00267 2.90347 8.64 3.0528C8.27733 3.1808 7.82933 3.2448 7.296 3.2448C6.69867 3.2448 6.144 3.15947 5.632 2.9888C5.14133 2.81813 4.66133 2.64747 4.192 2.4768C3.744 2.30613 3.264 2.2208 2.752 2.2208C2.24 2.2208 1.80267 2.2848 1.44 2.4128C1.09867 2.5408 0.714667 2.80747 0.288 3.2128C0.245333 3.25547 0.181333 3.2768 0.0960001 3.2768C0.032 3.2768 0 3.23413 0 3.1488V1.7728C0 1.3888 0.096 1.11147 0.288 0.9408C1.03467 0.343467 1.856 0.0448 2.752 0.0448C3.328 0.0448 3.86133 0.130133 4.352 0.3008C4.84267 0.471467 5.32267 0.6528 5.792 0.8448C6.28267 1.01547 6.784 1.1008 7.296 1.1008C7.78667 1.1008 8.20267 1.0368 8.544 0.9088C8.90667 0.759467 9.30133 0.482133 9.728 0.0767996Z" fill="white" />
                                <rect y="5.27637" width="9.984" height="2" fill="white" />
                            </svg>
                        </div>

                        <div className="text-white text-left" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="text-2xl font-bold flex items-baseline gap-1.5">
                                <span>{totalPointsValueInSAR.toFixed(0)}</span>
                                <span className="text-base font-normal opacity-90">
                                    <PriceIcon/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* White Content Section */}
                <div className="px-5 py-5 bg-white  rounded-[20px]">
                    {/* Title with icon */}
                    <div className="flex items-center gap-2 mb-4" dir={isArabic ? 'rtl' : 'ltr'}>
                        <PointsIcon width={24} height={24} className="text-gray-700" />
                        <h3 className="text-base font-semibold text-gray-900">
                            {isArabic ? 'استبدال نقاطك:' : 'Redeem your points:'}
                        </h3>
                    </div>

                    {/* Input Field */}
                    <div className="mb-3">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder={isArabic ? 'أدخل النقاط التي تريد استبدالها' : 'Enter the points you want to redeem'}
                            className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            dir={isArabic ? 'rtl' : 'ltr'}
                        />
                        {inputValue && parseInt(inputValue) > 0 && (
                            <div className="mt-2 text-xs text-gray-500" dir={isArabic ? 'rtl' : 'ltr'}>
                                {isArabic
                                    ? `≈ ${inputPointsValueInSAR.toFixed(2)} ريال`
                                    : `≈ ${inputPointsValueInSAR.toFixed(2)} SAR`}
                            </div>
                        )}
                    </div>

                    {/* Redeem Button */}
                    <button
                        type="button"
                        onClick={handleRedeem}
                        disabled={!inputValue || parseInt(inputValue) === 0 || parseInt(inputValue) > maxUsablePoints}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-xl flex items-center justify-between px-4 transition-colors group"
                        dir={isArabic ? 'rtl' : 'ltr'}
                    >
                        <span className="text-sm font-semibold text-gray-900">
                            {isArabic ? 'استبدل الآن' : 'Redeem Now'}
                        </span>
                        <svg
                            className={`w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Info text */}
                    <div className="mt-3 text-xs text-gray-500 text-center">
                        {isArabic
                            ? `الحد الأقصى: ${maxUsablePoints.toLocaleString()} نقطة • كل ${pointsSpentPerSAR} نقطة = 1 ريال`
                            : `Max: ${maxUsablePoints.toLocaleString()} points • Every ${pointsSpentPerSAR} points = 1 SAR`}
                    </div>

                    {/* Active points display */}
                    {selectedPoints > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-green-900">
                                        {isArabic
                                            ? `تم استخدام ${selectedPoints.toLocaleString()} نقطة`
                                            : `${selectedPoints.toLocaleString()} points applied`}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInputValue('');
                                        onPointsChange(0);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                                >
                                    {isArabic ? 'إلغاء' : 'Remove'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

