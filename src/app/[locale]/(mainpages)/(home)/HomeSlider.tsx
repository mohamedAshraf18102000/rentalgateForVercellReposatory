'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/ui';
import { Link } from '@/i18n/routing';
import type { Banner } from '@/constants/api';

interface HomeSliderProps {
    banners?: Banner[];
}

const HomeSlider = ({ banners = [] }: HomeSliderProps) => {
    const t = useTranslations('home');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    
    // Get first banner or use defaults
    const banner = banners?.[0];
    const bannerImage = banner 
        ? (locale === 'ar' ? banner.arabicImage : banner.image)
        : (locale === 'ar' ? '/banner_ar.png' : '/banner_en.png');
    const bannerTitle = banner 
        ? (locale === 'ar' ? banner.arabicTitle : banner.title)
        : t('title');
    const bannerText = banner 
        ? (locale === 'ar' ? banner.arabicText : banner.englishText)
        : t('subtitle');
    
    // Build link if banner has objType and objId
    const bannerLink = banner?.objType === 'CAR' && banner?.objId 
        ? `/cars/${banner.objId}`
        : null;

    return (
        <section className="container-custom"> 
            <div className="relative w-full min-h-[400px] md:min-h-[600px] mt-4 md:mt-[55px]">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={bannerImage}
                        alt={bannerTitle}
                        fill
                        className="object-cover shadow-md border-3 border-solid border-white rounded-[12px] md:rounded-[20px]"
                        priority
                    />
                    <div className=" relative z-10 container mx-auto px-4 md:px-8 h-full flex items-center">
                        <div className={`w-full md:w-1/2 flex flex-col justify-center h-full py-8 md:py-0 ${isRTL ? 'md:ml-auto' : 'md:mr-auto'}`}>
                            {/* Large Text */}
                            <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                                {bannerTitle}
                            </h1>
                            <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90">
                                {bannerText}
                            </p>

                            {/* Book Now Button */}
                            {bannerLink ? (
                                <Link href={bannerLink}>
                                    <Button
                                        size='lg'
                                        className={`w-fit px-6 md:px-7 text-[12px] md:text-[14px] leading-[130%] tracking-normal ${isRTL ? 'text-right' : 'text-left'}`}
                                    >
                                        {t('bookNow')}
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    size='lg'
                                    className={`w-fit px-6 md:px-7 text-[12px] md:text-[14px] leading-[130%] tracking-normal ${isRTL ? 'text-right' : 'text-left'}`}
                                >
                                    {t('bookNow')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
            </div>
        </section>

    );
};

export default HomeSlider;