'use client';

import { RentalDurationCardWrapper } from './RentalDurationCardWrapper';
import FilterCars from '../../../(mainpages)/(home)/FilterCars';
import { useFilterStore } from '@/lib/api/stores/filter.store';

interface CarsPageClientProps {
    locale: string;
}

export function CarsPageClient({
    locale,
}: CarsPageClientProps) {
    // Read from store to determine what to show
    const { fromDate, toDate } = useFilterStore();
    
    // Show RentalDurationCardWrapper if we have valid dates, otherwise show FilterCars
    const hasValidDates = fromDate && toDate && 
        fromDate instanceof Date && 
        toDate instanceof Date &&
        !isNaN(fromDate.getTime()) &&
        !isNaN(toDate.getTime());

    return (
        <>
            {hasValidDates ? (
                <RentalDurationCardWrapper locale={locale} />
            ) : (
                <div className="-mt-[50px] z-10">
                    <div className="flex justify-center items-center mb-[40px]">
                        <FilterCars locale={locale} />
                    </div>
                </div>
            )}
        </>
    );
}

