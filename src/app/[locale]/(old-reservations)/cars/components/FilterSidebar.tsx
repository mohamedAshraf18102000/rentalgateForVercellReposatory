'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Loader2, X, RefreshCw } from 'lucide-react';
import { Checkbox, RadioGroup, RadioGroupItem, RadioGroupWithOptions, Button, Label } from '@/ui';
import type { CarType } from '@/lib/api/types';
import type { Branch, City } from '@/lib/api/types/shared.types';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/constants/icons';
import { FilterSectionTrigger } from '@/app/(components)/ui/filter-section-trigger';

type FilterSidebarProps = {
    locale: string;
    carTypes: CarType[];
    selectedTypes?: number[];
    priceSort?: string;
    searchQuery?: string;
    isSearching?: boolean;
    onTypesChange?: (types: number[]) => void;
    onPriceSortChange?: (sort: string) => void;
    onSearchChange?: (query: string) => void;
    onSearchClick?: () => void;
    onSearchKeyDown?: (e: React.KeyboardEvent) => void;
    hideWrapper?: boolean;
    branchId?: number;
    selectedBranch?: Branch | null;
    branches?: Branch[];
    cities?: City[];
    onSelectBranch?: (branchId: number) => void;
    onRemoveBranchFilter?: () => void;
    onResetFilters?: () => void;
};

