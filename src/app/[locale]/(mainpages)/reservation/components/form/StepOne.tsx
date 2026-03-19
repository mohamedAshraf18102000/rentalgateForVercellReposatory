
"use client";

import { useState, useEffect } from "react";
import { Control, Controller, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { ArrowLeft, MapPinPlus, LocateFixed } from "lucide-react";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";

import { Input, DialogWrapper } from "@/app/(components)";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import OffersCard from "@/app/(components)/customCards/OffersCard";
import { Separator } from "@/app/(components)/ui/separator";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepOne = ({ control, errors, watch, setValue }: StepOneProps) => {
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState<string>(filters.carReturnLocation || "");
  const [tempLat, setTempLat] = useState<number | undefined>(filters.carReturnLocationLat);
  const [tempLng, setTempLng] = useState<number | undefined>(filters.carReturnLocationLng);

  useEffect(() => {
    if (isMapOpen) {
      setTempAddress(filters.carReturnLocation || "");
      setTempLat(filters.carReturnLocationLat);
      setTempLng(filters.carReturnLocationLng);
    }
  }, [isMapOpen, filters.carReturnLocation, filters.carReturnLocationLat, filters.carReturnLocationLng]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className="absolute top-2 left-2 flex items-center gap-2"
      >
        <MapPinPlus />
        التسليم في مكان اخر
      </button>

      <DialogWrapper
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        size="xl"
        header={{ mainTitle: "اختر موقع التسليم" }}
        content={
          <div className="overflow-hidden">
            <div className="flex p-2 gap-2">
              <LocateFixed />
              {tempAddress || "الرجاء تحديد موقع من الخريطة"}
            </div>
            <GoogleMapsLocation
              storeless
              initialLat={filters.carReturnLocationLat}
              initialLng={filters.carReturnLocationLng}
              onLocationChange={(lat, lng, address) => {
                setTempAddress(address || "");
                setTempLat(lat);
                setTempLng(lng);
              }}
            />
          </div>
        }
        footer={
          <div className="w-full flex items-center justify-end gap-2 mt-2">
            <button
              onClick={() => setIsMapOpen(false)}
              className="py-3 text-primary font-normal w-fit px-2 underline underline-offset-3"
            >
              إغلاق
            </button>
            <button
              onClick={() => {
                setFilter("carReturnLocation", tempAddress);
                setValue("carReturnLocation", tempAddress, {
                  shouldValidate: true,
                });
                if (tempLat !== undefined) setFilter("carReturnLocationLat", tempLat);
                if (tempLng !== undefined) setFilter("carReturnLocationLng", tempLng);
                setIsMapOpen(false);
              }}
              className="rounded-xl py-3 bg-primary text-white font-bold w-fit px-5"
            >
              حفظ
            </button>
          </div>
        }
      />

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
                  if (date && watch("toDate") && new Date(watch("toDate")!) < date) {
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