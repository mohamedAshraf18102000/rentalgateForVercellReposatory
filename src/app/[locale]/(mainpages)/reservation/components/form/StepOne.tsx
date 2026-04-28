"use client";

import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { ArrowLeft, ArrowRight, MapPinPlus } from "lucide-react";

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
import { useRentalDays } from "@/hooks/useCalculateRentalDays";
import { getBestOffer } from "@/lib/utils/getBestOffer";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const StepOne = ({ control, errors, watch, setValue }: StepOneProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLocationLabel = t("currentLocation");
  const MIN_RENTAL_HOURS = 2;
  const MIN_RENTAL_MS = MIN_RENTAL_HOURS * 60 * 60 * 1000;
  const [isDropoffManuallyChanged, setIsDropoffManuallyChanged] =
    useState(false);
  const formData = useBookedCarDetailsStore((state) => state.formData);
  const setBookedCarFormData = useBookedCarDetailsStore(
    (state) => state.setFormData,
  );
  const offerPackages = useBookedCarDetailsStore(
    (state) => state.carDetails?.offerPackages,
  );
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const minToDate = fromDate
    ? new Date(fromDate.getTime() + MIN_RENTAL_MS)
    : null;
  const rentalDays = useRentalDays(fromDate, toDate);
  const bestOffer = getBestOffer(offerPackages ?? [], rentalDays);
  const matchedOfferAtSameDays =
    offerPackages
      ?.filter((offer) => rentalDays === offer.days)
      .sort((a, b) => b.days - a.days)[0] ?? null;
  const offerForRecommendation = bestOffer ?? matchedOfferAtSameDays;
  const { openDialog } = usePickupDialogStore();
  const setIsCurrentLocationTabDisabled = usePickupDialogStore(
    (state) => state.setIsCurrentLocationTabDisabled,
  );
  const carDetails = useBookedCarDetailsStore((state) => state.carDetails);
  const isDeliveryServiceAvailable = Boolean(
    carDetails?.deliveryServiceAvailable,
  );
  const shouldDisableCurrentLocationTab = !isDeliveryServiceAvailable;

  const recommendedOfferEndDate =
    fromDate && offerForRecommendation
      ? new Date(
          fromDate.getTime() +
            (offerForRecommendation.days + offerForRecommendation.extraDays) *
              24 *
              60 *
              60 *
              1000,
        )
      : null;
  const warnToTakeOfferDate = recommendedOfferEndDate
    ? `${recommendedOfferEndDate
        .toLocaleDateString(locale === "ar" ? "ar-GB" : "en-GB")
        .replace(/\//g, "-")} ${recommendedOfferEndDate.toLocaleTimeString(
        locale === "ar" ? "ar-GB" : "en-GB",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        },
      )}`
    : "";

  const handleOpenReturnLocationDialog = () => {
    const returnDialogInitialTab =
      shouldDisableCurrentLocationTab && formData.returnType === "AIRPORT"
        ? "airport"
        : shouldDisableCurrentLocationTab &&
            formData.returnType === "TRAIN_STATION"
          ? "trainStation"
          : shouldDisableCurrentLocationTab
            ? "branches"
            : "currentLocation";

    openDialog(returnDialogInitialTab, "return", () => {
      setIsDropoffManuallyChanged(true);
      const { formData: updatedFormData } = useBookedCarDetailsStore.getState();
      const { latitude, longitude, address } = useLocationStore.getState();

      const locationName =
        updatedFormData.returnType === "MY_LOCATION" &&
        (!updatedFormData.carReturnLocation ||
          updatedFormData.carReturnLocation === currentLocationLabel) &&
        address
          ? address
          : updatedFormData.carReturnLocation || currentLocationLabel;

      setValue("carReturnLocation", locationName, { shouldValidate: true });
      setValue(
        "returnLat",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLat ||
            updatedFormData.carReturnLocation === currentLocationLabel)
          ? latitude
          : updatedFormData.returnLat || null,
      );
      setValue(
        "returnLong",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLong ||
            updatedFormData.carReturnLocation === currentLocationLabel)
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
    setIsCurrentLocationTabDisabled(shouldDisableCurrentLocationTab);
  };

  const isDateLessThanMinimumRental = (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined,
  ) => {
    const formattedStartDate = formatLocalDateTime(startDate);
    const formattedEndDate = formatLocalDateTime(endDate);

    if (!formattedStartDate || !formattedEndDate) return false;

    const normalizedStartDate = new Date(formattedStartDate);
    const normalizedEndDate = new Date(formattedEndDate);

    if (
      Number.isNaN(normalizedStartDate.getTime()) ||
      Number.isNaN(normalizedEndDate.getTime())
    ) {
      return false;
    }

    return (
      normalizedEndDate.getTime() - normalizedStartDate.getTime() <
      MIN_RENTAL_MS
    );
  };

  const handleOpenPickupLocationDialog = () => {
    const pickupDialogInitialTab =
      shouldDisableCurrentLocationTab && formData.pickupType === "AIRPORT"
        ? "airport"
        : shouldDisableCurrentLocationTab &&
            formData.pickupType === "TRAIN_STATION"
          ? "trainStation"
          : shouldDisableCurrentLocationTab
            ? "branches"
            : "currentLocation";

    openDialog(pickupDialogInitialTab, "pickup", () => {
      const { formData: updatedFormData } = useBookedCarDetailsStore.getState();
      const { latitude, longitude, address } = useLocationStore.getState();

      const locationName =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupName ||
          updatedFormData.pickupName === currentLocationLabel) &&
        address
          ? address
          : updatedFormData.pickupName || "";
      const pickupLatValue =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupLat ||
          updatedFormData.pickupName === currentLocationLabel)
          ? latitude
          : updatedFormData.pickupLat || null;
      const pickupLongValue =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupLong ||
          updatedFormData.pickupName === currentLocationLabel)
          ? longitude
          : updatedFormData.pickupLong || null;

      setValue("pickupName", locationName, { shouldValidate: true });
      setValue("pickupLat", pickupLatValue);
      setValue("pickupLong", pickupLongValue);
      setValue("pickupId", updatedFormData.pickupId || null);
      setValue("pickupTrainId", updatedFormData.pickupTrainId || null);
      setValue("pickupAirportId", updatedFormData.pickupAirportId || null);

      if (!isDropoffManuallyChanged) {
        setValue("carReturnLocation", locationName, { shouldValidate: true });
        setValue("returnLat", pickupLatValue);
        setValue("returnLong", pickupLongValue);
        setValue("carReturnLocationId", updatedFormData.pickupId || null);
        setValue("returnTrainId", updatedFormData.pickupTrainId || null);
        setValue("returnAirportId", updatedFormData.pickupAirportId || null);

        // Keep store data aligned with form values for payload creation.
        setBookedCarFormData({
          carReturnLocation: locationName,
          returnLat: pickupLatValue,
          returnLong: pickupLongValue,
          carReturnLocationId: updatedFormData.pickupId || null,
          returnTrainId: updatedFormData.pickupTrainId || null,
          returnAirportId: updatedFormData.pickupAirportId || null,
          returnType: updatedFormData.pickupType || null,
        });
      }
    });
    setIsCurrentLocationTabDisabled(shouldDisableCurrentLocationTab);
  };

  return (
    <div className="">
      <div className="flex w-full flex-col items-start gap-3 lg:flex-row lg:items-center">
        <div className="w-full relative">
          <Controller
            name="pickupName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={t("reservation.stepOne.pickupLocationLabel")}
                placeholder={t("reservation.stepOne.pickupLocationPlaceholder")}
                className="text-base! cursor-pointer"
                labelIcon={<CarRentIcon />}
                labelClassName="text-base!"
                readOnly
                onClick={handleOpenPickupLocationDialog}
                errorMessage={errors.pickupName?.message}
              />
            )}
          />
        </div>
        <ArrowIcon className="hidden h-12 w-12 shrink-0 pt-5 lg:block" />
        <div className="w-full relative">
          <button
            type="button"
            onClick={handleOpenReturnLocationDialog}
            className={`absolute top-0 flex items-center gap-1 text-xs underline sm:gap-2 sm:text-sm ${
              isRTL ? "left-2" : "right-2"
            }`}
          >
            <MapPinPlus />
            {t("reservation.stepOne.dropoffDifferentLocation")}
          </button>
          <Controller
            name="carReturnLocation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={t("reservation.stepOne.dropoffLocationLabel")}
                placeholder={t(
                  "reservation.stepOne.dropoffLocationPlaceholder",
                )}
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
        {formData.pickupType === "AIRPORT" ||
        formData.pickupType === "TRAIN_STATION" ||
        formData.pickupType === "MY_LOCATION" ? (
          <WarningMessage
            className="mt-0!"
            message={t("reservation.stepOne.pickupWarning")}
          />
        ) : (
          <span></span>
        )}
        {formData.returnType === "AIRPORT" ||
        formData.returnType === "TRAIN_STATION" ||
        formData.returnType === "MY_LOCATION" ? (
          <WarningMessage
            className="mt-0!"
            message={t("reservation.stepOne.dropoffWarning")}
          />
        ) : (
          <span></span>
        )}
      </div>

      <Separator className="mt-3 my-4" />

      <div className="mb-1 flex w-full flex-col items-start gap-3 lg:flex-row lg:items-end">
        <div className="w-full">
          <Controller
            name="fromDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                placeholder={t("reservation.stepOne.pickupDatePlaceholder")}
                {...field}
                label={t("reservation.stepOne.rentalPeriodLabel")}
                labelIcon={<CarRentIcon />}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                value={field.value}
                onChange={(date: Date | null) => {
                  field.onChange(date);
                  if (isDateLessThanMinimumRental(date, watch("toDate"))) {
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
        <ArrowIcon className="hidden h-12 w-12 shrink-0 pt-5 lg:block" />
        <div className="w-full">
          <Controller
            name="toDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                placeholder={t("reservation.stepOne.dropoffDatePlaceholder")}
                {...field}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                minDate={minToDate ?? undefined}
                value={field.value}
                onChange={(date: Date | null) => {
                  if (!date) {
                    field.onChange(null);
                    return;
                  }

                  if (isDateLessThanMinimumRental(fromDate, date)) {
                    field.onChange(minToDate ?? date);
                    return;
                  }

                  field.onChange(date);
                }}
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
      {bestOffer && (
        <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen mt-5">
          <div className="scale-130">
            <ExeclusiveOfferIcon />
          </div>

          <p className="flex gap-1 items-center">
            <span className="text-sm font-extrabold">
              {t("reservation.stepOne.daysCount", {
                count: bestOffer.extraDays,
              })}
            </span>
            <span>{t("reservation.stepOne.offerTextPrefix")}</span>
            <span className="text-sm font-extrabold">
              {t("reservation.stepOne.daysCount", { count: bestOffer.days })}
            </span>
          </p>
        </div>
      )}
      {offerPackages && offerPackages.length > 0 && (
        <>
          <Separator className="my-2" />
          <div className="mb-6">
            <p className="text-base">{t("reservation.stepOne.offersTitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerPackages.map((offer) => (
              <OffersCard
                key={offer.ccoId}
                offerPackage={offer}
                warningAvailable={warnToTakeOfferDate !== ""}
                warnToTakeOfferDate={warnToTakeOfferDate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StepOne;
