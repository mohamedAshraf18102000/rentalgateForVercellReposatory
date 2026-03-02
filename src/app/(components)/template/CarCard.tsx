'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OffersIcon, PriceIcon } from '@/icons';
import { Link } from '@/i18n/routing';
import { normalizeImageUrl } from '@/util/image';
import { formatPrice } from '@/lib/utils';

interface CarCardProps {
    id: number;
    image: string;
    images?: string[];
    category: string;
    categoryAr?: string;
    categoryEn?: string;
    title: string;
    mileage: number;
    oldPrice: number;
    currentPrice: number;
    hasDiscount?: boolean;
    locale?: string;
    finalPriceBeforeDiscount?: number; // السعر النهائي قبل الخصم
    finalPrice?: number; // السعر النهائي
    numOfDays?: number; // عدد الأيام
    // الحقول المنفصلة لبناء العنوان بنفس تنسيق ReservationCard
    modelArabicName?: string;
    modelEnglishName?: string;
    brandArabicName?: string;
    brandName?: string;
    year?: number;
}

const CarCard = ({
    id,
    image,
    images = [],
    category,
    categoryAr,
    categoryEn,
    title,
    mileage,
    oldPrice,
    currentPrice,
    hasDiscount = false,
    locale = 'ar',
    finalPriceBeforeDiscount,
    finalPrice,
    numOfDays,
    modelArabicName,
    modelEnglishName,
    brandArabicName,
    brandName,
    year,
}: CarCardProps) => {
    // Normalize all image URLs
    const normalizedImages = images.length > 0
        ? images.map(img => normalizeImageUrl(img))
        : [normalizeImageUrl(image)];
    const allImages = normalizedImages;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // استخدام categoryAr و categoryEn إذا كانت متوفرة، وإلا استخدام category
    const categoryText = locale === 'ar'
        ? (categoryAr || category)
        : (categoryEn || category);

    // حساب نسبة الخصم
    const discountPercentage = hasDiscount && oldPrice > 0
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
        : 0;

    return (
        <Link href={`/cars/${id}`} className="block w-full h-full">
            <div className="bg-white rounded-[18px] border border-[#FFFFFF] hover:border-[#ECEEF2] shadow-gray-200 border-solid overflow-hidden transition-all duration-300 group cursor-pointer w-full h-full flex flex-col">
                {/* Image Container */}
                <div className="bg-[#F2F2F2] bg_cars_card rounded-[18px] overflow-hidden">
                    <div className="relative w-full h-[178px] overflow-hidden group/image">
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Discount Badge */}
                        {hasDiscount && discountPercentage > 0 && (
                            <div className="absolute top-0 left-4 bg-primary min-w-8 h-8 flex items-center gap-1 justify-center rounded-b-[8px] px-2 z-10">
                                <span className="text-xs mt-1 text-white flex items-center justify-center leading-none">{discountPercentage}%</span>
                                <OffersIcon className="w-1 h-1 text-white" />
                            </div>
                        )}


                    </div>
                    <div className="bg-black text-white text-xs font-medium px-3 py-1.5 text-center">
                        {categoryText}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 leading-7 tracking-normal line-clamp-2 min-h-14"> 
                        {locale === 'ar' ? modelArabicName : modelEnglishName} {" - "} {locale === 'ar' ? brandArabicName : brandName} {" - "} {year}
                    </h3>

                    {/* Mileage */}
                    <div className="text-xs text-gray-500">
                        {mileage.toLocaleString()} {locale === 'ar' ? 'كم' : 'km'}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-end gap-2 mt-auto pt-3">
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                {formatPrice(oldPrice)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-[14px] font-bold text-gray-900 flex items-center gap-1">
                                {formatPrice(finalPrice !== undefined
                                    ? finalPrice
                                    : currentPrice > 0 ? currentPrice : 0
                                )}
                                <PriceIcon className="w-4 h-4" />
                            </span>
                            <span className="text-xs text-gray-500">
                                /
                            </span>
                            <span className="text-xs text-gray-500">
                                {finalPrice !== undefined && numOfDays !== undefined
                                    ? (locale === 'ar'
                                        ? `${numOfDays} ${numOfDays === 1 ? 'يوم' : 'أيام'}`
                                        : `${numOfDays} ${numOfDays === 1 ? 'day' : 'days'}`
                                    )
                                    : (locale === 'ar' ? 'يوم' : ' day')
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}


export { CarCard };