"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { MapPinPlus } from "lucide-react";
import { LucideIcon } from "lucide-react";

import { Input } from "@/app/(components)";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import WarningMessage from "@/app/(components)/WarningMessage";
import { Separator } from "@/app/(components)/ui/separator";
import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";

interface StepOneLocationSectionProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  formData: ReservationFormData;
  isRTL: boolean;
  ArrowIcon: LucideIcon;
  pickupDisplayValue: string | undefined;
  returnDisplayValue: string | undefined;
  pickupLocationLabel: string;
  pickupLocationPlaceholder: string;
  dropoffLocationLabel: string;
  dropoffLocationPlaceholder: string;
  dropoffDifferentLocationLabel: string;
  pickupWarningMessage: string;
  dropoffWarningMessage: string;
  onOpenPickupDialog: () => void;
  onOpenReturnDialog: () => void;
}

const StepOneLocationSection = ({
  control,
  errors,
  formData,
  isRTL,
  ArrowIcon,
  pickupDisplayValue,
  returnDisplayValue,
  pickupLocationLabel,
  pickupLocationPlaceholder,
  dropoffLocationLabel,
  dropoffLocationPlaceholder,
  dropoffDifferentLocationLabel,
  pickupWarningMessage,
  dropoffWarningMessage,
  onOpenPickupDialog,
  onOpenReturnDialog,
}: StepOneLocationSectionProps) => {
  const showPickupWarning =
    formData.pickupType === "AIRPORT" ||
    formData.pickupType === "TRAIN_STATION" ||
    formData.pickupType === "MY_LOCATION";

  const showDropoffWarning =
    formData.returnType === "AIRPORT" ||
    formData.returnType === "TRAIN_STATION" ||
    formData.returnType === "MY_LOCATION";

  return (
    <>
      <div className="flex w-full flex-col items-start gap-3 lg:flex-row lg:items-center">
        <div className="w-full relative">
          <Controller
            name="pickupName"
            control={control}
            render={({ field }) => (
              <Input
                required
                {...field}
                value={pickupDisplayValue || ""}
                label={pickupLocationLabel}
                placeholder={pickupLocationPlaceholder}
                className="text-base! cursor-pointer"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                onClick={onOpenPickupDialog}
                errorMessage={errors.pickupName?.message}
              />
            )}
          />
        </div>
        <ArrowIcon className="hidden h-12 w-12 shrink-0 pt-5 lg:block" />
        <div className="w-full relative">
          <button
            type="button"
            onClick={onOpenReturnDialog}
            className={`absolute top-0 flex items-center gap-1 text-xs underline sm:gap-2 sm:text-sm ${
              isRTL ? "left-2" : "right-2"
            }`}
          >
            <MapPinPlus />
            {dropoffDifferentLocationLabel}
          </button>
          <Controller
            name="carReturnLocation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                required
                value={returnDisplayValue || ""}
                label={dropoffLocationLabel}
                placeholder={dropoffLocationPlaceholder}
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

      <div className="grid w-full grid-cols-1 items-center gap-4 text-sm md:grid-cols-2 md:gap-15">
        {showPickupWarning ? (
          <WarningMessage className="mt-0!" message={pickupWarningMessage} />
        ) : (
          <span></span>
        )}
        {showDropoffWarning ? (
          <WarningMessage className="mt-0!" message={dropoffWarningMessage} />
        ) : (
          <span></span>
        )}
      </div>

      <Separator className="mt-3 my-4" />
    </>
  );
};

export default StepOneLocationSection;
