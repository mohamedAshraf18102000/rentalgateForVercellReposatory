'use client';

const CarCardSkeleton = () => {
    return (
        <div className="bg-white rounded-[18px] border border-[#FFFFFF] shadow-gray-200 border-solid overflow-hidden w-full h-full flex flex-col animate-pulse">
            {/* Image Container */}
            <div className="bg-[#F2F2F2] rounded-[18px] overflow-hidden">
                <div className="relative w-full h-[178px] overflow-hidden bg-gray-200">
                    {/* Skeleton image placeholder */}
                </div>
                {/* Category badge skeleton */}
                <div className="bg-gray-300 h-6"></div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Title - 2 lines with min-h-14 */}
                <div className="space-y-2 mb-2 min-h-14">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                {/* Mileage */}
                <div className="h-3 bg-gray-200 rounded w-20"></div>

                {/* Pricing */}
                <div className="flex items-center justify-end gap-2 mt-auto pt-3">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
        </div>
    );
};

export { CarCardSkeleton };

