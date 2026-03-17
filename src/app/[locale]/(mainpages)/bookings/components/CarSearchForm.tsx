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
        <div className="p-5 bg-white w-[70%] shadow-lg rounded-2xl">
          <div className="flex items-end gap-4">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="مكان الأستلام:"
                  labelIcon={<PositioningIcon />}
                  startIcon={<UserRound />}
                />
              )}
            />

            <Controller
              name="fromDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
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

        <div className="p-2.5 bg-white w-[15%] shadow-lg rounded-2xl">
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
