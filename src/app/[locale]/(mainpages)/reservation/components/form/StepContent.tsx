"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import { Separator } from "@/app/(components)/ui/separator";
import OffersCard from "@/app/(components)/customCards/OffersCard";
import { Input } from "@/app/(components)";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import { ArrowLeft, MapPinPlus } from "lucide-react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import { format } from "date-fns";
import { arEG } from "date-fns/locale";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { LocateFixed } from "lucide-react";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reservationSchema,
  ReservationFormValues,
} from "@/lib/validations/reservationSchema";
import { AlertCircle } from "lucide-react";

interface StepContentProps {
  activeStep: number;
}

export interface StepContentRef {
  validateStep: () => Promise<boolean>;
  getValues: () => ReservationFormValues;
}

const StepContent = forwardRef<StepContentRef, StepContentProps>(
  ({ activeStep }, ref) => {
    const { displayStep, animationClass } = useStepAnimation(activeStep);
    const { filters, setFilter } = useUserPreferedFiltersStore();
    const [isMapOpen, setIsMapOpen] = useState(false);
    const { address } = useLocationStore();

    const {
      control,
      handleSubmit,
      watch,
      setValue,
      getValues,
      formState: { errors },
      trigger,
    } = useForm<ReservationFormValues>({
      resolver: zodResolver(reservationSchema),
      defaultValues: {
        pickupName: filters.pickupName || "",
        carReturnLocation:
          filters.carReturnLocation || filters.pickupName || "",
        fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
        toDate: filters.toDate ? new Date(filters.toDate) : undefined,
        fullName: "",
        phoneNumber: "",
        idNumber: "",
        email: "",
        services: [],
      },
      mode: "onChange",
    });

    useImperativeHandle(ref, () => ({
      validateStep: async () => {
        let fieldsToValidate: (keyof ReservationFormValues)[] = [];
        if (displayStep === 1) {
          fieldsToValidate = [
            "pickupName",
            "carReturnLocation",
            "fromDate",
            "toDate",
          ];
        } else if (displayStep === 2) {
          fieldsToValidate = ["fullName", "phoneNumber", "idNumber", "email"];
        }
        return await trigger(fieldsToValidate);
      },
      getValues: () => getValues(),
    }));

    // Sync store -> form if address is resolved but filter is still placeholder
    useEffect(() => {
      if (address) {
        if (filters.pickupName === "الموقع الحالي" || !filters.pickupName) {
          setValue("pickupName", address);
          setFilter("pickupName", address);
        }
        if (
          filters.carReturnLocation === "الموقع الحالي" ||
          !filters.carReturnLocation ||
          filters.carReturnLocation === ""
        ) {
          // If return location is placeholder or empty, use the address
          setValue("carReturnLocation", address);
          setFilter("carReturnLocation", address);
        }
      }
    }, [address, filters.pickupName, filters.carReturnLocation, setValue, setFilter]);

    // Keep store in sync with form
    useEffect(() => {
      const subscription = watch((value) => {
        if (value.fromDate)
          setFilter("fromDate", (value.fromDate as Date).toISOString());
        if (value.toDate)
          setFilter("toDate", (value.toDate as Date).toISOString());
        if (value.pickupName && value.pickupName !== "الموقع الحالي")
          setFilter("pickupName", value.pickupName);
        if (
          value.carReturnLocation &&
          value.carReturnLocation !== "الموقع الحالي"
        )
          setFilter("carReturnLocation", value.carReturnLocation);
      });
      return () => subscription.unsubscribe();
    }, [watch, setFilter]);

    const [tempAddress, setTempAddress] = useState<string>(
      filters.carReturnLocation || "",
    );
    const [tempLat, setTempLat] = useState<number | undefined>(
      filters.carReturnLocationLat,
    );
    const [tempLng, setTempLng] = useState<number | undefined>(
      filters.carReturnLocationLng,
    );

    useEffect(() => {
      if (isMapOpen) {
        setTempAddress(filters.carReturnLocation || "");
        setTempLat(filters.carReturnLocationLat);
        setTempLng(filters.carReturnLocationLng);
      }
    }, [
      isMapOpen,
      filters.carReturnLocation,
      filters.carReturnLocationLat,
      filters.carReturnLocationLng,
    ]);

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      try {
        return format(new Date(dateStr), "dd/MM/yyyy hh:mm a", {
          locale: arEG,
        });
      } catch (e) {
        return dateStr;
      }
    };

    const stepData = [
      {
        step: 1,
        colorClass: "step-color-1",
        label: "الخطوة الأولى",
        content: (
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
                      if (tempLat !== undefined)
                        setFilter("carReturnLocationLat", tempLat);
                      if (tempLng !== undefined)
                        setFilter("carReturnLocationLng", tempLng);
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
              <ArrowLeft className="w-15 h-15 mt-7" />
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

            <Separator className="mt-3" />

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
                      onChange={(date) => {
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
              <ArrowLeft className="w-15 h-15 mt-8" />
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
                      minDate={
                        watch("fromDate") ? watch("fromDate") : undefined
                      }
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

            <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen">
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
        ),
      },
      {
        step: 2,
        colorClass: "step-color-2",
        label: "الخطوة الثانية",
        content: (
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="الاسم الكامل"
                    placeholder="أدخل الاسم الرباعي"
                    errorMessage={errors.fullName?.message}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="رقم الهاتف"
                    placeholder="05xxxxxxxx"
                    errorMessage={errors.phoneNumber?.message}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
              <Controller
                name="idNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="رقم الهوية / الجواز"
                    placeholder="أدخل رقم الهوية"
                    errorMessage={errors.idNumber?.message}
                  />
                )}
              />
            </div>
            <div className="col-span-1">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="البريد الإلكتروني"
                    placeholder="example@mail.com"
                    errorMessage={errors.email?.message}
                  />
                )}
              />
            </div>
          </div>
        ),
      },
      {
        step: 3,
        colorClass: "step-color-3",
        label: "الخطوة الثالثة",
        content: (
          <div className="space-y-4">
            <p className="text-lg font-bold">تحديد الخدمات الإضافية</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold">تأمين شامل</p>
                  <p className="text-sm text-gray-500">
                    حماية كاملة من الحوادث
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <div className="p-4 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold">مقعد أطفال</p>
                  <p className="text-sm text-gray-500">للأمان والراحة</p>
                </div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </div>
        ),
      },
    ];

    const current = stepData.find((s) => s.step === displayStep);
    if (!current) return null;

    return (
      <div className={`${animationClass}`}>
        <div>{current.content}</div>
      </div>
    );
  },
);

StepContent.displayName = "StepContent";

export default StepContent;
