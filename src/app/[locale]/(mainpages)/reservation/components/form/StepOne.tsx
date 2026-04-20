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
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import WarningMessage from "@/app/(components)/WarningMessage";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepOne = ({ control, errors, watch, setValue }: StepOneProps) => {
  const formData = useBookedCarDetailsStore((state) => state.formData);

  const { openDialog } = usePickupDialogStore();

  const handleOpenReturnLocationDialog = () => {
    openDialog("currentLocation", "return", () => {
      const { formData: updatedFormData } = useBookedCarDetailsStore.getState();
      const { latitude, longitude, address } = useLocationStore.getState();

      const locationName =
        updatedFormData.returnType === "MY_LOCATION" &&
        (!updatedFormData.carReturnLocation ||
          updatedFormData.carReturnLocation === "الموقع الحالي") &&
        address
          ? address
          : updatedFormData.carReturnLocation || "الموقع الحالي";

      setValue("carReturnLocation", locationName, { shouldValidate: true });
      setValue(
        "returnLat",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLat ||
            updatedFormData.carReturnLocation === "الموقع الحالي")
          ? latitude
          : updatedFormData.returnLat || null,
      );
      setValue(
        "returnLong",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLong ||
            updatedFormData.carReturnLocation === "الموقع الحالي")
          ? longitude
          : updatedFormData.returnLong || null,
      );
      setValue(
        "carReturnLocationId",
        updatedFormData.carReturnLocationId || null,
      );
      setValue("returnTrainId", updatedFormData.returnTrainId || null);
      setValue("returnAirportId", updatedFormData.returnAirportId || null);
    });
  };

  const handleOpenPickupLocationDialog = () => {
    openDialog("currentLocation", "pickup", () => {
      const { formData: updatedFormData } = useBookedCarDetailsStore.getState();
      const { latitude, longitude, address } = useLocationStore.getState();

      const locationName =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupName ||
          updatedFormData.pickupName === "الموقع الحالي") &&
        address
          ? address
          : updatedFormData.pickupName || "";

      setValue("pickupName", locationName, { shouldValidate: true });
      setValue(
        "pickupLat",
        updatedFormData.pickupType === "MY_LOCATION" &&
          (!updatedFormData.pickupLat ||
            updatedFormData.pickupName === "الموقع الحالي")
          ? latitude
          : updatedFormData.pickupLat || null,
      );
      setValue(
        "pickupLong",
        updatedFormData.pickupType === "MY_LOCATION" &&
          (!updatedFormData.pickupLong ||
            updatedFormData.pickupName === "الموقع الحالي")
          ? longitude
          : updatedFormData.pickupLong || null,
      );
      setValue("pickupId", updatedFormData.pickupId || null);
      setValue("pickupTrainId", updatedFormData.pickupTrainId || null);
      setValue("pickupAirportId", updatedFormData.pickupAirportId || null);
    });
  };

  return (
    <div className="">
      <div className="w-full flex items-center gap-3">
        <div className="w-full relative">
          <Controller
            name="pickupName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="مكان الأستلام:"
                placeholder="حدد مكان الاستلام"
                className="text-base!"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                errorMessage={errors.pickupName?.message}
              />
            )}
          />
          <button
            type="button"
            onClick={handleOpenPickupLocationDialog}
            className="absolute top-0 left-2 flex items-center gap-2 underline"
          >
            <MapPinPlus />
            حدد مكان الاستلام
          </button>
        </div>
        <ArrowLeft className="w-15 h-15 mt-8" />
        <div className="w-full relative">
          <button
            type="button"
            onClick={handleOpenReturnLocationDialog}
            className="absolute top-0 left-2 flex items-center gap-2 underline"
          >
            <MapPinPlus />
            التسليم في مكان اخر
          </button>
          <Controller
            name="carReturnLocation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="مكان التسليم:"
                placeholder="حدد مكان التسليم"
                className="text-base!"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                errorMessage={errors.carReturnLocation?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-15 items-center text-sm">
        {formData.pickupType === "AIRPORT" ||
        formData.pickupType === "TRAIN_STATION" ||
        formData.pickupType === "MY_LOCATION" ? (
          <WarningMessage
            className="mt-0!"
            message={`عند اختيار مطار / محطة قطار / استلام من موقعي يتم اضافه رسوم استلام`}
          />
        ) : (
          <span></span>
        )}
        {formData.returnType === "AIRPORT" ||
        formData.returnType === "TRAIN_STATION" ||
        formData.returnType === "MY_LOCATION" ? (
          <WarningMessage
            className="mt-0!"
            message={`عند اختيار مطار / محطة قطار / استلام من موقعي يتم اضافه رسوم تسليم`}
          />
        ) : (
          <span></span>
        )}
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
            <p className="text-StatusRedBG text-xs mb-3 flex items-center gap-1">
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
            <p className="text-StatusRedBG text-xs mb-3 flex items-center gap-1">
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
