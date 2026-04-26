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
  const { address } = useLocationStore();
  const { openDialog } = usePickupDialogStore();
  const showPricesWithTax = useBookedCarDetailsStore(
    (state) => state.showPricesWithTax,
  );
  const setShowPricesWithTax = useBookedCarDetailsStore(
    (state) => state.setShowPricesWithTax,
  );

  useEffect(() => {
    // Keep pickup label in sync when the global current-location changes.
    if (
      address &&
      filters.pickupType === "currentLocation" &&
      filters.pickupName !== address
    ) {
      setFilter("pickupName", address);
    }
  }, [address, filters.pickupName, filters.pickupType, setFilter]);

  const handleOpenLocationDialog = () => {
    openDialog("currentLocation", "pickup");
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
                const displayPickupName =
                  (filters.pickupName === currentLocationLabel ||
                    filters.pickupName === "الموقع الحالي" ||
                    !filters.pickupName) &&
                  address
                    ? address
                    : filters.pickupName || currentLocationLabel;
                return (
                  <div
                    title={displayPickupName}
                    onClick={handleOpenLocationDialog}
                    className="h-[40px] rounded-lg p-2 w-full bg-[#eceef2] flex items-center gap-2 cursor-pointer"
                  >
                    <p className="text-sm line-clamp-1">{displayPickupName}</p>
                  </div>
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
