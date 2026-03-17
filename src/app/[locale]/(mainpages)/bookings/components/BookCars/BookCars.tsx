"use client";

import { useForm } from "react-hook-form";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useCompanyCars } from "../../hooks/useCompanyCars";
import CarSearchForm from "../CarSearchForm";
import ActiveFiltersBadges from "../ActiveFiltersBadges";
import CarsGrid from "../CarsGrid";
import LoadMoreButton from "../LoadMoreButton";

interface FormValues {
  location: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const BookCars = () => {
  const { filters, appliedFilters, setFilter } = useUserPreferedFiltersStore();

  const apiFilters = {
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

  const handleSearch = (data: FormValues) => {
    console.log(data);
  };

  return (
    <section className="mt-[60px]">
      <CarSearchForm
        control={control}
        watch={watch}
        setValue={setValue}
        handleSubmit={handleSubmit}
        handleSearch={handleSearch}
        shown={allCars.length}
        total={totalElements}
      />

      <ActiveFiltersBadges filters={filters} setFilter={setFilter} />

      <CarsGrid cars={allCars} isLoading={isLoading} />

      <LoadMoreButton
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </section>
  );
};

export default BookCars;
