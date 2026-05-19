import { Controller } from "react-hook-form";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Button, Checkbox } from "@/app/(components)";
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpWideNarrow,
  Search,
} from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import PaginationDateView from "@/app/(components)/PaginationDateView";
import { Separator } from "@/app/(components)/ui/separator";
import FilterDrawer from "../FilterDrawer";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useGetAirports } from "@/hooks/api/useGetAirports";
import { useGetTrainStations } from "@/hooks/api/useGetTrainStations";
import { detectPickupCategory } from "@/lib/utils/pickupLocationCategory";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import SearchDialog from "./SearchDialog";

const CarSearchForm = ({
  control,
  watch,
  setValue,
  handleSubmit,
  handleSearch,
  shown,
  total,
  priceSort,
  onTogglePriceSort,
  onCarSearch,
}: any) => {
  const t = useTranslations("home");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const {
    userPhysical_Address,
    userPhysical_Latitude,
    userPhysical_Longitude,
  } = useLocationStore();
  const { openDialog, setIsCurrentLocationTabDisabled } =
    usePickupDialogStore();
  const { data: airportsData } = useGetAirports();
  const { data: trainStationsData } = useGetTrainStations();
  const showPricesWithTax = useBookedCarDetailsStore(
    (state) => state.showPricesWithTax,
  );
  const setShowPricesWithTax = useBookedCarDetailsStore(
    (state) => state.setShowPricesWithTax,
  );

  const hasStorePickupCoordinates =
    filters.pickupLat != null && filters.pickupLng != null;
  const effectivePickupAddress = hasStorePickupCoordinates
    ? filters.pickupName || userPhysical_Address
    : userPhysical_Address;
  const effectivePickupLatitude = hasStorePickupCoordinates
    ? filters.pickupLat
    : userPhysical_Latitude;
  const effectivePickupLongitude = hasStorePickupCoordinates
    ? filters.pickupLng
    : userPhysical_Longitude;
  const detectedCurrentLocationCategory =
    effectivePickupAddress &&
    effectivePickupLatitude != null &&
    effectivePickupLongitude != null
      ? detectPickupCategory({
          lat: effectivePickupLatitude,
          lng: effectivePickupLongitude,
          address: effectivePickupAddress,
          airports: airportsData?.content ?? [],
          trainStations: trainStationsData?.content ?? [],
        })
      : null;
  const isAirportLocation = detectedCurrentLocationCategory === "airport";
  const isTrainStationLocation =
    detectedCurrentLocationCategory === "trainStation";
  const isRestrictedCurrentLocation =
    isAirportLocation || isTrainStationLocation;
  const shouldShowRestrictedLocationMessage =
    isRestrictedCurrentLocation &&
    filters.pickupType !== "airport" &&
    filters.pickupType !== "trainStation";
  const restrictedLocationMessage = isAirportLocation
    ? t("bookings.searchForm.restrictedAirportLocation")
    : isTrainStationLocation
      ? t("bookings.searchForm.restrictedTrainStationLocation")
      : null;

  useEffect(() => {
    // Keep pickup label in sync when the global current-location changes.
    if (
      userPhysical_Address &&
      filters.pickupType === "currentLocation" &&
      !hasStorePickupCoordinates &&
      filters.pickupName !== userPhysical_Address
    ) {
      setFilter("pickupName", userPhysical_Address);
    }
  }, [
    userPhysical_Address,
    filters.pickupName,
    filters.pickupType,
    hasStorePickupCoordinates,
    setFilter,
  ]);

  const handleOpenLocationDialog = () => {
    const appliedTabMap: Record<
      typeof filters.pickupType,
      "currentLocation" | "airport" | "trainStation" | "branches"
    > = {
      airport: "airport",
      trainStation: "trainStation",
      currentLocation: "currentLocation",
      branches: "branches",
      "": "currentLocation",
    };

    let initialTab = appliedTabMap[filters.pickupType];
    const shouldDisableCurrentLocationTab = isRestrictedCurrentLocation;

    // If no explicit pickup type is applied, default to the restricted tab.
    if (!filters.pickupType && isRestrictedCurrentLocation) {
      initialTab = detectedCurrentLocationCategory;
    }

    openDialog(initialTab, "pickup");
    setIsCurrentLocationTabDisabled(shouldDisableCurrentLocationTab);
  };

  return (
    <>
      <label className="flex flex-wrap cursor-pointer items-center gap-2 hover:bg-Grey100 rounded-lg p-2 w-fit transition-all duration-300">
        <Checkbox
          width={22}
          height={22}
          checked={showPricesWithTax}
          onCheckedChange={(checked) => setShowPricesWithTax(checked === true)}
        />
        <span className="text-sm font-bold sm:text-base">
          {t("bookings.searchForm.showPricesWithTax")}
        </span>
      </label>

      <form
        onSubmit={handleSubmit(handleSearch)}
        className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between lg:gap-4"
      >
        <div className="w-full rounded-2xl border bg-white p-3 sm:p-4 md:p-5 lg:w-[70%]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-3 xl:gap-4">
            <div className="w-full min-w-0 lg:min-w-32 lg:flex-1">
              <div className="flex items-center gap-2">
                <PositioningIcon />
                <p className="text-sm mb-2">
                  {t("bookings.searchForm.pickupLocation")}
                </p>
              </div>
              {(() => {
                const resolvedPickupName = filters.pickupName?.trim() || "";

                return (
                  <>
                    <div
                      title={resolvedPickupName}
                      onClick={handleOpenLocationDialog}
                      className={`h-[40px] rounded-lg p-2 w-full bg-[#eceef2] flex items-center gap-2 cursor-pointer ${
                        shouldShowRestrictedLocationMessage
                          ? "border-2 border-StatusRed"
                          : ""
                      }`}
                    >
                      <p className="text-sm line-clamp-1">
                        {resolvedPickupName ? (
                          <span>{resolvedPickupName}</span>
                        ) : (
                          <span className="text-gray-500">
                            {t("bookings.searchForm.selectPickupLocation")}
                          </span>
                        )}
                      </p>
                    </div>

                    {shouldShowRestrictedLocationMessage &&
                      restrictedLocationMessage && (
                        <span className="block md:hidden mt-2 text-xs text-StatusRed ">
                          {restrictedLocationMessage}
                        </span>
                      )}
                  </>
                );
              })()}
            </div>

            <div className="w-full min-w-0 lg:flex-1">
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    allowClear
                    withTime
                    inputClassName="text-sm!"
                    className="w-full"
                    label={t("bookings.searchForm.rentalPeriod")}
                    placeholder={t("bookings.searchForm.pickupDatePlaceholder")}
                    labelIcon={<CarRentIcon />}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      if (toDate && date && toDate < date) {
                        setValue("toDate", null);
                      }
                    }}
                  />
                )}
              />
            </div>
            <div className="hidden items-center justify-center lg:flex lg:shrink-0">
              <ArrowLeft className="mb-2 h-6 w-6" />
            </div>

            <div className="w-full min-w-0 lg:flex-1">
              <Controller
                name="toDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    allowClear
                    withTime
                    className="w-full"
                    placeholder={t("bookings.searchForm.returnDatePlaceholder")}
                    inputClassName="text-sm!"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={fromDate}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:contents">
              <button
                type="button"
                onClick={onTogglePriceSort}
                title={
                  priceSort === null
                    ? t("bookings.searchForm.sortPriceInactive")
                    : priceSort === "price_asc"
                      ? t("bookings.searchForm.sortPriceAscending")
                      : t("bookings.searchForm.sortPriceDescending")
                }
                aria-label={
                  priceSort === null
                    ? t("bookings.searchForm.sortPriceInactive")
                    : priceSort === "price_asc"
                      ? t("bookings.searchForm.sortPriceAscending")
                      : t("bookings.searchForm.sortPriceDescending")
                }
                className="flex min-h-10 shrink-0 touch-manipulation items-center justify-center rounded-xl border-2 border-Grey400 p-2 sm:min-h-11"
              >
                {priceSort === null ? (
                  <ArrowUpDown
                    className="size-4 shrink-0 sm:size-4.5"
                    aria-hidden
                  />
                ) : priceSort === "price_asc" ? (
                  <ArrowDownWideNarrow
                    className="size-4 shrink-0 sm:size-4.5"
                    aria-hidden
                  />
                ) : (
                  <ArrowUpWideNarrow
                    className="size-4 shrink-0 sm:size-4.5"
                    aria-hidden
                  />
                )}
              </button>
              <FilterDrawer />
              <SearchDialog onSearch={onCarSearch} />
            </div>
          </div>
          {shouldShowRestrictedLocationMessage && restrictedLocationMessage && (
            <span className="hidden md:block mt-2 text-xs text-StatusRed">
              {restrictedLocationMessage}
            </span>
          )}
        </div>

        <div className="w-full rounded-2xl border bg-white p-3 sm:p-4 lg:w-[15%] lg:min-w-42">
          <p className="font-bold">{t("bookings.searchForm.visibleCars")}</p>
          <Separator className="my-4" />
          <PaginationDateView
            shown={shown.toString()}
            total={total.toString()}
          />
        </div>
      </form>
    </>
  );
};

export default CarSearchForm;
