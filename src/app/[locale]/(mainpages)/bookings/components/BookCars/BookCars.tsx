"use client";

import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import { Separator } from "@/app/(components)/ui/separator";
import { Input } from "@/app/(components)/ui/input";
import { ArrowLeft, Funnel, MapPin, Search, UserRound, X } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import { Button, Checkbox, DatePicker } from "@/app/(components)";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { useForm, Controller } from "react-hook-form";
import FilterDrawer from "./FilterDrawer";
import CustomBadge from "@/app/(components)/ui/customBadge";
import Link from "next/link";

interface FormValues {
  location: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const BookCars = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      location: "",
      fromDate: null,
      toDate: null,
    },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const handleSearch = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <section className="mt-[60px]">
      <div className=" w-full">
        <div className="flex items-center gap-2">
          <Checkbox
            className="rounded-[7px]"
            width={25}
            height={25}
            id="rememberMe"
            checked={true}
          />
          <label htmlFor="rememberMe" className="text-base font-bold">
            عرض الأسعار بالضريبة
          </label>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex items-center justify-between mt-3"
      >
        <div className="p-5 bg-white w-[70%] shadow-lg rounded-2xl">
          <div className="flex items-end gap-4 w-full">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  labelIcon={<PositioningIcon />}
                  id="name"
                  type="text"
                  placeholder="ادخل الاسم"
                  label="مكان الأستلام:"
                  className="bg-Grey100! rounded-xl!"
                  labelClassName="text-base text-primary"
                  startIcon={<UserRound className="text-primary" />}
                />
              )}
            />

            <Controller
              name="fromDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  withTime
                  pickerDateLabel="من يوم:"
                  pickerTimeLabel="من الساعة:"
                  labelClassName="text-base!"
                  inputClassName="bg-Grey100! rounded-xl!"
                  className="w-full"
                  locale="ar"
                  placeholder="من..."
                  label="مدة الإيجار:"
                  labelIcon={<CarRentIcon />}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    // If toDate is before the new fromDate, clear or update toDate
                    if (toDate && date && toDate < date) {
                      setValue("toDate", null);
                    }
                  }}
                />
              )}
            />

            <div className="">
              <ArrowLeft className="w-8 h-8" />
            </div>

            <Controller
              name="toDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  withTime
                  pickerDateLabel="من يوم:"
                  pickerTimeLabel="من الساعة:"
                  labelClassName="text-base!"
                  placeholder="إلى..."
                  inputClassName="bg-Grey100! rounded-xl!"
                  className="w-full"
                  locale="ar"
                  value={field.value}
                  onChange={field.onChange}
                  minDate={fromDate}
                />
              )}
            />

            <FilterDrawer />

            <Button className="w-10! h-10! p-0!" type="submit">
              <Search className="w-6! h-6!" />
            </Button>
          </div>

          <div className="">
            <Separator className="my-5" />
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <CustomBadge key={index} title="نوع التصفية" />
              ))}
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-white w-[15%] shadow-lg rounded-2xl">
          <p className="font-bold">السيارات الظاهرة:</p>
          <Separator className="my-4" />
          <div className="flex items-center justify-evenly">
            <p className="p-2 rounded-lg font-bold">12</p>
            <p className="p-2 rounded-lg ">من أصل</p>
            <p className="p-2 rounded-lg font-bold">1249 </p>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-4 gap-8 mt-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <Link key={index} href={`/carDetails/${1}`}>
            <CarsCard advancedCard />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BookCars;
