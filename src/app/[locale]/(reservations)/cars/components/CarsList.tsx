'use client';

import { useState } from 'react';
import { CarCard } from '../../../../(components)/template/CarCard';
import { Button } from '../../../../(components)/ui/button';
import { type CarCardData } from '@/constants/api';
import Image from 'next/image';

type CarsListProps = {
    cars: CarCardData[];
    locale: string;
    itemsPerPage?: number;
};

export function CarsList({ cars, locale, itemsPerPage = 9 }: CarsListProps) {
    const [displayedCount, setDisplayedCount] = useState(itemsPerPage);

    const displayedCars = cars.slice(0, displayedCount);
    const hasMore = displayedCount < cars.length;
    const startIndex = displayedCars.length > 0 ? 1 : 0;
    const endIndex = displayedCount;
    const totalCars = cars.length;

    const handleLoadMore = () => {
        setDisplayedCount((prev) => Math.min(prev + itemsPerPage, cars.length));
    };

    return (
        <>
            {cars.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-md flex flex-col items-center justify-start gap-4 h-full">
                    <div className="flex flex-col gap-4 mt-8">

                        <Image src="/search_notfound.png" alt="No Reservations" width={250} height={250} />
                        <p className="text-[#393838] text-[16px]">
                            {locale === 'ar' ? 'لا توجد سيارات مطابقة للبحث' : 'No cars found for the search query'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                    {displayedCars.map((car) => (
                        <CarCard
                            key={car.id}
                            id={car.id}
                            image={car.image}
                            images={car.images}
                            category={car.category}
                            categoryAr={car.categoryAr}
                            categoryEn={car.categoryEn}
                            title={car.title}
                            mileage={car.mileage}
                            oldPrice={car.oldPrice}
                            currentPrice={car.currentPrice > 0 ? car.currentPrice : 0}
                            hasDiscount={car.hasDiscount}
                            locale={locale}
                            finalPriceBeforeDiscount={car.finalPriceBeforeDiscount}
                            numOfDays={car.numOfDays}
                            modelArabicName={car.modelArabicName}
                            modelEnglishName={car.modelEnglishName}
                            brandArabicName={car.brandArabicName}
                            brandName={car.brandName}
                            year={car.year}
                        />
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="flex flex-col items-center gap-4 mt-8">
                    <Button
                        onClick={handleLoadMore}
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary-hover text-white"
                    >
                        {locale === 'ar' ? 'تحميل المزيد' : 'Load More'}
                    </Button>
                    <p className="text-sm text-gray-600">
                        {locale === 'ar'
                            ? `السيارات الظاهرة: ${startIndex}-${endIndex} من أصل ${totalCars}`
                            : `Displayed cars: ${startIndex}-${endIndex} out of ${totalCars}`
                        }
                    </p>
                </div>
            )}

            {!hasMore && cars.length > 0 && (
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        {locale === 'ar'
                            ? `السيارات الظاهرة: ${startIndex}-${totalCars} من أصل ${totalCars}`
                            : `Displayed cars: ${startIndex}-${totalCars} out of ${totalCars}`
                        }
                    </p>
                </div>
            )}
        </>
    );
}

