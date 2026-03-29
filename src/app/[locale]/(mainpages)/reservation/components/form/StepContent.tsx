"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
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
    const { address } = useLocationStore();
    const { formData, setFormData } = useBookedCarDetailsStore();
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
    }, [filters, setValue, getValues]);

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
          return await trigger(fieldsToValidate);
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
              personalId: residenceType === "2" ? null : (values.personalId || null),
              passportNumber: (residenceType === "2" || residenceType === "3") ? (values.passportNumber || null) : null,
              borderNumber: residenceType === "3" ? (values.borderNumber || null) : null,
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
            setFilter("carReturnLocation", address);
          }
        }
      }
    }, [
      address,
      filters.pickupName,
      filters.carReturnLocation,
      setValue,
      setFilter,
      open,
      target,
    ]);

    // Keep filters store in sync with form (locations & dates only)
    useEffect(() => {
      const subscription = watch((value) => {
        setFormData({
          pickupName: value.pickupName,
          carReturnLocation: value.carReturnLocation,
          fromDate: value.fromDate,
          toDate: value.toDate,
          idNumber: value.idNumber,
          nationality: value.nationality,
          licenseImage: value.licenseImage as string,
          licenceExpiryDate: value.licenceExpiryDate,
          personalId: value.personalId,
          passportNumber: value.passportNumber,
          borderNumber: value.borderNumber,
          services: value.services as string[],
        });

        setFilter(
          "fromDate",
          value.fromDate ? (value.fromDate as Date).toISOString() : "",
        );
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
    }, [watch, setFilter, setFormData]);

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
