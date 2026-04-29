import { Controller } from "react-hook-form";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Button, Checkbox } from "@/app/(components)";
import { ArrowLeft, Search } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import PaginationDateView from "@/app/(components)/PaginationDateView";
import { Separator } from "@/app/(components)/ui/separator";
import FilterDrawer from "./BookCars/FilterDrawer";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useGetAirports } from "@/hooks/api/useGetAirports";
import { useGetTrainStations } from "@/hooks/api/useGetTrainStations";
import { detectPickupCategory } from "@/lib/utils/pickupLocationCategory";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const CarSearchForm = ({
  control,
  watch,
  setValue,
  handleSubmit,
  handleSearch,
  shown,
  total,
}: any) => {
  const t = useTranslations("home");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const { userPhysical_Address, userPhysical_Latitude, userPhysical_Longitude } = useLocationStore();
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
  const detectedCurrentLocationCategory =
    userPhysical_Address && userPhysical_Latitude != null && userPhysical_Longitude != null
      ? detectPickupCategory({
          lat: userPhysical_Latitude,
          lng: userPhysical_Longitude,
          address: userPhysical_Address,
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
    ? "عنوانك الحالي هو مطار يرجي اختيار من المطارات المتاحة"
    : isTrainStationLocation
      ? "عنوانك الحالي هو محطة قطار يرجي اختيار من محطات القطار المتاحة"
      : null;

  useEffect(() => {
    // Keep pickup label in sync when the global current-location changes.
    if (
      userPhysical_Address &&
      filters.pickupType === "currentLocation" &&
      filters.pickupName !== userPhysical_Address
    ) {
      setFilter("pickupName", userPhysical_Address);
    }
  }, [userPhysical_Address, filters.pickupName, filters.pickupType, setFilter]);

  const handleOpenLocationDialog = () => {
    let initialTab: "currentLocation" | "airport" | "trainStation" =
      filters.pickupType === "airport" || filters.pickupType === "trainStation"
        ? filters.pickupType
        : "currentLocation";
    let shouldDisableCurrentLocationTab = false;

    if (isRestrictedCurrentLocation) {
      initialTab = detectedCurrentLocationCategory;
      shouldDisableCurrentLocationTab = true;
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
                const currentLocationLabel = t(
                  "bookings.searchForm.currentLocation",
                );
                const branchPickupLabel = t("bookings.searchForm.branchPickup");
                const resolvedPickupName =
                  (filters.pickupName === currentLocationLabel ||
                    filters.pickupName === "الموقع الحالي" ||
                    !filters.pickupName) &&
                  userPhysical_Address
                    ? userPhysical_Address
                    : filters.pickupName || currentLocationLabel;
                const displayPickupName =
                  filters.pickupType === "branches"
                    ? `${branchPickupLabel}${resolvedPickupName ? ` - ${resolvedPickupName}` : ""}`
                    : resolvedPickupName;
                return (
                  <>
                    <div
                      title={displayPickupName}
                      onClick={handleOpenLocationDialog}
                      className={`h-[40px] rounded-lg p-2 w-full bg-[#eceef2] flex items-center gap-2 cursor-pointer ${
                        shouldShowRestrictedLocationMessage
                          ? "border-2 border-StatusRed"
                          : ""
                      }`}
                    >
                      <p className="text-sm line-clamp-1">
                        {displayPickupName}
                      </p>
                    </div>
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
              <FilterDrawer />
              <Button type="submit" className="w-full shrink-0 sm:w-auto">
                <Search />
              </Button>
            </div>
          </div>
          {shouldShowRestrictedLocationMessage && restrictedLocationMessage && (
            <span className="text-xs text-StatusRed">
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
