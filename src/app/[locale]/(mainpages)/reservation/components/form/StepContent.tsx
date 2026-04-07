"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  useBookedCarDetailsStore,
  ReservationFormData,
} from "@/lib/stores/useBookedCarDetailsStore";
import { usePickupDialogStore } from "@/lib/stores/usePickupDialogStore";
import { useEffect, forwardRef, useImperativeHandle } from "react";

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
import { completeUserProfile } from "@/services/userProfile/completeUserProfile.service";

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
        pickupName: "",
        carReturnLocation: "",
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
        pickupLat: null,
        pickupLong: null,
        pickupId: filters.pickupId || null,
        returnLat: null,
        returnLong: null,
        carReturnLocationId: filters.carReturnLocationId || null,
        pickupTrainId: filters.pickupTrainId || null,
        pickupAirportId: filters.pickupAirportId || null,
        returnTrainId: filters.carReturnTrainId || null,
        returnAirportId: filters.carReturnAirportId || null,
      },
    });

    // Sync store -> form on hydration or store changes
    useEffect(() => {
      // (Removed automatic sync of pickup/return names to keep them empty at start)

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
      // (Automatic coordinate sync removed to keep locations empty at start)

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

      // Sync train/airport IDs
      if (
        (filters.pickupTrainId || null) !== (getValues("pickupTrainId") || null)
      ) {
        setValue("pickupTrainId", filters.pickupTrainId || null);
      }
      if (
        (filters.pickupAirportId || null) !==
        (getValues("pickupAirportId") || null)
      ) {
        setValue("pickupAirportId", filters.pickupAirportId || null);
      }
      if (
        (filters.carReturnTrainId || null) !==
        (getValues("returnTrainId") || null)
      ) {
        setValue("returnTrainId", filters.carReturnTrainId || null);
      }
      if (
        (filters.carReturnAirportId || null) !==
        (getValues("returnAirportId") || null)
      ) {
        setValue("returnAirportId", filters.carReturnAirportId || null);
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
            const updatedData = await completeUserProfile({
              licenseExpirationDate: values.licenceExpiryDate
                ? (values.licenceExpiryDate as Date).toISOString().split("T")[0]
                : "",
              licenseImage: values.licenseImage,
              nationality: values.nationality,
              residenceType: Number(residenceType),
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
      // (Automatic address sync removed to keep locations empty until user selects them)
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
          update.carReturnLocationId = value.carReturnLocationId as
            | string
            | null;

        if (value.pickupTrainId !== undefined)
          update.pickupTrainId = value.pickupTrainId as number | null;
        if (value.pickupAirportId !== undefined)
          update.pickupAirportId = value.pickupAirportId as number | null;
        if (value.returnTrainId !== undefined)
          update.returnTrainId = value.returnTrainId as number | null;
        if (value.returnAirportId !== undefined)
          update.returnAirportId = value.returnAirportId as number | null;

        update.pickupType = mapLocationType(filters.pickupType);
        update.returnType = mapLocationType(
          filters.carReturnLocationType || filters.pickupType,
        );

        setFormData(update);

        if (value.fromDate) {
          const iso = (value.fromDate as Date).toISOString();
          if (filters.fromDate !== iso) {
            setFilter("fromDate", iso);
          }
        }
        if (value.toDate) {
          const iso = (value.toDate as Date).toISOString();
          if (filters.toDate !== iso) {
            setFilter("toDate", iso);
          }
        }
        if (value.pickupName && value.pickupName !== "الموقع الحالي") {
          if (filters.pickupName !== value.pickupName) {
            setFilter("pickupName", value.pickupName);
          }
        }
        if (
          value.carReturnLocation &&
          value.carReturnLocation !== "الموقع الحالي"
        ) {
          if (filters.carReturnLocation !== value.carReturnLocation) {
            setFilter("carReturnLocation", value.carReturnLocation);
          }
        }
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
