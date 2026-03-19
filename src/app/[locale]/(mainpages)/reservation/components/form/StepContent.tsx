"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

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
        fullName: "",
        phoneNumber: "",
        idNumber: "",
        nationality: "",
        email: "",
        licenceImage: undefined,
        licenceExpiryDate: undefined,
        services: [],
      },
      mode: "onChange",
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
        } else if (displayStep === 2) {
          fieldsToValidate = [
            "fullName",
            "phoneNumber",
            "idNumber",
            "nationality",
            "email",
            "licenceImage",
            "licenceExpiryDate",
          ];
        }
        return await trigger(fieldsToValidate);
      },
      getValues: () => getValues(),
    }));

    // Sync address -> store & form if filter is still placeholder
    useEffect(() => {
      if (address && address !== "الموقع الحالي") {
        if (filters.pickupName === "الموقع الحالي" || !filters.pickupName) {
          setValue("pickupName", address);
          setFilter("pickupName", address);
        }
        if (
          filters.carReturnLocation === "الموقع الحالي" ||
          !filters.carReturnLocation ||
          filters.carReturnLocation === ""
        ) {
          setValue("carReturnLocation", address);
          setFilter("carReturnLocation", address);
        }
      }
    }, [
      address,
      filters.pickupName,
      filters.carReturnLocation,
      setValue,
      setFilter,
    ]);

    // Keep store in sync with form
    useEffect(() => {
      const subscription = watch((value) => {
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
    }, [watch, setFilter]);

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
        content: <StepTwo control={control} errors={errors} />,
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

