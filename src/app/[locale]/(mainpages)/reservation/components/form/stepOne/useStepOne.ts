import { useEffect, useMemo, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useLocationStore } from "@/lib/stores/useLocationStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useRentalDays } from "@/hooks/useCalculateRentalDays";
import { getBestOffer } from "@/app/[locale]/(mainpages)/reservation/components/form/stepOne/getBestOffer";
import {
  createDateTimeAvailabilityHelpers,
  getMinToDate,
} from "./stepOneDateTimeUtils";
import {
  getLocationDialogInitialTab,
  inferLocationType,
} from "./stepOneLocationUtils";

interface UseStepOneParams {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
}

export const useStepOne = ({
  watch,
  setValue,
}: UseStepOneParams) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const currentLocationLabel = t("currentLocation");

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
  const carDetails = useBookedCarDetailsStore((state) => state.carDetails);
  const filters = useUserPreferedFiltersStore((state) => state.filters);

  const { openDialog } = usePickupDialogStore();
  const setIsCurrentLocationTabDisabled = usePickupDialogStore(
    (state) => state.setIsCurrentLocationTabDisabled,
  );

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const minToDate = fromDate ? getMinToDate(fromDate) : null;

  const rentalDays = useRentalDays(fromDate, toDate);
  const bestOffer = getBestOffer(offerPackages ?? [], rentalDays);

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

  const { isDateTimeBlocked, isDateBlocked, normalizeDateTimeToAvailability } =
    useMemo(
      () => createDateTimeAvailabilityHelpers(workingHours),
      [workingHours],
    );

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

  const handleOpenReturnLocationDialog = () => {
    const returnDialogInitialTab = getLocationDialogInitialTab(
      shouldDisableCurrentLocationTab,
      formData.returnType,
    );

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

      setBookedCarFormData({
        carReturnLocation: locationName,
        returnLat:
          updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLat ||
            updatedFormData.carReturnLocation === currentLocationLabel)
            ? userPhysical_Latitude
            : updatedFormData.returnLat || null,
        returnLong:
          updatedFormData.returnType === "MY_LOCATION" &&
          (!updatedFormData.returnLong ||
            updatedFormData.carReturnLocation === currentLocationLabel)
            ? userPhysical_Longitude
            : updatedFormData.returnLong || null,
        carReturnLocationId: updatedFormData.carReturnLocationId || null,
        returnTrainId: updatedFormData.returnTrainId || null,
        returnAirportId: updatedFormData.returnAirportId || null,
        returnType: updatedFormData.returnType,
      });
    });
    setIsCurrentLocationTabDisabled(shouldDisableCurrentLocationTab);
  };

  const handleOpenPickupLocationDialog = () => {
    const pickupDialogInitialTab = getLocationDialogInitialTab(
      shouldDisableCurrentLocationTab,
      formData.pickupType,
    );

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

      setBookedCarFormData({
        pickupName: locationName,
        pickupLat: pickupLatValue,
        pickupLong: pickupLongValue,
        pickupId: updatedFormData.pickupId || null,
        pickupTrainId: updatedFormData.pickupTrainId || null,
        pickupAirportId: updatedFormData.pickupAirportId || null,
        pickupType: updatedFormData.pickupType,
      });

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

  return {
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
    handleOpenPickupLocationDialog,
    handleOpenReturnLocationDialog,
  };
};
