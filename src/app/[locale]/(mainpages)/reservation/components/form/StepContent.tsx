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
import ForOtherStepTwo from "./ForOtherStepTwo";
import StepThree from "./StepThree";
import { useClientStore } from "@/lib/api/stores";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import { completeUserProfile } from "@/services/userProfile/completeUserProfile.service";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

interface StepContentProps {
  activeStep: number;
  isForOtherReservation?: boolean;
}

export interface StepContentRef {
  validateStep: () => Promise<boolean>;
  getValues: () => ReservationFormValues;
  resetForm: () => void;
}

const StepContent = forwardRef<StepContentRef, StepContentProps>(
  ({ activeStep, isForOtherReservation = false }, ref) => {
    const getRentalDays = (
      fromDate?: Date | string,
      toDate?: Date | string,
    ) => {
      const normalizedFromDate = formatLocalDateTime(fromDate);
      const normalizedToDate = formatLocalDateTime(toDate);

      if (!normalizedFromDate || !normalizedToDate) return 0;

      const from = new Date(normalizedFromDate);
      const to = new Date(normalizedToDate);

      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;

      const diffTime = to.getTime() - from.getTime();
      if (diffTime <= 0) return 0;

      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    };

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
      reset,
      formState: { errors },
      trigger,
    } = useForm<ReservationFormValues>({
      resolver: zodResolver(reservationSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        // Step 1 – hydrate locations from stores, fallback return to pickup
        pickupName:
          formData.pickupName && formData.pickupName !== "الموقع الحالي"
            ? formData.pickupName
            : filters.pickupName && filters.pickupName !== "الموقع الحالي"
              ? filters.pickupName
              : "",
        carReturnLocation:
          formData.carReturnLocation &&
          formData.carReturnLocation !== "الموقع الحالي"
            ? formData.carReturnLocation
            : filters.carReturnLocation &&
                filters.carReturnLocation !== "الموقع الحالي"
              ? filters.carReturnLocation
              : formData.pickupName && formData.pickupName !== "الموقع الحالي"
                ? formData.pickupName
                : filters.pickupName && filters.pickupName !== "الموقع الحالي"
                  ? filters.pickupName
                  : "",
        fromDate: formData.fromDate
          ? new Date(formData.fromDate)
          : filters.fromDate
            ? new Date(filters.fromDate)
            : undefined,
        toDate: formData.toDate
          ? new Date(formData.toDate)
          : filters.toDate
            ? new Date(filters.toDate)
            : undefined,
        pickupLat: formData.pickupLat ?? null,
        pickupLong: formData.pickupLong ?? null,
        pickupId: formData.pickupId || filters.pickupId || null,
        returnLat: formData.returnLat ?? null,
        returnLong: formData.returnLong ?? null,
        carReturnLocationId:
          formData.carReturnLocationId || filters.carReturnLocationId || null,
        pickupTrainId: formData.pickupTrainId || filters.pickupTrainId || null,
        pickupAirportId:
          formData.pickupAirportId || filters.pickupAirportId || null,
        returnTrainId:
          formData.returnTrainId || filters.carReturnTrainId || null,
        returnAirportId:
          formData.returnAirportId || filters.carReturnAirportId || null,
        // Step 2 – hydrate from reservation form store
        isForOtherReservation,
        idNumber: formData.idNumber || "0",
        nationality: formData.nationality || "",
        licenseImage: formData.licenseImage || "",
        licenceExpiryDate: formData.licenceExpiryDate
          ? new Date(formData.licenceExpiryDate)
          : undefined,
        personalId: formData.personalId || "",
        passportNumber: formData.passportNumber || "",
        borderNumber: formData.borderNumber || "",
        services: formData.services || [],
        driver: formData.driver || null,
        extraKmType: formData.extraKmType || "QUOTA",
        extraKmApplied: formData.extraKmApplied || false,
      },
    });

    // ✅ One-time reset after zustand finishes rehydrating from localStorage
    useEffect(() => {
      if (!_hasHydrated) return;
      reset(
        {
          // Step 1 – restore from stores, fallback return to pickup
          pickupName:
            formData.pickupName && formData.pickupName !== "الموقع الحالي"
              ? formData.pickupName
              : filters.pickupName && filters.pickupName !== "الموقع الحالي"
                ? filters.pickupName
                : "",
          carReturnLocation:
            formData.carReturnLocation &&
            formData.carReturnLocation !== "الموقع الحالي"
              ? formData.carReturnLocation
              : filters.carReturnLocation &&
                  filters.carReturnLocation !== "الموقع الحالي"
                ? filters.carReturnLocation
                : formData.pickupName && formData.pickupName !== "الموقع الحالي"
                  ? formData.pickupName
                  : filters.pickupName && filters.pickupName !== "الموقع الحالي"
                    ? filters.pickupName
                    : "",
          fromDate: formData.fromDate
            ? new Date(formData.fromDate)
            : filters.fromDate
              ? new Date(filters.fromDate)
              : undefined,
          toDate: formData.toDate
            ? new Date(formData.toDate)
            : filters.toDate
              ? new Date(filters.toDate)
              : undefined,
          pickupLat: formData.pickupLat ?? null,
          pickupLong: formData.pickupLong ?? null,
          pickupId: formData.pickupId || filters.pickupId || null,
          returnLat: formData.returnLat ?? null,
          returnLong: formData.returnLong ?? null,
          carReturnLocationId:
            formData.carReturnLocationId || filters.carReturnLocationId || null,
          pickupTrainId:
            formData.pickupTrainId || filters.pickupTrainId || null,
          pickupAirportId:
            formData.pickupAirportId || filters.pickupAirportId || null,
          returnTrainId:
            formData.returnTrainId || filters.carReturnTrainId || null,
          returnAirportId:
            formData.returnAirportId || filters.carReturnAirportId || null,
          // Step 2
          isForOtherReservation,
          idNumber: formData.idNumber || "0",
          nationality: formData.nationality || "",
          licenseImage: formData.licenseImage || "",
          licenceExpiryDate: formData.licenceExpiryDate
            ? new Date(formData.licenceExpiryDate)
            : undefined,
          personalId: formData.personalId || "",
          passportNumber: formData.passportNumber || "",
          borderNumber: formData.borderNumber || "",
          services: formData.services || [],
          driver: formData.driver || null,
          extraKmType: formData.extraKmType || "QUOTA",
          extraKmApplied: formData.extraKmApplied || false,
        },
        { keepErrors: false },
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_hasHydrated]);

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
              const diffDays = getRentalDays(values.fromDate, values.toDate);

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
          fieldsToValidate = isForOtherReservation
            ? [
                "OtherPersonName",
                "OtherPersonPhoneNumber",
                "OtherPersonLicenseImage",
                "OtherPersonalId",
              ]
            : [
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

          if (isForOtherReservation) {
            setFormData({
              reservationForOther: {
                name: values.OtherPersonName || "",
                phone: values.OtherPersonPhoneNumber || "",
                nationalId: values.OtherPersonalId || "",
                licenseImage: values.OtherPersonLicenseImage || "",
              },
            });
            return true;
          }

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
      resetForm: () => {
        reset(
          {
            pickupName: "",
            carReturnLocation: "",
            fromDate: undefined,
            toDate: undefined,
            pickupLat: null,
            pickupLong: null,
            pickupId: null,
            returnLat: null,
            returnLong: null,
            carReturnLocationId: null,
            pickupTrainId: null,
            pickupAirportId: null,
            returnTrainId: null,
            returnAirportId: null,
            idNumber: "0",
            nationality: "",
            licenseImage: "",
            licenceExpiryDate: undefined,
            personalId: "",
            passportNumber: "",
            borderNumber: "",
            services: [],
            driver: null,
            extraKmType: "QUOTA",
            extraKmApplied: false,
          },
          { keepErrors: false },
        );
      },
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
        fromDate: formatLocalDateTime(initialValues.fromDate),
        toDate: formatLocalDateTime(initialValues.toDate),
        idNumber: initialValues.idNumber,
        nationality: initialValues.nationality,
        licenseImage: initialValues.licenseImage as string,
        licenceExpiryDate: formatLocalDateTime(initialValues.licenceExpiryDate),
        personalId: initialValues.personalId,
        passportNumber: initialValues.passportNumber,
        borderNumber: initialValues.borderNumber,
        services: (initialValues.services || []) as number[],
        driver: initialValues.driver || null,
        extraKmType: initialValues.extraKmType || "QUOTA",
        extraKmApplied: initialValues.extraKmApplied || false,
        pickupLat: initialValues.pickupLat as number | null,
        pickupLong: initialValues.pickupLong as number | null,
        returnLat: initialValues.returnLat as number | null,
        returnLong: initialValues.returnLong as number | null,
        pickupId: initialValues.pickupId || null,
        carReturnLocationId: initialValues.carReturnLocationId || null,
      });

      const subscription = watch((value) => {
        const update: Partial<ReservationFormData> = {};

        if (value.pickupName !== undefined)
          update.pickupName = value.pickupName;
        if (value.carReturnLocation !== undefined)
          update.carReturnLocation = value.carReturnLocation;
        if (value.fromDate !== undefined)
          update.fromDate = formatLocalDateTime(value.fromDate);
        if (value.toDate !== undefined)
          update.toDate = formatLocalDateTime(value.toDate);
        if (value.idNumber !== undefined) update.idNumber = value.idNumber;
        if (value.nationality !== undefined)
          update.nationality = value.nationality;
        if (value.licenseImage !== undefined)
          update.licenseImage = value.licenseImage as string;
        if (value.licenceExpiryDate !== undefined)
          update.licenceExpiryDate = formatLocalDateTime(
            value.licenceExpiryDate,
          );
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
        if (value.extraKmApplied !== undefined)
          update.extraKmApplied = value.extraKmApplied as boolean;

        if (value.fromDate && value.toDate) {
          const diffDays = getRentalDays(value.fromDate, value.toDate);
          update.rentalDays = diffDays;
        }

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

        setFormData(update);

        if (value.fromDate) {
          const formattedFromDate = formatLocalDateTime(value.fromDate);
          if (formattedFromDate && filters.fromDate !== formattedFromDate) {
            setFilter("fromDate", formattedFromDate);
          }
        }
        if (value.toDate) {
          const formattedToDate = formatLocalDateTime(value.toDate);
          if (formattedToDate && filters.toDate !== formattedToDate) {
            setFilter("toDate", formattedToDate);
          }
        }
        if (value.pickupTrainId !== undefined) {
          if (filters.pickupTrainId !== value.pickupTrainId) {
            setFilter("pickupTrainId", value.pickupTrainId as number);
          }
        }
        if (value.pickupAirportId !== undefined) {
          if (filters.pickupAirportId !== value.pickupAirportId) {
            setFilter("pickupAirportId", value.pickupAirportId as number);
          }
        }
        if (value.returnTrainId !== undefined) {
          if (filters.carReturnTrainId !== value.returnTrainId) {
            setFilter("carReturnTrainId", value.returnTrainId as number);
          }
        }
        if (value.returnAirportId !== undefined) {
          if (filters.carReturnAirportId !== value.returnAirportId) {
            setFilter("carReturnAirportId", value.returnAirportId as number);
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
    }, [
      watch,
      filters,
      setFilter,
      setFormData,
      latitude,
      longitude,
      _hasHydrated,
    ]);

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
        content: isForOtherReservation ? (
          <ForOtherStepTwo
            control={control}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
          />
        ) : (
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
