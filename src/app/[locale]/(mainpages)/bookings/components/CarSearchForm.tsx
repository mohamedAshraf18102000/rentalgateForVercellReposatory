import { Controller } from "react-hook-form";
import { Input } from "@/app/(components)/ui/input";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { Button, Checkbox } from "@/app/(components)";
import { ArrowLeft, Search, UserRound } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import PaginationDateView from "@/app/(components)/PaginationDateView";
import { Separator } from "@/app/(components)/ui/separator";
import FilterDrawer from "./BookCars/FilterDrawer";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

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

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox width={25} height={25} checked />
        <label className="text-base font-bold">عرض الأسعار بالضريبة</label>
      </div>

      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex items-center justify-between mt-3"
      >
        <div className="p-5 bg-white w-[70%] border rounded-2xl">
          <div className="flex items-end gap-4">
            <div className="w-full">
              <div className="flex items-center gap-2">
                <PositioningIcon />
                <p className="text-sm mb-2">مكان الاستلام:</p>
              </div>
              <div
                title={filters.pickupName}
                className="h-[40px] rounded-lg p-2 w-full bg-[#eceef2] flex items-center gap-2"
              >
                <p className="text-sm line-clamp-1">
                  {filters.pickupName || "الموقع الحالي"}
                </p>
              </div>
            </div>

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
            <div className="flex items-center justify-center">
              <ArrowLeft className="w-6 h-6 mb-2" />
            </div>

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

            <FilterDrawer />

            <Button type="submit">
              <Search />
            </Button>
          </div>
        </div>

        <div className="p-2.5 bg-white w-[15%] border rounded-2xl">
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
