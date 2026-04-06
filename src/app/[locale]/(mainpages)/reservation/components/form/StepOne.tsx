"use client";

import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { ArrowLeft, MapPinPlus } from "lucide-react";

import { Input } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import OffersCard from "@/app/(components)/customCards/OffersCard";
import { Separator } from "@/app/(components)/ui/separator";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepOne = ({ control, errors, watch, setValue }: StepOneProps) => {
  const { openDialog } = usePickupDialogStore();

  const handleOpenReturnLocationDialog = () => {
    openDialog("currentLocation", "return", () => {
      const { filters: updatedFilters } =
        useUserPreferedFiltersStore.getState();
      const { latitude, longitude, address } = useLocationStore.getState();

      const locationName =
        (updatedFilters.carReturnLocationType === "currentLocation" &&
          (!updatedFilters.carReturnLocation ||
            updatedFilters.carReturnLocation === "الموقع الحالي")) &&
        address
          ? address
          : updatedFilters.carReturnLocation || "الموقع الحالي";

      setValue("carReturnLocation", locationName, { shouldValidate: true });
      setValue(
        "returnLat",
        (updatedFilters.carReturnLocationType === "currentLocation" &&
          (!updatedFilters.carReturnLocationLat ||
            updatedFilters.carReturnLocation === "الموقع الحالي"))
          ? latitude
          : updatedFilters.carReturnLocationLat || null,
      );
      setValue(
        "returnLong",
        (updatedFilters.carReturnLocationType === "currentLocation" &&
          (!updatedFilters.carReturnLocationLng ||
            updatedFilters.carReturnLocation === "الموقع الحالي"))
          ? longitude
          : updatedFilters.carReturnLocationLng || null,
      );
      setValue(
        "carReturnLocationId",
        updatedFilters.carReturnLocationId || null,
      );
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpenReturnLocationDialog}
        className="absolute top-2 left-2 flex items-center gap-2"
      >
        <MapPinPlus />
        التسليم في مكان اخر
      </button>

      <div className="w-full flex items-center gap-3">
        <div className="w-full">
          <Controller
            name="pickupName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="مكان الأستلام:"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                errorMessage={errors.pickupName?.message}
              />
            )}
          />
        </div>
        <ArrowLeft className="w-15 h-15 mt-8" />
        <div className="w-full">
          <Controller
            name="carReturnLocation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="مكان التسليم:"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                errorMessage={errors.carReturnLocation?.message}
              />
            )}
          />
        </div>
      </div>

      <Separator className="mt-3 my-4" />

      <div className="w-full flex items-end gap-3 mb-1">
        <div className="w-full">
          <Controller
            name="fromDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                label="مدة و وقت الإيجار:"
                labelIcon={<CarRentIcon />}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                value={field.value}
                onChange={(date: Date | null) => {
                  field.onChange(date);
                  if (
                    date &&
                    watch("toDate") &&
                    new Date(watch("toDate")!) < date
                  ) {
                    setValue("toDate", undefined);
                  }
                }}
              />
            )}
          />
          {errors.fromDate && (
            <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
              {String(errors.fromDate?.message)}
            </p>
          )}
        </div>
        <ArrowLeft className="w-15 h-15 pt-5" />
        <div className="w-full">
          <Controller
            name="toDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                minDate={watch("fromDate") ? watch("fromDate") : undefined}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.toDate && (
            <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
              {String(errors.toDate?.message)}
            </p>
          )}
        </div>
      </div>

      <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen mt-5">
        <div className="scale-130">
          <ExeclusiveOfferIcon />
        </div>
        <p className="flex gap-1 items-center">
          <span className="text-sm font-extrabold">يومين</span>
          <span>مجانا لأن مدة الأيجار أكثر من</span>
          <span className="text-sm font-extrabold">7 أيام</span>
        </p>
      </div>
      <Separator className="my-2" />
      <div className="mb-6">
        <p className="text-base">عروض رينتال جيت:</p>
        <p className="text-sm text-Grey600 mt-2">
          أختر من أفضل عروض التأجير المضافة حديثاً
        </p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <OffersCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default StepOne;
