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

const CarSearchForm = ({
  control,
  watch,
  setValue,
  handleSubmit,
  handleSearch,
  shown,
  total,
}: any) => {
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const { filters } = useUserPreferedFiltersStore();
  const { address } = useLocationStore();
  const showPricesWithTax = useBookedCarDetailsStore(
    (state) => state.showPricesWithTax,
  );
  const setShowPricesWithTax = useBookedCarDetailsStore(
    (state) => state.setShowPricesWithTax,
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Checkbox
          width={25}
          height={25}
          checked={showPricesWithTax}
          onCheckedChange={(checked) => setShowPricesWithTax(checked === true)}
        />
        <label className="text-sm font-bold sm:text-base">
          عرض الأسعار بالضريبة
        </label>
      </div>

      <form
        onSubmit={handleSubmit(handleSearch)}
        className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between lg:gap-4"
      >
        <div className="w-full rounded-2xl border bg-white p-3 sm:p-4 md:p-5 lg:w-[70%]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-3 xl:gap-4">
            <div className="w-full min-w-0 lg:min-w-32 lg:flex-1">
              <div className="flex items-center gap-2">
                <PositioningIcon />
                <p className="text-sm mb-2">مكان الاستلام:</p>
              </div>
              {(() => {
                const displayPickupName =
                  (filters.pickupName === "الموقع الحالي" ||
                    !filters.pickupName) &&
                  address
                    ? address
                    : filters.pickupName || "الموقع الحالي";
                return (
                  <div
                    title={displayPickupName}
                    className="h-[40px] rounded-lg p-2 w-full bg-[#eceef2] flex items-center gap-2"
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
                    label="مدة الإيجار:"
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
          <p className="font-bold">السيارات الظاهرة:</p>
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
