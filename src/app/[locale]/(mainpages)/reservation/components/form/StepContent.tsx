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
import { useState, useEffect } from "react";
import { DialogWrapper } from "@/app/(components)";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { LocateFixed } from "lucide-react";
import { useLocationStore } from "@/lib/stores/useLocationStore";

interface StepContentProps {
  activeStep: number;
}

const StepContent = ({ activeStep }: StepContentProps) => {
  const { displayStep, animationClass } = useStepAnimation(activeStep);
  const { filters, setFilter } = useUserPreferedFiltersStore();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { address } = useLocationStore();

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy hh:mm a", { locale: arEG });
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
            <Input
              label="مكان الأستلام:"
              labelIcon={<CarRentIcon />}
              labelClassName="text-base!"
              value={filters.pickupName || ""}
              readOnly
            />
            <ArrowLeft className="w-15 h-15 mt-7" />
            <Input
              label="مكان التسليم:"
              labelIcon={<CarRentIcon />}
              labelClassName="text-base!"
              value={filters.carReturnLocation || filters.pickupName || ""}
              readOnly
            />
          </div>
          <Separator className="mt-3" />

          <div className="w-full flex items-end gap-3 mb-3">
            <DateTimePicker
              label="مدة و وقت الإيجار:"
              labelIcon={<CarRentIcon />}
              className="w-full"
              inputClassName="text-base!"
              withTime
              allowClear
              value={filters.fromDate ? new Date(filters.fromDate) : null}
              onChange={(date) => {
                setFilter("fromDate", date ? date.toISOString() : "");
                if (date && filters.toDate && new Date(filters.toDate) < date) {
                  setFilter("toDate", "");
                }
              }}
            />
            <ArrowLeft className="w-15 h-15 mt-8" />
            <DateTimePicker
              className="w-full"
              inputClassName="text-base!"
              withTime
              allowClear
              minDate={
                filters.fromDate ? new Date(filters.fromDate) : undefined
              }
              value={filters.toDate ? new Date(filters.toDate) : null}
              onChange={(date) =>
                setFilter("toDate", date ? date.toISOString() : "")
              }
            />
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
      content: "...",
    },
    {
      step: 3,
      colorClass: "step-color-3",
      label: "الخطوة الثالثة",
      content: "...",
    },
  ];

  const current = stepData.find((s) => s.step === displayStep);
  if (!current) return null;

  return (
    <div className={`${animationClass}`}>
      <div>{current.content}</div>
    </div>
  );
};

export default StepContent;
