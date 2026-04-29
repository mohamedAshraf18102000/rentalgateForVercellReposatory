"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { forwardRef, useImperativeHandle } from "react";

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
import { StepContentProps, StepContentRef } from "./StepContent.types";
import {
  buildInitialReservationValues,
  buildResetReservationValues,
} from "./stepContentFormValues";
import { validateCurrentStep } from "./stepContentValidation";
import {
  useHydratedFormReset,
  usePrefillLocationAfterReset,
  useSyncFormToStores,
  useSyncStoreToForm,
} from "./useStepContentEffects";

export type { StepContentRef } from "./StepContent.types";

const StepContent = forwardRef<StepContentRef, StepContentProps>(
  ({ activeStep, isForOtherReservation = false }, ref) => {
    const { displayStep, animationClass } = useStepAnimation(activeStep);
    const { filters, setFilter } = useUserPreferedFiltersStore();
    const {
      userPhysical_Latitude,
      userPhysical_Longitude,
      userPhysical_Address,
    } = useLocationStore();
    const { carDetails, formData, setFormData, _hasHydrated } =
      useBookedCarDetailsStore();
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
      defaultValues: buildInitialReservationValues({
        formData,
        filters,
        isForOtherReservation,
      }),
    });

    useHydratedFormReset({
      hasHydrated: _hasHydrated,
      formData,
      filters,
      isForOtherReservation,
      reset,
    });

    useSyncStoreToForm({ filters, setValue, getValues });

    useImperativeHandle(ref, () => ({
      validateStep: async () => {
        return validateCurrentStep({
          displayStep,
          isForOtherReservation,
          trigger,
          getValues,
          carDetails,
          setFormData,
          setClientData,
        });
      },
      getValues: () => getValues(),
      resetForm: () => {
        reset(buildResetReservationValues(), { keepErrors: false });
      },
      setPickupLocationFromSavedAddress: ({
        pickupId,
        pickupName,
        pickupLat,
        pickupLong,
      }) => {
        setValue("pickupId", pickupId, { shouldValidate: true });
        setValue("pickupName", pickupName, { shouldValidate: true });
        setValue("pickupLat", pickupLat);
        setValue("pickupLong", pickupLong);
      },
      setReturnLocationFromSavedAddress: ({
        carReturnLocationId,
        carReturnLocation,
        returnLat,
        returnLong,
      }) => {
        setValue("carReturnLocationId", carReturnLocationId, {
          shouldValidate: true,
        });
        setValue("carReturnLocation", carReturnLocation, {
          shouldValidate: true,
        });
        setValue("returnLat", returnLat);
        setValue("returnLong", returnLong);
      },
    }));

    usePrefillLocationAfterReset({
      hasHydrated: _hasHydrated,
      address: userPhysical_Address ?? undefined,
      latitude: userPhysical_Latitude ?? undefined,
      longitude: userPhysical_Longitude ?? undefined,
      getValues,
      setValue,
      setFormData,
    });

    useSyncFormToStores({
      hasHydrated: _hasHydrated,
      getValues,
      watch,
      setFormData,
      filters,
      setFilter,
    });

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
