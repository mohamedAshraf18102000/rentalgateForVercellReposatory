'use client';

import { Button } from "@/app/(components)";
import { EditIcon } from "@/constants/icons";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";

interface RentalDurationCardProps {
    locale: string;
    startDate: string;
    endDate: string;
    datingType: number;
    onEdit?: () => void;
}

const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const formatDate = (dateString: string, locale: string): string => {
    const date = new Date(dateString);
    const dayName = arabicDays[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayName} ${day}-${month}-${year}`;
};

const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};

export function RentalDurationCard({ locale, startDate, endDate, datingType, onEdit }: RentalDurationCardProps) {
    const days = calculateDays(startDate, endDate);

    return (
        <div className="flex justify-center items-center mb-[20px] px-4 md:px-0">
            <div className="bg-white rounded-[20px] shadow-[0px_2px_8px_0px_#5858581A] p-3 md:p-4 mb-6 w-full max-w-[450px] z-10">
                <div className="flex items-start md:items-center justify-between flex-wrap gap-3 md:gap-4">
                    <div className="flex flex-col justify-start gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="bg-[#ECEEF2] rounded-lg px-2 md:px-3 py-1 md:py-1.5 flex gap-2 w-fit">
                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                {locale === 'ar' ? 'مدة الإيجار:' : 'Rental duration:'}
                            </span>
                            <span className="text-xs md:text-sm font-bold text-gray-900 md:ml-2">
                                {days - 1} {locale === 'ar' ? 'يوم' : 'days'}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-5 items-start md:items-center">
                            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                <span className="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                    {locale === 'ar' ? 'من:' : 'From:'}
                                </span>
                                <span className="text-xs md:text-sm font-medium text-[#595959] underline">
                                    {formatDate(startDate, locale)}
                                </span>
                            </div>
                            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-700 mt-0.5 hidden md:block rotate-90 md:rotate-0" />
                            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                <span className="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                    {locale === 'ar' ? 'إلى:' : 'To:'}
                                </span>
                                <span className="text-xs md:text-sm font-medium text-[#595959] underline">
                                    {formatDate(endDate, locale)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center shrink-0">
                        <div onClick={onEdit} className="cursor-pointer px-2 [&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-[24px] md:[&_svg]:h-[24px]">
                            <EditIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
