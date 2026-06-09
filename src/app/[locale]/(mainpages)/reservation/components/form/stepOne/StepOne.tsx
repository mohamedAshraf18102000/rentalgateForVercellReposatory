"use client";

import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import StepOneDateSection from "./StepOneDateSection";
import StepOneLocationSection from "./StepOneLocationSection";
import StepOneOffersSection from "./StepOneOffersSection";
import { useStepOne } from "./useStepOne";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepOne = ({ control, errors, watch, setValue }: StepOneProps) => {
  const {
    t,
    isRTL,
    ArrowIcon,
    formData,
    offerPackages,
    bestOffer,
    rentalDays,
    pickupDisplayValue,
    returnDisplayValue,
    fromDate,
    minToDate,
    isDateTimeBlocked,
    isDateBlocked,
    normalizeDateTimeToAvailability,
    isDateLessThanMinimumRental,
    handleOpenPickupLocationDialog,
    handleOpenReturnLocationDialog,
  } = useStepOne({ control, errors, watch, setValue });

  return (
    <div className="">
      <StepOneLocationSection
        control={control}
        errors={errors}
        formData={formData}
        isRTL={isRTL}
        ArrowIcon={ArrowIcon}
        pickupDisplayValue={pickupDisplayValue}
        returnDisplayValue={returnDisplayValue}
        pickupLocationLabel={t("reservation.stepOne.pickupLocationLabel")}
        pickupLocationPlaceholder={t(
          "reservation.stepOne.pickupLocationPlaceholder",
        )}
        dropoffLocationLabel={t("reservation.stepOne.dropoffLocationLabel")}
        dropoffLocationPlaceholder={t(
          "reservation.stepOne.dropoffLocationPlaceholder",
        )}
        dropoffDifferentLocationLabel={t(
          "reservation.stepOne.dropoffDifferentLocation",
        )}
        pickupWarningMessage={t("reservation.stepOne.pickupWarning")}
        dropoffWarningMessage={t("reservation.stepOne.dropoffWarning")}
        onOpenPickupDialog={handleOpenPickupLocationDialog}
        onOpenReturnDialog={handleOpenReturnLocationDialog}
      />

      <StepOneDateSection
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        ArrowIcon={ArrowIcon}
        fromDate={fromDate}
        minToDate={minToDate}
        rentalPeriodLabel={t("reservation.stepOne.rentalPeriodLabel")}
        pickupDatePlaceholder={t("reservation.stepOne.pickupDatePlaceholder")}
        dropoffDatePlaceholder={t("reservation.stepOne.dropoffDatePlaceholder")}
        isDateBlocked={isDateBlocked}
        isDateTimeBlocked={isDateTimeBlocked}
        normalizeDateTimeToAvailability={normalizeDateTimeToAvailability}
        isDateLessThanMinimumRental={isDateLessThanMinimumRental}
      />

      <StepOneOffersSection
        bestOffer={bestOffer}
        offerPackages={offerPackages}
        fromDate={fromDate}
        rentalDays={rentalDays}
        daysCountLabel={(count) =>
          t("reservation.stepOne.daysCount", { count })
        }
        offerTextPrefix={t("reservation.stepOne.offerTextPrefix")}
        offersTitle={t("reservation.stepOne.offersTitle")}
      />
    </div>
  );
};

export default StepOne;
