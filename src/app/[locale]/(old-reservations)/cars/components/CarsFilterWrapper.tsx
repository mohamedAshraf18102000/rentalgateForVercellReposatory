'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CarsList } from './CarsList';
import { FilterSidebar } from './FilterSidebar';
import { fetchFilteredCars, type CarCardData, type FilterCarsParams } from '@/constants/api';
import type { CarType } from '@/lib/api/types';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/app/(components)/ui/drawer';
import { Button } from '@/ui';
import { Filter } from 'lucide-react';
import { useFilterStore } from '@/lib/api/stores/filter.store';
import { useSharedStore } from '@/lib/api/stores/shared.store';
import { CarCardSkeleton } from '@/app/(components)/template/CarCardSkeleton';
import { useRouter } from 'next/navigation';

type CarsFilterWrapperProps = {
    initialCars: CarCardData[];
    carTypes: CarType[];
    locale: string;
    initialBranchId?: number;
};

export function CarsFilterWrapper({ initialCars, carTypes, locale, initialBranchId }: CarsFilterWrapperProps) {
    const router = useRouter();
    const [cars, setCars] = useState<CarCardData[]>(initialCars);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [priceSort, setPriceSort] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [branchId, setBranchId] = useState<number | undefined>(initialBranchId);
    const loadingStartTime = useRef<number | null>(null);

    // Read filter data from store (cookies)
    const { duration, fromDate, toDate } = useFilterStore();
    const { sharedData, fetchSharedData } = useSharedStore();

    const activeFiltersCount = selectedTypes.length + (priceSort ? 1 : 0) + (branchId ? 1 : 0);

    // Update branchId when initialBranchId changes
    useEffect(() => {
        if (initialBranchId !== undefined) {
            setBranchId(initialBranchId);
        }
    }, [initialBranchId]);

    // Fetch shared data on mount (for branch list and names)
    useEffect(() => {
        if (!sharedData?.branch) {
            fetchSharedData();
        }
    }, [sharedData?.branch, fetchSharedData]);

    // Function to remove branch filter
    const handleRemoveBranchFilter = () => {
        setBranchId(undefined);
        router.push(`/${locale}/cars`);
    };

    // Reset all filters
    const handleResetAllFilters = () => {
        setSelectedTypes([]);
        setPriceSort('');
        setSearchQuery('');
        setActiveSearchQuery('');
        setBranchId(undefined);
        router.push(`/${locale}/cars`);
    };

    // Get branch name if branchId is set
    const selectedBranch = branchId && sharedData?.branch
        ? sharedData.branch.find((b) => b.branchId === branchId)
        : null;

    const branches = sharedData?.branch ?? [];
    const cities = sharedData?.city ?? [];

    const handleSelectBranch = (id: number) => {
        setBranchId(id);
        router.push(`/${locale}/cars?branchId=${id}`);
    };

    // Handle search button click
    const handleSearchClick = () => {
        setActiveSearchQuery(searchQuery.trim());
        setIsSearching(true);
    };

    // Handle Enter key in search input
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    // When search query is cleared, automatically reset active search to show all cars
    useEffect(() => {
        if (searchQuery.trim() === '' && activeSearchQuery !== '') {
            setActiveSearchQuery('');
            setIsSearching(true);
        }
    }, [searchQuery, activeSearchQuery]);

    // Helper to format date to YYYY-MM-DD
    const formatDateToString = (date: Date | null): string => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper to get datingType from duration
    const getDatingType = (dur: typeof duration): number => {
        switch (dur) {
            case 'daily': return 1;
            case 'weekly': return 2;
            case 'monthly': return 3;
            case 'yearly': return 4;
            default: return 1;
        }
    };

    // تطبيق الفلترات عند تغييرها أو عند وجود بيانات من store
    useEffect(() => {
        const applyFilters = async () => {
            setIsLoading(true);
            loadingStartTime.current = Date.now();
            
            try {
                const params: FilterCarsParams = {
                    page: 0,
                    size: 100,
                    showHome: 0,
                    locale: locale,
                };

                // إضافة typeIds إذا كانت موجودة
                if (selectedTypes.length > 0) {
                    params.typeIds = selectedTypes;
                }

                // إضافة sort - التنسيق الجديد: daily_price,desc أو daily_price,asc
                if (priceSort === 'high-to-low') {
                    params.sort = 'daily_price,desc';
                } else if (priceSort === 'low-to-high') {
                    params.sort = 'daily_price,asc';
                }

                // إضافة بيانات من Store (من Cookies)
                if (fromDate && toDate) {
                    params.datingType = getDatingType(duration);
                    params.startDate = formatDateToString(fromDate);
                    params.endDate = formatDateToString(toDate);
                }

                // إضافة carName للبحث
                if (activeSearchQuery && activeSearchQuery.trim() !== '') {
                    params.carName = activeSearchQuery.trim();
                }

                // إضافة branchId للفلترة حسب الفرع
                if (branchId !== undefined) {
                    params.branchId = branchId;
                }

                // التحقق من وجود فلترات
                const hasFilters = selectedTypes.length > 0 || 
                    priceSort !== '' || 
                    (fromDate && toDate) ||
                    (activeSearchQuery && activeSearchQuery.trim() !== '') ||
                    branchId !== undefined;
                
                if (hasFilters) {
                    const filteredCars = await fetchFilteredCars(params);
                    setCars(filteredCars);
                } else {
                    // إذا لم يكن هناك فلترات، استخدم البيانات الأولية
                    setCars(initialCars);
                }
            } catch (error) {
                console.error('Error fetching filtered cars:', error);
                setCars([]);
            } finally {
                // التأكد من أن الـ loading يستمر لمدة ثانية واحدة على الأقل
                const elapsedTime = Date.now() - (loadingStartTime.current || 0);
                const minLoadingTime = 1000; // ثانية واحدة
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
                
                setTimeout(() => {
                    setIsLoading(false);
                    loadingStartTime.current = null;
                }, remainingTime);
            }
        };

        applyFilters();
    }, [selectedTypes, priceSort, activeSearchQuery, initialCars, duration, fromDate, toDate, branchId]);

    // Reset isSearching when loading completes
    useEffect(() => {
        if (!isLoading) {
            setIsSearching(false);
        }
    }, [isLoading]);

    const filterSidebarContent = (
        <FilterSidebar
            locale={locale}
            carTypes={carTypes}
            selectedTypes={selectedTypes}
            priceSort={priceSort}
            searchQuery={searchQuery}
            isSearching={isSearching}
            onTypesChange={setSelectedTypes}
            onPriceSortChange={setPriceSort}
            onSearchChange={setSearchQuery}
            onSearchClick={handleSearchClick}
            onSearchKeyDown={handleSearchKeyDown}
            branchId={branchId}
            selectedBranch={selectedBranch}
            branches={branches}
            cities={cities}
            onSelectBranch={handleSelectBranch}
            onRemoveBranchFilter={handleRemoveBranchFilter}
            onResetFilters={handleResetAllFilters}
        />
    );

    const filterSidebarDrawerContent = (
        <FilterSidebar
            locale={locale}
            carTypes={carTypes}
            selectedTypes={selectedTypes}
            priceSort={priceSort}
            searchQuery={searchQuery}
            isSearching={isSearching}
            onTypesChange={setSelectedTypes}
            onPriceSortChange={setPriceSort}
            onSearchChange={setSearchQuery}
            onSearchClick={handleSearchClick}
            onSearchKeyDown={handleSearchKeyDown}
            hideWrapper={true}
            branchId={branchId}
            selectedBranch={selectedBranch}
            branches={branches}
            cities={cities}
            onSelectBranch={handleSelectBranch}
            onRemoveBranchFilter={handleRemoveBranchFilter}
            onResetFilters={handleResetAllFilters}
        />
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block col-span-3 order-2 md:order-1">
                {filterSidebarContent}
            </div>

            {/* Mobile - Drawer Trigger Button */}
            <div className="md:hidden col-span-12 order-1 mb-4">
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full justify-between bg-white p border-gray-200 hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span className="font-medium">
                                    {locale === 'ar' ? 'تصفية' : 'Filter'}
                                </span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader>
                            <DrawerTitle className="text-lg font-semibold">
                                {locale === 'ar' ? 'تصفية حسب:' : 'Filter by:'}
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4 pb-4 overflow-y-auto">
                            {filterSidebarDrawerContent}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            {/* Cars List */}
            <div className="col-span-12 md:col-span-9 order-2 md:order-2">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <CarCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <CarsList cars={cars} locale={locale} itemsPerPage={9} />
                )}
            </div>

        </>
    );
}