export function FilterSidebar({
    locale,
    carTypes,
    selectedTypes: externalSelectedTypes,
    priceSort: externalPriceSort,
    searchQuery: externalSearchQuery,
    isSearching = false,
    onTypesChange,
    onPriceSortChange,
    onSearchChange,
    onSearchClick,
    onSearchKeyDown,
    hideWrapper = false,
    branchId,
    selectedBranch,
    branches = [],
    cities = [],
    onSelectBranch,
    onRemoveBranchFilter,
    onResetFilters,
}: FilterSidebarProps) {
    const [internalSearchQuery, setInternalSearchQuery] = useState('');
    const [internalSelectedTypes, setInternalSelectedTypes] = useState<number[]>([]);
    const [internalPriceSort, setInternalPriceSort] = useState<string>('');
    const [showMoreCarTypes, setShowMoreCarTypes] = useState(false);
    const [showMorePrice, setShowMorePrice] = useState(false);
    const [showMoreBranches, setShowMoreBranches] = useState(false);

    // استخدام external state إذا كان متوفراً، وإلا استخدم internal state
    const selectedTypes = externalSelectedTypes ?? internalSelectedTypes;
    const priceSort = externalPriceSort ?? internalPriceSort;
    const searchQuery = externalSearchQuery ?? internalSearchQuery;

    const handleSearchChange = (value: string) => {
        if (onSearchChange) {
            onSearchChange(value);
        } else {
            setInternalSearchQuery(value);
        }
    };

    const isRTL = locale === 'ar';

    const activeFiltersCount = selectedTypes.length + (priceSort ? 1 : 0) + (branchId ? 1 : 0);

    const handleTypeToggle = (typeId: number) => {
        const newTypes = selectedTypes.includes(typeId)
            ? selectedTypes.filter((id) => id !== typeId)
            : [...selectedTypes, typeId];

        if (onTypesChange) {
            onTypesChange(newTypes);
        } else {
            setInternalSelectedTypes(newTypes);
        }
    };

    const handlePriceSortChange = (value: string) => {
        if (onPriceSortChange) {
            onPriceSortChange(value);
        } else {
            setInternalPriceSort(value);
        }
    };

    const handleResetFilters = () => {
        if (onResetFilters) {
            onResetFilters();
        } else {
            onTypesChange?.([]);
            onPriceSortChange?.('');
            onSearchChange?.('');
            onRemoveBranchFilter?.();
            setInternalSelectedTypes([]);
            setInternalPriceSort('');
            setInternalSearchQuery('');
        }
    };

    const priceOptions = [
        {
            value: 'high-to-low',
            label: locale === 'ar' ? 'من الأعلى سعراً إلى الأقل' : 'From highest price to lowest',
        },
        {
            value: 'low-to-high',
            label: locale === 'ar' ? 'من الأقل سعراً إلى الأعلى' : 'From lowest price to highest',
        },
    ];

    const content = (
        <div className="bg-white rounded-[12px] md:rounded-[20px] shadow-md p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <section className="flex items-center justify-between">

                <div className="flex items-center justify-start gap-2">
                    <div className="relative">
                        <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#B12F30] hover:bg-primary select-none transition-all duration-300 text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center ">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {locale === 'ar' ? 'تصفية حسب:' : 'Filter by:'}
                    </h3>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-gray-900 rounded-[10px]"
                    onClick={handleResetFilters}
                >
                    <div className="flex items-center gap-1">
                        <RefreshCw strokeWidth={1.5} className="w-4 h-4" />
                        {locale === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
                    </div>
                </Button>

            </section>

            {/* Search Bar */}
            <div className={cn(
                "relative flex items-center rounded-[10px] overflow-hidden bg-white shadow-sm",
                isRTL ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Search Button - Orange on left */}
                <button
                    onClick={onSearchClick}
                    disabled={isSearching}
                    className={cn(
                        "flex items-center justify-center w-12 h-10 md:w-14 md:h-11 bg-primary hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed transition-colors z-10",
                        isRTL ? "rounded-l-lg" : "rounded-l-lg"
                    )}
                    type="button"
                >
                    {isSearching ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Search className="w-5 h-5 text-white" />
                    )}
                </button>

                {/* Input Field - White on right */}
                <input
                    type="text"
                    placeholder={locale === 'ar' ? 'أبحث...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={onSearchKeyDown}
                    className={cn(
                        "flex-1 h-10 md:h-11 px-4 text-sm md:text-base outline-none",
                        "placeholder:text-gray-400 text-gray-900",
                        "bg-white",
                        isRTL ? "text-right rounded-r-lg" : "text-left rounded-r-lg"
                    )}
                />
            </div>

            {/* Branch Filter Banner */}
            {selectedBranch && (
                <div className=" bg-[#C0FFDD] hover:bg-[#A7F3D0] transition-all duration-300 text-[#024E3B] w-fit px-[8px] py-1 rounded-[6px]   flex items-center gap-2  justify-between  ">
                    <p className="text-xs md:text-sm font-semibold text-[#024E3B] hover:text-[#064E3B] select-none transition-all duration-300">
                        {locale === 'ar'
                            ? `فرع ${selectedBranch.branchArName}`
                            : `Branch ${selectedBranch.branchName}`}
                    </p>

                    <div className="cursor-pointer" onClick={onRemoveBranchFilter}>
                        <svg width="13" height="13" className="w-3 h-3 mb-[1px]" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 9L6.5 6.5M6.5 6.5L9 4M6.5 6.5L3.75 4M6.5 6.5L9 9M12.5 6.5C12.5 9.81371 9.81371 12.5 6.5 12.5C3.18629 12.5 0.5 9.81371 0.5 6.5C0.5 3.18629 3.18629 0.5 6.5 0.5C9.81371 0.5 12.5 3.18629 12.5 6.5Z" stroke="#024E3B" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Car Type Filter */}
            <div>
                <FilterSectionTrigger
                    title={locale === 'ar' ? 'نوع السيارة' : 'Car Type'}
                    isOpen={showMoreCarTypes}
                    onToggle={() => setShowMoreCarTypes(!showMoreCarTypes)}
                    spacing="mt-4 sm:mt-6"
                    isRTL={isRTL}
                />
                <div
                    className={cn(
                        'grid transition-all duration-500 ease-in-out mt-4 sm:mt-6',
                        !showMoreCarTypes ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                >
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {carTypes.map((carType) => (
                                <div
                                    key={carType.typeId}
                                    className="relative flex flex-col items-center gap-2 p-2 md:p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                                    onClick={() => handleTypeToggle(carType.typeId)}
                                >
                                    <div className="relative w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {carType.icon ? (
                                            <Image
                                                src={carType.icon}
                                                alt={locale === 'ar' ? carType.arabicName : carType.englishName}
                                                fill
                                                className="object-contain px-2"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                        )}

                                        <div className="absolute top-[10px] right-[10px]">
                                            <Checkbox
                                                checked={selectedTypes.includes(carType.typeId)}
                                                onCheckedChange={() => handleTypeToggle(carType.typeId)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full">
                                        <span className="text-xs md:text-sm text-gray-700 flex-1 text-center">
                                            {locale === 'ar' ? carType.arabicName : carType.englishName}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Sort */}
            <div className="mt-5">
                <FilterSectionTrigger
                    title={locale === 'ar' ? 'السعر' : 'Price'}
                    isOpen={showMorePrice}
                    onToggle={() => setShowMorePrice(!showMorePrice)}
                    spacing="mt-4 sm:mt-6"
                    isRTL={isRTL}
                />
                <div
                    className={cn(
                        'grid transition-all duration-500 ease-in-out',
                        !showMorePrice ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                >
                    <div className="overflow-hidden mt-4 sm:mt-6">
                        <div className="space-y-3">
                            <RadioGroupWithOptions
                                value={priceSort}
                                onValueChange={handlePriceSortChange}
                                options={priceOptions}
                                className="space-y-3"
                                itemClassName="gap-3 !flex-row justify-between border border-[#ECEEF2] rounded-[16px] py-[17px] px-[12px] hover:bg-gray-100 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Filter - قائمة الفروع (اسم الفرع - المدينة) مع Radio */}
            {branches.length > 0 && (
                <div>
                    <FilterSectionTrigger
                        title={locale === 'ar' ? 'الفروع' : 'Branches'}
                        isOpen={showMoreBranches}
                        onToggle={() => setShowMoreBranches(!showMoreBranches)}
                        spacing="mt-4 sm:mt-6"
                        isRTL={isRTL}
                    />
                    <div
                        className={cn(
                            'grid transition-all duration-500 ease-in-out mt-4 sm:mt-6',
                            showMoreBranches ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                    >
                        <div className="overflow-hidden">
                            <RadioGroup
                                value={branchId?.toString() ?? ''}
                                onValueChange={(value) => onSelectBranch?.(parseInt(value, 10))}
                                className="space-y-2"
                            >
                                {branches.map((branch) => {
                                    const branchName = locale === 'ar' ? branch.branchArName : branch.branchName;
                                    const city = cities.find((c) => c.cityId === branch.cityId);
                                    const cityName = city
                                        ? locale === 'ar'
                                            ? city.cityArName
                                            : city.cityEnName
                                        : '';
                                    const label = cityName
                                        ? locale === 'ar'
                                            ? `${branchName} - ${cityName}`
                                            : `${branchName} - ${cityName}`
                                        : branchName;
                                    return (
                                        <div
                                            key={branch.branchId}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => onSelectBranch?.(branch.branchId)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    onSelectBranch?.(branch.branchId);
                                                }
                                            }}
                                            className={cn(
                                                'flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 cursor-pointer transition-colors hover:border-gray-300',
                                                branchId === branch.branchId && 'border-primary ',
                                                isRTL && 'flex-row-reverse'
                                            )}
                                        >
                                            <Label
                                                htmlFor={`branch-${branch.branchId}`}
                                                className={cn(
                                                    'flex- 1 cursor-pointer text-sm font-medium text-gray-900',
                                                    isRTL ? 'text-right' : 'text-left'
                                                )}
                                            >
                                                {label}
                                            </Label>
                                            <RadioGroupItem
                                                value={branch.branchId.toString()}
                                                id={`branch-${branch.branchId}`}
                                                className="shrink-0"
                                            />
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

    if (hideWrapper) {
        return content;
    }

    return (
        <div className="md:sticky md:top-4 h-fit">
            {content}
        </div>
    );
}

