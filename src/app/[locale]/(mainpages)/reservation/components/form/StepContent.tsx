"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { forwardRef, useImperativeHandle, useMemo } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createReservationSchema,
  ReservationFormValues,
  ReservationSchemaMessages,
} from "@/lib/validations/reservationSchema";
import { useLocale, useTranslations } from "next-intl";

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
  useSyncFormToStores,
  useSyncStoreToForm,
} from "./useStepContentEffects";

export type { StepContentRef } from "./StepContent.types";

const StepContent = forwardRef<StepContentRef, StepContentProps>(
  ({ activeStep, isForOtherReservation = false }, ref) => {
    const locale = useLocale();
    const tSchema = useTranslations("schemasLocalization.reservation");
    const { displayStep, animationClass } = useStepAnimation(activeStep);
    const { filters, setFilter } = useUserPreferedFiltersStore();
    const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
    const formData = useBookedCarDetailsStore((s) => s.formData);
    const setFormData = useBookedCarDetailsStore((s) => s.setFormData);
    const _hasHydrated = useBookedCarDetailsStore((s) => s._hasHydrated);
    const reconcileFormData = useBookedCarDetailsStore(
      (s) => s.reconcileFormData,
    );
    const { setClientData } = useClientStore();

    const reservationSchema = useMemo(() => {
      const messages = {
        pickupNameRequired: tSchema("pickupNameRequired"),
        pickupNameInvalid: tSchema("pickupNameInvalid"),
        carReturnLocationRequired: tSchema("carReturnLocationRequired"),
        carReturnLocationInvalid: tSchema("carReturnLocationInvalid"),
        fromDateRequired: tSchema("fromDateRequired"),
        toDateRequired: tSchema("toDateRequired"),
        idNumberRequired: tSchema("idNumberRequired"),
        nationalityRequired: tSchema("nationalityRequired"),
        identityExpiryDateRequired: tSchema("identityExpiryDateRequired"),
        licenseImageRequired: tSchema("licenseImageRequired"),
        licenceExpiryDateRequired: tSchema("licenceExpiryDateRequired"),
        minRentalDuration: tSchema("minRentalDuration"),
        otherPersonNameRequired: tSchema("otherPersonNameRequired"),
        otherPersonPhoneRequired: tSchema("otherPersonPhoneRequired"),
        otherPersonPhoneInvalid: tSchema("otherPersonPhoneInvalid"),
        otherPersonLicenseImageRequired: tSchema(
          "otherPersonLicenseImageRequired",
        ),
        otherPersonalIdRequired: tSchema("otherPersonalIdRequired"),
        personalIdRequired: tSchema("personalIdRequired"),
        passportNumberRequired: tSchema("passportNumberRequired"),
        borderNumberRequired: tSchema("borderNumberRequired"),
      } satisfies ReservationSchemaMessages;

      return createReservationSchema(messages);
    }, [tSchema, locale]);

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
      filters,
      isForOtherReservation,
      reset,
      reconcileFormData,
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
