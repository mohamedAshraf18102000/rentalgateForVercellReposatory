'use client';

/**
 * Extra Kilometers Component
 * Allows users to select additional kilometer packages for their booking
 */

import React, { useEffect, useState } from 'react';
import { Label } from '@/app/(components)/ui/label';
import { URL } from '@/constants/api';
import type { ExtraKilometersProps, ExtraKm, ExtraKmsApiResponse } from './ExtraKilometers.types';

const ExtraKilometers: React.FC<ExtraKilometersProps> = ({
    locale,
    carId,
    selectedKmId = null,
    onKmChange,
    onKmsLoaded,
}) => {
    const [extraKms, setExtraKms] = useState<ExtraKm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [internalSelectedKmId, setInternalSelectedKmId] = useState<number | null>(selectedKmId || null);

    // Use external state if onKmChange is provided
    const currentSelectedKmId = onKmChange ? selectedKmId : internalSelectedKmId;
    const handleChange = onKmChange || ((kmId: number | null) => {
        setInternalSelectedKmId(kmId);
    });

    // Fetch extra kilometers
    useEffect(() => {
        const fetchExtraKms = async () => {
            if (!carId) {
                onKmsLoaded?.(true); // Mark as loaded if no carId
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(URL(`/car-extra-kms/car/${carId}`));

                const json: any = await response.json();

                console.log('Extra KMs:', json);
                if (json.message === 'SUCCESS' && json.data) {
                    // Handle new API format: data is directly an array
                    if (Array.isArray(json.data)) {
                        setExtraKms(json.data);
                    } 
                    // Handle old API format: data.content is an array (backward compatibility)
                    else if (json.data.content && Array.isArray(json.data.content)) {
                        setExtraKms(json.data.content);
                    }
                }
                onKmsLoaded?.(true);
            } catch (error) {
                console.error('Error fetching extra kilometers:', error);
                onKmsLoaded?.(true); // Still mark as loaded even on error or if no carId
            } finally {
                setIsLoading(false);
            }
        };

        fetchExtraKms();
    }, [carId]);

    const formatPrice = (price: number) => {
        return price.toFixed(2);
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
                {locale === 'ar' ? 'باقات الكيلومترات:' : 'Kilometer packages:'}
            </h3>
            {isLoading ? (
                <div className="text-center py-4 text-gray-500">
                    {locale === 'ar' ? 'جاري تحميل الباقات...' : 'Loading packages...'}
                </div>
            ) : extraKms.length > 0 ? (
                <div className="bg-[#ECEEF2] px-4 rounded-lg overflow-hidden">
                    {extraKms.map((km, index) => {
                        const isLast = index === extraKms.length - 1;
                        const isSelected = currentSelectedKmId === km.kmId;
                        const priceText = `${formatPrice(km.price)} ${locale === 'ar' ? '﷼' : 'SAR'}`;
                        const kmText = `+ ${km.km} ${locale === 'ar' ? 'كم' : 'km'}`;

                        return (
                            <div
                                key={km.kmId}
                                onClick={() => {
                                    // إذا كان محدد بالفعل، قم بإلغاء التحديد
                                    if (isSelected) {
                                        handleChange(null);
                                    } else {
                                        handleChange(km.kmId);
                                    }
                                }}
                                className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-100 transition-colors ${!isLast ? 'border-b border-[#D7DDE8]' : ''}`}
                            >


                                <div className="flex items-center gap-2">
                                    {/* Radio button مخصص على اليمين (في RTL) */}
                                    <div
                                        className="shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // إذا كان محدد بالفعل، قم بإلغاء التحديد
                                            if (isSelected) {
                                                handleChange(null);
                                            } else {
                                                handleChange(km.kmId);
                                            }
                                        }}
                                    >
                                        <div
                                            role="radio"
                                            aria-checked={isSelected}
                                            className={`
                      w-4 h-4 rounded-full border-2 transition-all
                      ${isSelected
                                                    ? 'border-red-600 bg-red-600'
                                                    : 'border-gray-400 bg-white'
                                                }
                      flex items-center justify-center
                    `}
                                        >
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>
                                    {/* النص في المنتصف */}
                                    <div className="flex-1 ">
                                        <Label
                                            htmlFor={`km-${km.kmId}`}
                                            className="cursor-pointer text-sm md:text-base text-gray-900 block"
                                        >
                                            {kmText}
                                        </Label>
                                    </div>

                                </div>
                                {/* السعر على اليسار (في RTL) */}
                                <div className="text-sm md:text-base font-medium text-gray-900">
                                    {priceText}
                                </div>

                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    {locale === 'ar' ? 'لا توجد باقات متاحة' : 'No packages available'}
                </div>
            )}
        </div>
    );
};

export default ExtraKilometers;

