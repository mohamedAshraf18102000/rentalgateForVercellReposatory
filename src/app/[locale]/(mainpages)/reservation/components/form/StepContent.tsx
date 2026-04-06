"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  useBookedCarDetailsStore,
  ReservationFormData,
} from "@/lib/stores/useBookedCarDetailsStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import { updateUserProfile } from "@/services/userProfile/updateUserProfile.service";

import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reservationSchema,
  ReservationFormValues,
} from "@/lib/validations/reservationSchema";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { useClientStore } from "@/lib/api/stores";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";

const mapLocationType = (
  type?: string,
): "BRANCH" | "MY_LOCATION" | "TRAIN_STATION" | "AIRPORT" => {
  switch (type) {
    case "currentLocation":
      return "MY_LOCATION";
    case "airport":
      return "AIRPORT";
    case "trainStation":
      return "TRAIN_STATION";
    case "branches":
      return "BRANCH";
    default:
      return "BRANCH";
  }
};

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
    const { latitude, longitude, address } = useLocationStore();
    const { carDetails, formData, setFormData, _hasHydrated } =
      useBookedCarDetailsStore();
    const { target, open } = usePickupDialogStore();

    const { setClientData } = useClientStore();

    const {
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
      trigger,
    } = useForm<ReservationFormValues>({
      resolver: zodResolver(reservationSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        pickupName: filters.pickupName || "",
        carReturnLocation:
          filters.carReturnLocation || filters.pickupName || "",
        fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
        toDate: filters.toDate ? new Date(filters.toDate) : undefined,
        // Step 2 – hydrate from reservation form store
        idNumber: formData.idNumber || "0",
        nationality: formData.nationality || "",
        licenseImage: formData.licenseImage || "",
        licenceExpiryDate: formData.licenceExpiryDate ?? undefined,
        personalId: formData.personalId || "",
        passportNumber: formData.passportNumber || "",
        borderNumber: formData.borderNumber || "",
        services: formData.services || [],
        driver: formData.driver || null,
        extraKmType: formData.extraKmType || "QUOTA",
        pickupLat:
          filters.pickupType === "currentLocation" &&
          (!filters.pickupLat || filters.pickupName === "الموقع الحالي")
            ? latitude
            : filters.pickupLat || (carDetails?.latitude ?? undefined),
        pickupLong:
          filters.pickupType === "currentLocation" &&
          (!filters.pickupLng || filters.pickupName === "الموقع الحالي")
            ? longitude
            : filters.pickupLng || (carDetails?.longitude ?? undefined),
        pickupId: filters.pickupId || null,
        returnLat:
          filters.carReturnLocationType === "currentLocation" &&
          (!filters.carReturnLocationLat ||
            filters.carReturnLocation === "الموقع الحالي")
            ? latitude
            : (filters.carReturnLocationLat ?? undefined),
        returnLong:
          filters.carReturnLocationType === "currentLocation" &&
          (!filters.carReturnLocationLng ||
            filters.carReturnLocation === "الموقع الحالي")
            ? longitude
            : (filters.carReturnLocationLng ?? undefined),
        carReturnLocationId: filters.carReturnLocationId || null,
      },
    });

    // Sync store -> form on hydration or store changes
    useEffect(() => {
      if (
        filters.pickupName &&
        filters.pickupName !== getValues("pickupName")
      ) {
        setValue("pickupName", filters.pickupName);
      }
      if (filters.carReturnLocation) {
        if (filters.carReturnLocation !== getValues("carReturnLocation")) {
          setValue("carReturnLocation", filters.carReturnLocation);
        }
      } else if (
        filters.pickupName &&
        filters.pickupName !== getValues("carReturnLocation")
      ) {
        // Fallback to pickup name if return location is empty
        setValue("carReturnLocation", filters.pickupName);
      }

      if (filters.fromDate) {
        const storeDate = new Date(filters.fromDate);
        const formDate = getValues("fromDate");
        if (!formDate || storeDate.getTime() !== formDate.getTime()) {
          setValue("fromDate", storeDate);
        }
      }
      if (filters.toDate) {
        const storeDate = new Date(filters.toDate);
        const formDate = getValues("toDate");
        if (!formDate || storeDate.getTime() !== formDate.getTime()) {
          setValue("toDate", storeDate);
        }
      }

      // Sync Lat/Lng
      const targetPickupLat =
        filters.pickupType === "currentLocation" &&
        (!filters.pickupLat || filters.pickupName === "الموقع الحالي")
          ? latitude
          : filters.pickupLat || (carDetails?.latitude ?? undefined);
      if (
        targetPickupLat !== undefined &&
        targetPickupLat !== getValues("pickupLat")
      ) {
        setValue("pickupLat", targetPickupLat);
      }

      const targetPickupLong =
        filters.pickupType === "currentLocation" &&
        (!filters.pickupLng || filters.pickupName === "الموقع الحالي")
          ? longitude
          : filters.pickupLng || (carDetails?.longitude ?? undefined);
      if (
        targetPickupLong !== undefined &&
        targetPickupLong !== getValues("pickupLong")
      ) {
        setValue("pickupLong", targetPickupLong);
      }

      const targetReturnLat =
        filters.carReturnLocationType === "currentLocation" &&
        (!filters.carReturnLocationLat ||
          filters.carReturnLocation === "الموقع الحالي")
          ? latitude
          : (filters.carReturnLocationLat ?? undefined);
      if (
        targetReturnLat !== undefined &&
        targetReturnLat !== getValues("returnLat")
      ) {
        setValue("returnLat", targetReturnLat);
      } else if (
        targetPickupLat !== undefined &&
        targetPickupLat !== getValues("returnLat") &&
        !filters.carReturnLocationLat
      ) {
        setValue("returnLat", targetPickupLat);
      }

      const targetReturnLong =
        filters.carReturnLocationType === "currentLocation" &&
        (!filters.carReturnLocationLng ||
          filters.carReturnLocation === "الموقع الحالي")
          ? longitude
          : (filters.carReturnLocationLng ?? undefined);
      if (
        targetReturnLong !== undefined &&
        targetReturnLong !== getValues("returnLong")
      ) {
        setValue("returnLong", targetReturnLong);
        } else if (
          targetPickupLong !== undefined &&
          targetPickupLong !== getValues("returnLong") &&
          !filters.carReturnLocationLng
        ) {
          setValue("returnLong", targetPickupLong);
        }

        // Sync pickupId
        if (filters.pickupId && filters.pickupId !== getValues("pickupId")) {
          setValue("pickupId", filters.pickupId);
        }

        // Sync carReturnLocationId
        if (
          filters.carReturnLocationId &&
          filters.carReturnLocationId !== getValues("carReturnLocationId")
        ) {
          setValue("carReturnLocationId", filters.carReturnLocationId);
        }
      }, [filters, carDetails, latitude, longitude, setValue, getValues]);

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
          const isValid = await trigger(fieldsToValidate);
          if (isValid) {
            const values = getValues();
            if (values.fromDate && values.toDate && carDetails) {
              const diffTime = Math.abs(
                values.toDate.getTime() - values.fromDate.getTime(),
              );
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

              const effectivePricing = calculateRentalPrice({
                days: diffDays,
                dailyPrice: carDetails.dailyPrice,
                weeklyPrice: carDetails.weeklyPrice,
                halfMonthlyPrice: carDetails.halfMonthPrice,
                monthlyPrice: carDetails.monthlyPrice,
                yearlyPrice: carDetails.yearlyPrice,
                offerDailyPrice: carDetails.offerDailyPrice,
                offerWeeklyPrice: carDetails.offerWeeklyPrice,
                offerHalfMonthlyPrice: carDetails.offerHalfMonthPrice,
                offerMonthlyPrice: carDetails.offerMonthlyPrice,
                offerYearlyPrice: carDetails.offerYearlyPrice,
              });

              const originalPricing = calculateRentalPrice({
                days: diffDays,
                dailyPrice: carDetails.dailyPrice,
                weeklyPrice: carDetails.weeklyPrice,
                halfMonthlyPrice: carDetails.halfMonthPrice,
                monthlyPrice: carDetails.monthlyPrice,
                yearlyPrice: carDetails.yearlyPrice,
                offerDailyPrice: 0,
                offerWeeklyPrice: 0,
                offerHalfMonthlyPrice: 0,
                offerMonthlyPrice: 0,
                offerYearlyPrice: 0,
              });

              setFormData({
                price: effectivePricing.totalPrice,
                originalPrice: originalPricing.totalPrice,
              });
            }
          }
          return isValid;
        } else if (displayStep === 2) {
          fieldsToValidate = [
            "idNumber",
            "nationality",
            "licenseImage",
            "licenceExpiryDate",
            "personalId",
            "passportNumber",
            "borderNumber",
          ];
          const isValid = await trigger(fieldsToValidate);
          if (!isValid) return false;

          const values = getValues();
          const residenceType = values.idNumber;

          try {
            const updatedData = await updateUserProfile({
              licenseExpirationDate: values.licenceExpiryDate
                ? (values.licenceExpiryDate as Date).toISOString().split("T")[0]
                : "",
              licenseImage: values.licenseImage,
              nationality: values.nationality,
              residenceType: Number(residenceType),
              // Visitor (2) must have null personalId and borderNumber
              personalId:
                residenceType === "2" ? null : values.personalId || null,
              passportNumber:
                residenceType === "2" || residenceType === "3"
                  ? values.passportNumber || null
                  : null,
              borderNumber:
                residenceType === "3" ? values.borderNumber || null : null,
            });
            // Update the global client store with returned profile data
            setClientData(updatedData);
            return true;
          } catch (err) {
            console.error("Update profile failed", err);
            return false;
          }
        }
        return await trigger(fieldsToValidate);
      },
      getValues: () => getValues(),
    }));

    // Sync address -> store & form if filter is still placeholder
    useEffect(() => {
      if (address && address !== "الموقع الحالي") {
        if (!open || target !== "return") {
          if (filters.pickupName === "الموقع الحالي" || !filters.pickupName) {
            setValue("pickupName", address);
            setValue("pickupLat", latitude);
            setValue("pickupLong", longitude);
            setFilter("pickupName", address);
          }
        }
        if (!open || target !== "pickup") {
          if (
            filters.carReturnLocation === "الموقع الحالي" ||
            !filters.carReturnLocation ||
            filters.carReturnLocation === ""
          ) {
            setValue("carReturnLocation", address);
            setValue("returnLat", latitude);
            setValue("returnLong", longitude);
            setFilter("carReturnLocation", address);
          }
        }
      }
    }, [
      address,
      latitude,
      longitude,
      filters.pickupName,
      filters.carReturnLocation,
      setValue,
      setFilter,
      open,
      target,
    ]);

    // Keep filters store in sync with form (locations & dates only)
    useEffect(() => {
      if (!_hasHydrated) return;
      // Initial sync of form values to the data store
      const initialValues = getValues();
      setFormData({
        pickupName: initialValues.pickupName,
        carReturnLocation: initialValues.carReturnLocation,
        fromDate: initialValues.fromDate,
        toDate: initialValues.toDate,
        idNumber: initialValues.idNumber,
        nationality: initialValues.nationality,
        licenseImage: initialValues.licenseImage as string,
        licenceExpiryDate: initialValues.licenceExpiryDate,
        personalId: initialValues.personalId,
        passportNumber: initialValues.passportNumber,
        borderNumber: initialValues.borderNumber,
        services: (initialValues.services || []) as number[],
        driver: initialValues.driver || null,
        extraKmType: initialValues.extraKmType || "QUOTA",
        pickupLat: initialValues.pickupLat as number | null,
        pickupLong: initialValues.pickupLong as number | null,
        returnLat: initialValues.returnLat as number | null,
        returnLong: initialValues.returnLong as number | null,
        pickupId: initialValues.pickupId || null,
        carReturnLocationId: initialValues.carReturnLocationId || null,
        pickupType: mapLocationType(filters.pickupType),
        returnType: mapLocationType(
          filters.carReturnLocationType || filters.pickupType,
        ),
      });

      const subscription = watch((value) => {
        const update: Partial<ReservationFormData> = {};

        if (value.pickupName !== undefined)
          update.pickupName = value.pickupName;
        if (value.carReturnLocation !== undefined)
          update.carReturnLocation = value.carReturnLocation;
        if (value.fromDate !== undefined) update.fromDate = value.fromDate;
        if (value.toDate !== undefined) update.toDate = value.toDate;
        if (value.idNumber !== undefined) update.idNumber = value.idNumber;
        if (value.nationality !== undefined)
          update.nationality = value.nationality;
        if (value.licenseImage !== undefined)
          update.licenseImage = value.licenseImage as string;
        if (value.licenceExpiryDate !== undefined)
          update.licenceExpiryDate = value.licenceExpiryDate;
        if (value.personalId !== undefined)
          update.personalId = value.personalId;
        if (value.passportNumber !== undefined)
          update.passportNumber = value.passportNumber;
        if (value.borderNumber !== undefined)
          update.borderNumber = value.borderNumber;
        if (value.services !== undefined)
          update.services = value.services as number[];
        if (value.driver !== undefined)
          update.driver = value.driver as ReservationFormData["driver"];
        if (value.extraKmType !== undefined)
          update.extraKmType = value.extraKmType as "UNLIMITED" | "QUOTA";

        if (value.pickupLat !== undefined)
          update.pickupLat = value.pickupLat as number | null;
        if (value.pickupLong !== undefined)
          update.pickupLong = value.pickupLong as number | null;
        if (value.returnLat !== undefined)
          update.returnLat = value.returnLat as number | null;
        if (value.returnLong !== undefined)
          update.returnLong = value.returnLong as number | null;

        if (value.pickupId !== undefined)
          update.pickupId = value.pickupId as string | null;
        if (value.carReturnLocationId !== undefined)
          update.carReturnLocationId =
            value.carReturnLocationId as string | null;

        update.pickupType = mapLocationType(filters.pickupType);
        update.returnType = mapLocationType(
          filters.carReturnLocationType || filters.pickupType,
        );

        setFormData(update);

        if (value.fromDate)
          setFilter(
            "fromDate",
            value.fromDate ? (value.fromDate as Date).toISOString() : "",
          );
        if (value.toDate)
          setFilter(
            "toDate",
            value.toDate ? (value.toDate as Date).toISOString() : "",
          );
        if (value.pickupName && value.pickupName !== "الموقع الحالي")
          setFilter("pickupName", value.pickupName);
        if (
          value.carReturnLocation &&
          value.carReturnLocation !== "الموقع الحالي"
        )
          setFilter("carReturnLocation", value.carReturnLocation);
      });
      return () => subscription.unsubscribe();
    }, [watch, setFilter, setFormData, latitude, longitude, _hasHydrated]);

    const stepData = [
      {
        step: 1,
        content: (
          <StepOne
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        ),
      },
      {
        step: 2,
        content: (
          <StepTwo
            control={control}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
          />
        ),
      },
      {
        step: 3,
        content: <StepThree control={control} errors={errors} />,
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
