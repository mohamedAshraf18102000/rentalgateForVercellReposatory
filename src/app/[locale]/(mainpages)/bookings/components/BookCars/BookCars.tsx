"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useCompanyCars } from "../../hooks/useCompanyCars";
import CarSearchForm from "../CarSearchForm";
import ActiveFiltersBadges from "../ActiveFiltersBadges";
import CarsGrid from "../CarsGrid";
import LoadMoreButton from "../LoadMoreButton";
import { useLocationStore } from "@/lib/stores/useLocationStore";

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

  // Auto-set pickup location name when address is resolved
  useEffect(() => {
    if (address && filters.pickupType === "currentLocation") {
      setFilter("pickupName", address);
    }
  }, [address]);

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
      fromDate: null,
      toDate: null,
    },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  useEffect(() => {
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays);
    } else {
      setRentalDays(0);
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

      <CarsGrid cars={allCars} isLoading={isLoading} rentalDays={rentalDays} />

      <LoadMoreButton
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
};

export default BookCars;
