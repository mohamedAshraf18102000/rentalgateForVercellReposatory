import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { StepContentRef } from "../components/form/StepContent";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
import { useCalculateUserProfileComplete } from "@/hooks/api/useCalculateUserProfileComplete";
import { useRentalDays } from "@/hooks/useCalculateRentalDays";
import { resetReservationState } from "@/lib/stores/resetReservationState";
import { buildReservationPayload } from "../utils/buildReservationPayload";
import { useReservationPricing } from "./useReservationPricing";
import { UserAddress } from "@/types/userProfile/userAddress";

const getProfileCompleteErrorMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || "حدث خطأ أثناء التحقق من اكتمال الملف الشخصي";

export function useReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isForOtherReservation = searchParams.get("forOther") === "true";

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isStepTwoSkipped, setIsStepTwoSkipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formResetKey, setFormResetKey] = useState<number>(0);
  const [showSaveAddressDialog, setShowSaveAddressDialog] =
    useState<boolean>(false);
  const [shouldContinueAfterAddressSave, setShouldContinueAfterAddressSave] =
    useState<boolean>(false);

  const stepContentRef = useRef<StepContentRef>(null);

  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const formData = useBookedCarDetailsStore((s) => s.formData);
  const isShowTax = useBookedCarDetailsStore((s) => s.showPricesWithTax);
  const setFormField = useBookedCarDetailsStore((s) => s.setFormField);
  const { filters } = useUserPreferedFiltersStore();

  const calculateUserQoutePayload = buildReservationPayload(formData);

  const {
    mutate: calculateQuotePrice,
    mutateAsync: calculateQuotePriceAsync,
    reset: resetQuoteState,
    isPending: isCalculating,
    data: calculatedQuotePricingData,
  } = useCalculateQuotePrice();

  const {
    mutateAsync: calculateUserProfileComplete,
    isPending: isCalculatingUserProfileComplete,
  } = useCalculateUserProfileComplete();

  const rentalDays = useRentalDays(filters.fromDate, filters.toDate);

  const pricingDetails = useReservationPricing({
    rentalDays,
    calculatedQuotePricingData,
  });

  useEffect(() => {
    setFormField("plan", pricingDetails.pricingType);
  }, [pricingDetails.pricingType, setFormField]);

  const handleStepOneNavigation = async (step: number) => {
    if (isForOtherReservation) {
      setIsStepTwoSkipped(false);
      setActiveStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const { completeness } = await calculateUserProfileComplete();

      if (completeness) {
        setIsStepTwoSkipped(true);
        setActiveStep(3);
        return;
      } else {
        setIsStepTwoSkipped(false);
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
      toast.error(getProfileCompleteErrorMessage(error));
    } finally {
      setIsLoading(false);
    }

    setActiveStep(step);
  };

  const handleStepNavigation = async (step: number) => {
    if (step === 2 && isStepTwoSkipped) {
      return;
    }

    if (step < activeStep) {
      setActiveStep(step);
      return;
    }

    if (step === activeStep) return;

    const isValid = await stepContentRef.current?.validateStep();
    if (isValid) {
      if (
        activeStep === 2 &&
        step === 3 &&
        !isForOtherReservation &&
        !isStepTwoSkipped
      ) {
        setIsStepTwoSkipped(true);
        setActiveStep(1);
        return;
      }
      if (activeStep === 1 && step >= 2) {
        await handleStepOneNavigation(step);
        return;
      }
      setActiveStep(step);
    }
  };

  const proceedStepOneAfterValidation = async () => {
    if (!isForOtherReservation) {
      setIsLoading(true);
      try {
        const { completeness } = await calculateUserProfileComplete();
        if (!completeness) {
          setIsStepTwoSkipped(false);
          setActiveStep(2);
          return;
        }
        setIsStepTwoSkipped(true);
      } catch (error) {
        console.error("Error checking profile completeness:", error);
        toast.error(getProfileCompleteErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    try {
      resetQuoteState();
      const latestFormData = useBookedCarDetailsStore.getState().formData;
      await calculateQuotePriceAsync(buildReservationPayload(latestFormData));
    } catch {
      return;
    }

    if (isForOtherReservation) {
      setIsStepTwoSkipped(false);
      setActiveStep(2);
      return;
    }

    setActiveStep(3);
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const isValid = await stepContentRef.current?.validateStep();
      if (!isValid) return;

      const latestFormData = useBookedCarDetailsStore.getState().formData;
      const needsAddressCreation =
        latestFormData.pickupType === "MY_LOCATION" &&
        !latestFormData.pickupId &&
        !!latestFormData.pickupLat &&
        !!latestFormData.pickupLong;

      if (needsAddressCreation) {
        setShouldContinueAfterAddressSave(true);
        setShowSaveAddressDialog(true);
        return;
      }

      await proceedStepOneAfterValidation();
      return;
    }

    if (activeStep < 3) {
      setIsLoading(true);
      try {
        await handleStepNavigation(activeStep + 1);
      } finally {
        setIsLoading(false);
      }
    } else {
      const isValid = await stepContentRef.current?.validateStep();
      if (!isValid) return;

      calculateQuotePrice(calculateUserQoutePayload, {
        onSuccess: () => {
          setIsDrawerOpen(true);
        },
      });
    }
  };

  const handleStepperClick = async (step: number) => {
    if (step === 2 && isStepTwoSkipped) {
      return;
    }

    if (step <= activeStep) {
      await handleStepNavigation(step);
      return;
    }

    await handleNext();
  };

  const handleCalculateQuote = () => {
    const latestFormData = useBookedCarDetailsStore.getState().formData;
    calculateQuotePrice(buildReservationPayload(latestFormData));
  };

  const handleResetForm = () => {
    stepContentRef.current?.resetForm();
    resetReservationState();
    router.push("/bookings");
    setActiveStep(1);
    setFormResetKey((prev) => prev + 1);
  };

  const handleAddressDialogOpenChange = (open: boolean) => {
    setShowSaveAddressDialog(open);
    if (!open) {
      setShouldContinueAfterAddressSave(false);
    }
  };

  const handleAddressSaveSuccess = async (address: UserAddress) => {
    const latestFormData = useBookedCarDetailsStore.getState().formData;
    const savedPickupId = String(address.addressId);
    const shouldSyncReturnAddress =
      latestFormData.returnType === "MY_LOCATION" &&
      !latestFormData.carReturnLocationId;

    stepContentRef.current?.setPickupLocationFromSavedAddress({
      pickupId: savedPickupId,
      pickupName: address.addressName,
      pickupLat: address.latitude,
      pickupLong: address.longitude,
    });

    if (shouldSyncReturnAddress) {
      stepContentRef.current?.setReturnLocationFromSavedAddress({
        carReturnLocationId: savedPickupId,
        carReturnLocation: address.addressName,
        returnLat: address.latitude,
        returnLong: address.longitude,
      });
    }

    useBookedCarDetailsStore.getState().setFormData({
      pickupName: address.addressName,
      pickupLat: address.latitude,
      pickupLong: address.longitude,
      pickupType: "MY_LOCATION",
      pickupId: savedPickupId,
      pickupAirportId: null,
      pickupTrainId: null,
      ...(shouldSyncReturnAddress
        ? {
            carReturnLocation: address.addressName,
            returnLat: address.latitude,
            returnLong: address.longitude,
            carReturnLocationId: savedPickupId,
            returnAirportId: null,
            returnTrainId: null,
          }
        : {}),
    });

    setShowSaveAddressDialog(false);

    if (shouldContinueAfterAddressSave) {
      setShouldContinueAfterAddressSave(false);
      await proceedStepOneAfterValidation();
    }
  };

  return {
    activeStep,
    isStepTwoSkipped,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    formResetKey,
    showSaveAddressDialog,
    stepContentRef,
    carDetails,
    formData,
    isShowTax,
    isForOtherReservation,
    rentalDays,
    pricingDetails,
    calculatedQuotePricingData,
    isCalculating,
    isCalculatingUserProfileComplete,
    handleNext,
    handleStepperClick,
    handleResetForm,
    handleCalculateQuote,
    handleAddressDialogOpenChange,
    handleAddressSaveSuccess,
  };
}
