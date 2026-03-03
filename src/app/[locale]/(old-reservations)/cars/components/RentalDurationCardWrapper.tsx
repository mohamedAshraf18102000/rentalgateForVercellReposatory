'use client';

import { useState, useEffect } from 'react';
import { RentalDurationCard } from './RentalDurationCard';
import FilterCars from '../../../(mainpages)/(home)/FilterCars';
import { useFilterStore } from '@/lib/api/stores/filter.store';

interface RentalDurationCardWrapperProps {
    locale: string;
}

export function RentalDurationCardWrapper({ 
    locale
}: RentalDurationCardWrapperProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [prevFromDate, setPrevFromDate] = useState<Date | null>(null);
    const [prevToDate, setPrevToDate] = useState<Date | null>(null);
    const [prevDuration, setPrevDuration] = useState<string>('');
    
    // Read from store (data comes from cookies automatically)
    const { fromDate, toDate, duration } = useFilterStore();
    
    // إغلاق وضع التعديل عند تحديث البيانات
    useEffect(() => {
        if (isEditing && fromDate && toDate && prevFromDate && prevToDate) {
            // التحقق من تغيير البيانات (فقط إذا كانت هناك قيم سابقة)
            const datesChanged = 
                prevFromDate.getTime() !== fromDate.getTime() ||
                prevToDate.getTime() !== toDate.getTime() ||
                prevDuration !== duration;
            
            if (datesChanged) {
                // البيانات تم تحديثها، إغلاق وضع التعديل
                setIsEditing(false);
            }
        }
        
        // تحديث القيم السابقة دائماً
        if (fromDate && toDate) {
            setPrevFromDate(fromDate);
            setPrevToDate(toDate);
            setPrevDuration(duration);
        }
    }, [fromDate, toDate, duration, isEditing, prevFromDate, prevToDate, prevDuration]);
    
    // Format dates for display
    const formatDateToString = (date: Date | null): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDatingType = (dur: typeof duration): number => {
        switch (dur) {
            case 'daily':
                return 1;
            case 'weekly':
                return 2;
            case 'monthly':
                return 3;
            case 'yearly':
                return 4;
            default:
                return 1;
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    if (isEditing) {
        return (
            <div className="-mt-[50px] z-10"> 
                <div className="flex justify-center items-center mb-[40px]">
                    <FilterCars locale={locale} />
                </div>
            </div>
        );
    }

    // Don't render if dates are not available
    if (!fromDate || !toDate) {
        return null;
    }

    return (
        <div className="-mt-10 z-10">
            <RentalDurationCard
                locale={locale}
                startDate={formatDateToString(fromDate)}
                endDate={formatDateToString(toDate)}
                datingType={getDatingType(duration)}
                onEdit={handleEdit}
            />
        </div>
    );
}

