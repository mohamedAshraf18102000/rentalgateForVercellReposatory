"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useCompanyCars } from "../../hooks/useCompanyCars";
import CarSearchForm from "../CarSearchForm";
import ActiveFiltersBadges from "../ActiveFiltersBadges";
import CarsGrid from "../CarsGrid";
import LoadMoreButton from "../LoadMoreButton";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";

interface FormValues {
  location: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const BookCars = () => {
  const [rentalDays, setRentalDays] = useState<number>(0);
  const { appliedFilters, filters, setFilter } = useUserPreferedFiltersStore();
  const longitude = useLocationStore((state) => state.longitude);
  const latitude = useLocationStore((state) => state.latitude);
  const address = useLocationStore((state) => state.address);
  const setBookedFormData = useBookedCarDetailsStore(
    (state) => state.setFormData,
  );
  const setFormField = useBookedCarDetailsStore((state) => state.setFormField);

  // Auto-set pickup location name when address is resolved
  useEffect(() => {
    console.log("in the use effect");

    if (address && filters.pickupType === "currentLocation") {
      console.log("in the use effect inside condition");

      setFilter("pickupName", address);

      // Sync with BookedCarDetailsStore
      setBookedFormData({
        pickupName: address,
        pickupLat: latitude,
        pickupLong: longitude,
        carReturnLocation: address,
        returnLat: latitude,
        returnLong: longitude,
      });
    }
  }, [
    address,
    longitude,
    latitude,
    filters.pickupType,
    setFilter,
    setBookedFormData,
  ]);

  const apiFilters = {
    longitude: longitude ?? undefined,
    latitude: latitude ?? undefined,
    minPrice: appliedFilters.priceMin || undefined,
    maxPrice: appliedFilters.priceTo || undefined,
    categoryId: appliedFilters.categoryId || undefined,
    airportId:
      appliedFilters.pickupType === "airport"
        ? appliedFilters.pickupId || undefined
        : undefined,
    trainStationId:
      appliedFilters.pickupType === "trainStation"
        ? appliedFilters.pickupId || undefined
        : undefined,
    brandId: appliedFilters.brandId || undefined,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCompanyCars(apiFilters);

  const allCars = data?.pages.flatMap((page) => page.content) ?? [];

  const totalElements = data?.pages[0]?.totalElements ?? 0;

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      location: "",
      fromDate: filters.fromDate ? new Date(filters.fromDate) : null,
      toDate: filters.toDate ? new Date(filters.toDate) : null,
    },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  useEffect(() => {
    if (fromDate) setFilter("fromDate", fromDate.toISOString());
    else setFilter("fromDate", "");

    if (toDate) setFilter("toDate", toDate.toISOString());
    else setFilter("toDate", "");

    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays);

      // حساب نوع الباقة وحفظها في الـ store
      const { pricingType } = calculateRentalPrice({
        days: diffDays,
        dailyPrice: 1,
        weeklyPrice: 1,
        halfMonthlyPrice: 1,
        monthlyPrice: 1,
        yearlyPrice: 1,
        offerDailyPrice: 0,
        offerWeeklyPrice: 0,
        offerHalfMonthlyPrice: 0,
        offerMonthlyPrice: 0,
        offerYearlyPrice: 0,
      });
      setFormField("plan", pricingType);
    } else {
      setRentalDays(0);
      setFormField("plan", null);
    }
  }, [fromDate, toDate]);

  const handleSearch = (data: FormValues) => {
    console.log("From Date:", data.fromDate);
    console.log("To Date:", data.toDate);

    if (data.fromDate && data.toDate) {
      const diffTime = Math.abs(
        data.toDate.getTime() - data.fromDate.getTime(),
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays);
      console.log("Number of Days:", diffDays);
    }
  };

  return (
    <section className="mt-[60px]">
      <div className="bg-white p-5 rounded-2xl">
        <CarSearchForm
          control={control}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit}
          handleSearch={handleSearch}
          shown={allCars.length}
          total={totalElements}
        />

        <ActiveFiltersBadges
          filters={appliedFilters}
          setFilter={setFilter}
          fromDate={fromDate}
          toDate={toDate}
          rentalDays={rentalDays}
          clearFromDate={() => setValue("fromDate", null)}
          clearToDate={() => setValue("toDate", null)}
        />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[450px] rounded-2xl" />
          ))}
        </div>
      ) : allCars.length > 0 ? (
        <CarsGrid
          cars={allCars}
          isLoading={isLoading}
          rentalDays={rentalDays}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-[400px] rounded-2xl bg-white shadow mt-10">
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className="flex flex-col gap-1.5">
              <p className="text-base font-medium text-foreground">
                لا توجد سيارات حالياً
              </p>
            </div>
          </div>
        </div>
      )}

      <LoadMoreButton
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
};

export default BookCars;
