'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { type CarApiResponse } from '@/constants/api';
import { useValidationStore } from '@/lib/api/stores';
import { useCarDataStore } from '@/lib/api/stores';
import { getCookie } from '@/util/cookies';
import { normalizeImageUrl } from '@/util/image';
import { CarDetailsBooking } from './CarDetailsBooking';

type CarDetailsContentProps = {
    car: CarApiResponse;
    locale: string;
    searchParams: { [key: string]: string | string[] | undefined };
};

export function CarDetailsContent({ car, locale, searchParams }: CarDetailsContentProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Validation store
    const {
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime,
        pickupLocation,
        setPickupDate,
        setDropoffDate,
        setPickupTime,
        setDropoffTime,
        setPickupLocation,
    } = useValidationStore();

    // Car data store
    const { setCar, setCategoryText, setLocale } = useCarDataStore();

    // Initialize stores on mount and when data changes
    useEffect(() => {
        // Initialize validation store from searchParams (only if not already set)
        if (searchParams.startDate) {
            const startDate = new Date(searchParams.startDate as string);
            if (!pickupDate || pickupDate.getTime() !== startDate.getTime()) {
                setPickupDate(startDate);
            }
        }
        if (searchParams.endDate) {
            const endDate = new Date(searchParams.endDate as string);
            if (!dropoffDate || dropoffDate.getTime() !== endDate.getTime()) {
                setDropoffDate(endDate);
            }
        }

        // Initialize car data store
        setCar(car);
        setLocale(locale);

        // استخدام القيم مباشرة من API إذا كانت موجودة، وإلا استخدام "نوع غير معروف"
        const typeArabic = car.typeArabicName?.trim() || '';
        const typeEnglish = car.typeEnglishName?.trim() || '';

        const categoryText = locale === 'ar'
            ? (typeArabic || 'نوع غير معروف')
            : (typeEnglish || 'Unknown type');
        setCategoryText(categoryText);
    }, [car, locale, searchParams.startDate, searchParams.endDate, pickupDate, dropoffDate, setPickupDate, setDropoffDate, setCar, setLocale, setCategoryText]);

    // Get all images and normalize their URLs
    const allImages: string[] = [];
    // إضافة الصورة الرئيسية أولاً
    if (car.image) {
        const normalizedImage = normalizeImageUrl(car.image);
        allImages.push(normalizedImage);
    }
    if (car.defaultImage && !allImages.includes(normalizeImageUrl(car.defaultImage))) {
        allImages.push(normalizeImageUrl(car.defaultImage));
    }
    // إضافة باقي الصور
    if (car.images && car.images.length > 0) {
        car.images.forEach((img) => {
            const normalizedImage = normalizeImageUrl(img);
            if (img && !allImages.includes(normalizedImage)) {
                allImages.push(normalizedImage);
            }
        });
    }
    const displayImage = allImages[selectedImageIndex] || allImages[0] || '/shared/CarNotFound.png';

    // سحب وطباعة البيانات من Cookie
    useEffect(() => {
        const cookieData = getCookie('booking-validation-storage');
        console.log('cookieData', JSON.parse(cookieData || '{}'));
    }, [pickupDate, dropoffDate, pickupTime, dropoffTime, pickupLocation]);

    return (
        <div className='custom-bg '>

            <div className="container-custom  py-4 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    {/* Car Image - Mobile first, then Desktop right */}
                    <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
                        <div className="relative w-full h-full">
                            <div className="relative  l bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full  h-[300px] md:w-full md:h-[400px] border-3 border-white"  >
                                <Image
                                    src={displayImage}
                                    alt={car.carName}
                                    fill
                                    className="object-contain w-full h-full"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Section - Mobile first, then Desktop left */}
                    <CarDetailsBooking searchParams={searchParams} />
                </div>
            </div>
        </div>
    );
}

