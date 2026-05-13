"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useForm } from "react-hook-form";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useCompanyCars } from "../../hooks/useCompanyCars";
import CarSearchForm from "../CarSearchForm";
import CarsGrid from "../CarsGrid";
import LoadMoreButton from "../LoadMoreButton";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import { Button } from "@/app/(components)";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";

interface FormValues {
  location: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const BookCars = () => {
  const [priceSort, setPriceSort] = useState<"price_asc" | "price_desc" | null>(
    null,
  );
  const t = useTranslations("home");
  const { openDialog } = usePickupDialogStore();
  const userPhysical_Address = useLocationStore(
    (state) => state.userPhysical_Address,
  );
  const rentalDays =
    useBookedCarDetailsStore((state) => state.formData.rentalDays) ?? 0;
  const { appliedFilters, filters, setFilter } = useUserPreferedFiltersStore();
  const userPhysical_Longitude = useLocationStore(
    (state) => state.userPhysical_Longitude,
  );
  const userPhysical_Latitude = useLocationStore(
    (state) => state.userPhysical_Latitude,
  );

  const setFormField = useBookedCarDetailsStore((state) => state.setFormField);
  const hasAppliedPickupFilter = Boolean(
    appliedFilters.pickupType ||
    appliedFilters.pickupId ||
    appliedFilters.pickupLat != null ||
    appliedFilters.pickupLng != null,
  );

  const apiFilters = {
    userPhysicalLongitudeFilter: hasAppliedPickupFilter
      ? undefined
      : (userPhysical_Longitude ?? undefined),
    userPhysicalLatitudeFilter: hasAppliedPickupFilter
      ? undefined
      : (userPhysical_Latitude ?? undefined),

    longitude: appliedFilters.pickupLng ?? undefined,
    latitude: appliedFilters.pickupLat ?? undefined,
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
    searchType:
      appliedFilters.pickupType === "branches"
        ? "branch"
        : appliedFilters.pickupType === "currentLocation"
          ? "location"
          : undefined,
    locationType: appliedFilters.pickupType === "branches" ? "1" : undefined,
    brandId: appliedFilters.brandId || undefined,
    ...(priceSort ? { sortBy: priceSort } : {}),
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

  // Keep the form dates in sync with the global filters store
  useEffect(() => {
    const storeFromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const storeToDate = filters.toDate ? new Date(filters.toDate) : null;

    setValue("fromDate", storeFromDate);
    setValue("toDate", storeToDate);
  }, [filters.fromDate, filters.toDate, setValue]);

  useEffect(() => {
    if (fromDate) setFilter("fromDate", fromDate.toISOString());
    else setFilter("fromDate", "");

    if (toDate) setFilter("toDate", toDate.toISOString());
    else setFilter("toDate", "");

    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormField("rentalDays", diffDays);

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
      setFormField("rentalDays", 0);
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
      setFormField("rentalDays", diffDays);
      console.log("Number of Days:", diffDays);
    }
  };

  const handleOpenLocationDialog = () => {
    openDialog("currentLocation", "pickup");
  };

  return (
    <section className="mt-6 sm:mt-10 md:mt-14 lg:mt-[60px]">
      <div className="rounded-2xl bg-white p-3 sm:p-4 md:p-5">
        <CarSearchForm
          control={control}
          watch={watch}
          setValue={setValue}
          handleSubmit={handleSubmit}
          handleSearch={handleSearch}
          shown={allCars.length}
          total={totalElements}
          priceSort={priceSort}
          onTogglePriceSort={() =>
            setPriceSort((prev) => {
              if (prev === null) return "price_asc";
              if (prev === "price_asc") return "price_desc";
              return null;
            })
          }
        />
      </div>
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 md:mt-10 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[450px] rounded-2xl" />
          ))}
        </div>
      ) : allCars.length > 0 ? (
        <>
          <CarsGrid
            cars={allCars}
            isLoading={isLoading}
            rentalDays={rentalDays}
          />
        </>
      ) : (
        <div className="mt-6 flex h-[min(50vh,24rem)] w-full items-center justify-center rounded-2xl bg-white shadow sm:mt-8 sm:h-[22rem] md:mt-10 md:h-[25rem]">
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:px-8">
            <div className="flex flex-col gap-1.5 justify-center items-center">
              <img
                src="/notFound/notFound.webp"
                alt={t("bookings.emptyState.notFoundAlt")}
                className="w-[250px] h-[250px]"
              />
              {userPhysical_Address !== null ? (
                <>
                  <p className="text-base font-medium text-foreground">
                    {t("bookings.emptyState.noCarsAtLocation")}
                  </p>
                  <Button
                    onClick={handleOpenLocationDialog}
                    className="text-sm text-white  cursor-pointer"
                  >
                    {t("bookings.emptyState.selectPickupLocation")}
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-foreground">
                    {t("bookings.emptyState.pickupPrompt")}
                  </p>
                  <Button
                    onClick={handleOpenLocationDialog}
                    className="text-sm text-white  cursor-pointer"
                  >
                    {t("bookings.emptyState.selectPickupLocation")}
                  </Button>
                </>
              )}
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
