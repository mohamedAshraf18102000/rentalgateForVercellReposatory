"use client";

import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import { Separator } from "@/app/(components)/ui/separator";
import { Input } from "@/app/(components)/ui/input";
import { ArrowLeft, Search, UserRound } from "lucide-react";
import PositioningIcon from "@/constants/icons/PositioningIcon";
import { Button, Checkbox } from "@/app/(components)";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { useForm, Controller } from "react-hook-form";
import FilterDrawer from "./FilterDrawer";
import CustomBadge from "@/app/(components)/ui/customBadge";
import Link from "next/link";
import PaginationDateView from "@/app/(components)/PaginationDateView";
import { getCompanyCars } from "@/services/companyCars/cars.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CarApiResponse } from "@/types/companyCars/cars";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

interface FormValues {
  location: string;
  fromDate: Date | null;
  toDate: Date | null;
}

const BookCars = () => {
  const { rentPeriod, carCategory } = useUserPreferedFiltersStore();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CarApiResponse>({
      queryKey: ["company-cars"],
      queryFn: ({ pageParam = 0 }) => getCompanyCars(pageParam as number),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
    });

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
              <CustomBadge title={`${rentPeriod}`} />
              <CustomBadge title={`${carCategory}`} />
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-white w-[15%] shadow-lg rounded-2xl">
          <p className="font-bold">السيارات الظاهرة:</p>
          <Separator className="my-4" />
          <PaginationDateView
            shown={allCars.length.toString()}
            total={totalElements.toString()}
          />
        </div>
      </form>

      <div className="grid grid-cols-4 gap-8 mt-10">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white h-[450px] rounded-2xl flex flex-col gap-3 overflow-hidden p-3"
              >
                <div className="h-[250px] w-full">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
                <div className="h-[150px] w-full">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              </div>
            ))
          : allCars.map((car, index) => (
              <Link key={index} href={`/carDetails/${car.ccbId}`}>
                <CarsCard
                  carImage={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${car.carImage}`}
                  carName={car.carName}
                  advancedCard
                  carBrand={car.brandName}
                  companyLogo={car.companyLogo}
                  companyName={car.companyName}
                  deliveryInMinutes={car.deliveryInMinutes!}
                />
              </Link>
            ))}
      </div>
      {hasNextPage && (
        <div className="w-full flex justify-center mt-10">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-fit text-base! px-20!"
          >
            {isFetchingNextPage ? "جاري التحميل..." : "المزيد"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default BookCars;
