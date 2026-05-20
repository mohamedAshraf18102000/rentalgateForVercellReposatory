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
import {
  BOOKING_TIME_SLOT_INTERVAL_MINUTES,
  isBeforeMinimumBookableTime,
} from "@/lib/utils/minimumBookableDateTime";
import { WorkingHours } from "@/types/companyCars/carDetails";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

interface StepOneProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

const DAY_CONFIG = [
  { key: "sun", dayOfWeek: "SUNDAY" },
  { key: "mon", dayOfWeek: "MONDAY" },
  { key: "tue", dayOfWeek: "TUESDAY" },
  { key: "wed", dayOfWeek: "WEDNESDAY" },
  { key: "thu", dayOfWeek: "THURSDAY" },
  { key: "fri", dayOfWeek: "FRIDAY" },
  { key: "sat", dayOfWeek: "SATURDAY" },
] as const;

const TIME_SLOT_INTERVAL_MINUTES = BOOKING_TIME_SLOT_INTERVAL_MINUTES;

const parseTimeToMinutes = (time?: string | null) => {
  if (!time) return null;

  const [hourString, minuteString] = time.split(":");
  const hours = Number.parseInt(hourString ?? "", 10);
  const minutes = Number.parseInt(minuteString ?? "", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const isMinutesWithinRange = (value: number, start: number, end: number) => {
  if (start <= end) {
    return value >= start && value <= end;
  }

  return value >= start || value <= end;
};

const inferLocationType = ({
  explicitType,
  airportId,
  trainId,
  branchId,
  lat,
  long,
}: {
  explicitType:
    | "BRANCH"
    | "MY_LOCATION"
    | "TRAIN_STATION"
    | "AIRPORT"
    | null
    | undefined;
  airportId?: number | null;
  trainId?: number | null;
  branchId?: string | null;
  lat?: number | null;
  long?: number | null;
}) => {
  if (explicitType) return explicitType;
  if (airportId != null) return "AIRPORT" as const;
  if (trainId != null) return "TRAIN_STATION" as const;
  if (branchId) return "BRANCH" as const;
  if (lat != null && long != null) return "MY_LOCATION" as const;
  return null;
};

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
  const workingHours = useBookedCarDetailsStore((state) => state.workingHours);
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
  const filters = useUserPreferedFiltersStore((state) => state.filters);
  const isDeliveryServiceAvailable = Boolean(
    carDetails?.deliveryServiceAvailable,
  );
  const shouldDisableCurrentLocationTab = !isDeliveryServiceAvailable;
  const pickupDisplayValue =
    formData.pickupType === "BRANCH" && watch("pickupName")
      ? t("reservation.stepOne.pickupFromBranch")
      : watch("pickupName");
  const returnDisplayValue =
    formData.returnType === "BRANCH" && watch("carReturnLocation")
      ? t("reservation.stepOne.dropoffAtBranch")
      : watch("carReturnLocation");

  useEffect(() => {
    if (!shouldDisableCurrentLocationTab || !carDetails) return;

    // Session filters (bookings search / drawer) already selected airport, train, or map —
    // do not replace with branch pickup/return (delivery unavailable branch fallback).
    if (
      filters.pickupType === "airport" ||
      filters.pickupType === "trainStation" ||
      filters.pickupType === "currentLocation"
    ) {
      return;
    }

    const branchId = String(carDetails.branchId);
    const branchName = carDetails.branchName;
    const branchLat = carDetails.latitude;
    const branchLng = carDetails.longitude;

    if (formData.pickupType !== "BRANCH") {
      setValue("pickupName", branchName, { shouldValidate: true });
      setValue("pickupId", branchId);
      setValue("pickupLat", branchLat);
      setValue("pickupLong", branchLng);
      setValue("pickupAirportId", null);
      setValue("pickupTrainId", null);
    }

    if (formData.returnType !== "BRANCH") {
      setValue("carReturnLocation", branchName, { shouldValidate: true });
      setValue("carReturnLocationId", branchId);
      setValue("returnLat", branchLat);
      setValue("returnLong", branchLng);
      setValue("returnAirportId", null);
      setValue("returnTrainId", null);
    }

    setBookedCarFormData({
      pickupName: branchName,
      pickupType: "BRANCH",
      pickupId: branchId,
      pickupLat: branchLat,
      pickupLong: branchLng,
      pickupAirportId: null,
      pickupTrainId: null,
      carReturnLocation: branchName,
      returnType: "BRANCH",
      carReturnLocationId: branchId,
      returnLat: branchLat,
      returnLong: branchLng,
      returnAirportId: null,
      returnTrainId: null,
    });
  }, [
    shouldDisableCurrentLocationTab,
    carDetails,
    formData.pickupType,
    formData.returnType,
    filters.pickupType,
    setBookedCarFormData,
    setValue,
  ]);

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
      const {
        userPhysical_Latitude,
        userPhysical_Longitude,
        userPhysical_Address,
      } = useLocationStore.getState();

      const locationName =
        updatedFormData.returnType === "MY_LOCATION" &&
        (!updatedFormData.carReturnLocation ||
          updatedFormData.carReturnLocation === currentLocationLabel) &&
        userPhysical_Address
          ? userPhysical_Address
          : updatedFormData.carReturnLocation || currentLocationLabel;

      setValue("carReturnLocation", locationName, { shouldValidate: true });
      setValue(
        "returnLat",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLat ||
            updatedFormData.carReturnLocation === currentLocationLabel)
          ? userPhysical_Latitude
          : updatedFormData.returnLat || null,
      );
      setValue(
        "returnLong",
        updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLong ||
            updatedFormData.carReturnLocation === currentLocationLabel)
          ? userPhysical_Longitude
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

  const isDateTimeBlocked = (
    date: Date | null | undefined,
    minBoundary?: Date | null,
  ) => {
    if (!date || Number.isNaN(date.getTime())) {
      return false;
    }

    if (isBeforeMinimumBookableTime(date)) {
      return true;
    }

    if (minBoundary && date < minBoundary) {
      return true;
    }

    if (!workingHours) {
      return false;
    }

    const dayConfig = DAY_CONFIG[date.getDay()];
    const openTime = workingHours[
      `${dayConfig.key}OpenTime` as keyof WorkingHours
    ] as string | null | undefined;
    const closeTime = workingHours[
      `${dayConfig.key}CloseTime` as keyof WorkingHours
    ] as string | null | undefined;

    const openMinutes = parseTimeToMinutes(openTime);
    const closeMinutes = parseTimeToMinutes(closeTime);

    if (openMinutes === null || closeMinutes === null) {
      return true;
    }

    const currentMinutes = date.getHours() * 60 + date.getMinutes();
    if (!isMinutesWithinRange(currentMinutes, openMinutes, closeMinutes)) {
      return true;
    }

    return (
      workingHours.breaks?.some((breakTime) => {
        if (breakTime.dayOfWeek !== dayConfig.dayOfWeek) {
          return false;
        }

        const breakStart = parseTimeToMinutes(breakTime.startTime);
        const breakEnd = parseTimeToMinutes(breakTime.endTime);

        if (breakStart === null || breakEnd === null) {
          return false;
        }

        return isMinutesWithinRange(currentMinutes, breakStart, breakEnd);
      }) ?? false
    );
  };

  const findFirstAvailableDateTime = (
    date: Date | null | undefined,
    minBoundary?: Date | null,
  ) => {
    if (!date || Number.isNaN(date.getTime())) {
      return null;
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL_MINUTES) {
        const candidate = new Date(dayStart);
        candidate.setHours(hour, minute, 0, 0);

        if (!isDateTimeBlocked(candidate, minBoundary)) {
          return candidate;
        }
      }
    }

    return null;
  };

  const isDateBlocked = (date: Date, minBoundary?: Date | null) =>
    findFirstAvailableDateTime(date, minBoundary) === null;

  const normalizeDateTimeToAvailability = (
    date: Date | null,
    minBoundary?: Date | null,
  ) => {
    if (!date) {
      return null;
    }

    if (!isDateTimeBlocked(date, minBoundary)) {
      return date;
    }

    return findFirstAvailableDateTime(date, minBoundary);
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
      const {
        userPhysical_Latitude,
        userPhysical_Longitude,
        userPhysical_Address,
      } = useLocationStore.getState();

      const locationName =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupName ||
          updatedFormData.pickupName === currentLocationLabel) &&
        userPhysical_Address
          ? userPhysical_Address
          : updatedFormData.pickupName || "";
      const pickupLatValue =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupLat ||
          updatedFormData.pickupName === currentLocationLabel)
          ? userPhysical_Latitude
          : updatedFormData.pickupLat || null;
      const pickupLongValue =
        updatedFormData.pickupType === "MY_LOCATION" &&
        (!updatedFormData.pickupLong ||
          updatedFormData.pickupName === currentLocationLabel)
          ? userPhysical_Longitude
          : updatedFormData.pickupLong || null;

      setValue("pickupName", locationName, { shouldValidate: true });
      setValue("pickupLat", pickupLatValue);
      setValue("pickupLong", pickupLongValue);
      setValue("pickupId", updatedFormData.pickupId || null);
      setValue("pickupTrainId", updatedFormData.pickupTrainId || null);
      setValue("pickupAirportId", updatedFormData.pickupAirportId || null);

      if (!isDropoffManuallyChanged) {
        const syncedReturnType = inferLocationType({
          explicitType: updatedFormData.pickupType,
          airportId: updatedFormData.pickupAirportId,
          trainId: updatedFormData.pickupTrainId,
          branchId: updatedFormData.pickupId,
          lat: pickupLatValue,
          long: pickupLongValue,
        });

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
          returnType: syncedReturnType,
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
                required
                {...field}
                value={pickupDisplayValue || ""}
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
                required
                value={returnDisplayValue || ""}
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
                required
                labelClassName="text-base!"
                placeholder={t("reservation.stepOne.pickupDatePlaceholder")}
                {...field}
                label={t("reservation.stepOne.rentalPeriodLabel")}
                labelIcon={<CarRentIcon />}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                isDateDisabled={(date) => isDateBlocked(date)}
                isTimeDisabled={(date) => isDateTimeBlocked(date)}
                value={field.value}
                onChange={(date: Date | null) => {
                  const nextDate = normalizeDateTimeToAvailability(date);
                  if (date && !nextDate) {
                    return;
                  }

                  field.onChange(nextDate);
                  if (isDateLessThanMinimumRental(nextDate, watch("toDate"))) {
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
                required
                placeholder={t("reservation.stepOne.dropoffDatePlaceholder")}
                {...field}
                className="w-full"
                inputClassName="text-base!"
                withTime
                allowClear
                minDate={minToDate ?? undefined}
                isDateDisabled={(date) => isDateBlocked(date, minToDate)}
                isTimeDisabled={(date) => isDateTimeBlocked(date, minToDate)}
                value={field.value}
                onChange={(date: Date | null) => {
                  if (!date) {
                    field.onChange(null);
                    return;
                  }

                  const nextDate = normalizeDateTimeToAvailability(
                    date,
                    minToDate,
                  );
                  if (!nextDate) {
                    return;
                  }

                  if (isDateLessThanMinimumRental(fromDate, nextDate)) {
                    field.onChange(minToDate ?? nextDate);
                    return;
                  }

                  field.onChange(nextDate);
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
