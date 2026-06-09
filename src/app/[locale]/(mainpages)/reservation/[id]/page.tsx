"use client";
import { useState, useEffect } from "react";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Stepper from "../../../../(components)/rentalStepper/Stepper";
import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import StepContent, { StepContentRef } from "../components/form/StepContent";
import { Button } from "@/app/(components)";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HandCoins,
  SaudiRiyal,
} from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import ReservationBreadCrump from "../components/ReservationBreadCrump";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

import { useMemo, useRef } from "react";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";
import ReservationDrawer from "../components/reservationDrawer/ReservationDrawer";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
import { buildReservationPayload } from "../utils/buildReservationPayload";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import GoogleMapsPolyLineLocation from "@/app/(components)/mapsLocation/GoogleMapsPolyLinedLocation";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentalDays } from "@/hooks/useCalculateRentalDays";
import { resetReservationState } from "@/lib/stores/resetReservationState";
import { useLocale, useTranslations } from "next-intl";
import { useCalculateUserProfileComplete } from "@/hooks/api/useCalculateUserProfileComplete";
import UpdateUserSavedLocationDialog from "@/app/[locale]/(mainpages)/userProfile/components/userDialog/UpdateUserSavedLocationDialog";
import { toast } from "sonner";
import { normalizeImageUrl } from "@/util";

const CheckIcon = () => {
  return <Check className="text-green-400" />;
};

const page = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
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
  const searchParams = useSearchParams();
  const isForOtherReservation = searchParams.get("forOther") === "true";
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);

  const formData = useBookedCarDetailsStore((s) => s.formData);
  const isShowTax = useBookedCarDetailsStore((s) => s.showPricesWithTax);
  const { filters } = useUserPreferedFiltersStore();
  const setFormField = useBookedCarDetailsStore((s) => s.setFormField);

  const calculateUserQoutePayload = buildReservationPayload(formData);

  console.log(carDetails?.latitude, carDetails?.longitude);

  const {
    mutate: calculateQuotePrice,
    mutateAsync: calculateQuotePriceAsync,
    reset: resetQuoteState,
    isPending: isCalculating,
    data: calculatedQuotePricingData,
    isError: isQuoteError,
    error,
  } = useCalculateQuotePrice();
  const {
    mutateAsync: calculateUserProfileComplete,
    isPending: isCalculatingUserProfileComplete,
  } = useCalculateUserProfileComplete();

  // sync plan into store whenever pricingType changes

  const rentalDays = useRentalDays(filters.fromDate, filters.toDate);

  const pricingDetails = useMemo(() => {
    const effectiveDays = rentalDays > 0 ? rentalDays : 1;

    // Current calculation (effective price)
    const effectivePricing = calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: carDetails?.dailyPrice ?? 0,
      weeklyPrice: carDetails?.weeklyPrice ?? 0,
      halfMonthlyPrice: carDetails?.halfMonthPrice ?? 0,
      monthlyPrice: carDetails?.monthlyPrice ?? 0,
      yearlyPrice: carDetails?.yearlyPrice ?? 0,
      offerDailyPrice: carDetails?.offerDailyPrice ?? 0,
      offerWeeklyPrice: carDetails?.offerWeeklyPrice ?? 0,
      offerHalfMonthlyPrice: carDetails?.offerHalfMonthPrice ?? 0,
      offerMonthlyPrice: carDetails?.offerMonthlyPrice ?? 0,
      offerYearlyPrice: carDetails?.offerYearlyPrice ?? 0,
    });

    // Original calculation (without offers)
    const originalPricing = calculateRentalPrice({
      days: effectiveDays,
      dailyPrice: carDetails?.dailyPrice ?? 0,
      weeklyPrice: carDetails?.weeklyPrice ?? 0,
      halfMonthlyPrice: carDetails?.halfMonthPrice ?? 0,
      monthlyPrice: carDetails?.monthlyPrice ?? 0,
      yearlyPrice: carDetails?.yearlyPrice ?? 0,
      offerDailyPrice: 0,
      offerWeeklyPrice: 0,
      offerHalfMonthlyPrice: 0,
      offerMonthlyPrice: 0,
      offerYearlyPrice: 0,
    });

    if (calculatedQuotePricingData) {
      const apiDays =
        calculatedQuotePricingData.dataForReservation?.days || effectiveDays;
      const totalDiscounts =
        (calculatedQuotePricingData.promoDiscount || 0) +
        (calculatedQuotePricingData.businessDiscount || 0) +
        (calculatedQuotePricingData.carDaysDiscount || 0) +
        (calculatedQuotePricingData.pointsDiscount || 0);

      const apiTotal = calculatedQuotePricingData.total;

      return {
        totalPrice: apiTotal,
        originalTotalPrice: apiTotal + totalDiscounts,
        pricePerDay: apiTotal / apiDays,
        originalPricePerDay: (apiTotal + totalDiscounts) / apiDays,
        pricingType: calculatedQuotePricingData.appliedPlan,
        days: apiDays,
      };
    }

    return {
      totalPrice: effectivePricing.totalPrice,
      originalTotalPrice: originalPricing.totalPrice,
      pricePerDay: effectivePricing.pricePerDay,
      originalPricePerDay: originalPricing.pricePerDay,
      pricingType: effectivePricing.pricingType,
      days: effectiveDays,
    };
  }, [carDetails, rentalDays, calculatedQuotePricingData]);

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
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "حدث خطأ أثناء التحقق من اكتمال الملف الشخصي";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    setActiveStep(step);
  };

  useEffect(() => {
    setFormField("plan", pricingDetails.pricingType);
  }, [pricingDetails.pricingType]);

  const pricingTypeLabel = pricingDetails.pricingType
    ? t(`pricingType.${pricingDetails.pricingType.toLowerCase()}`)
    : "";

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
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "حدث خطأ أثناء التحقق من اكتمال الملف الشخصي";
        toast.error(errorMessage);
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

  return (
    <>
      <ReservationDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        reservationData={calculatedQuotePricingData}
        onCalculateQuote={handleCalculateQuote}
        isCalculating={isCalculating}
      />
      <UpdateUserSavedLocationDialog
        open={showSaveAddressDialog}
        setOpen={(open) => {
          setShowSaveAddressDialog(open);
          if (!open) {
            setShouldContinueAfterAddressSave(false);
          }
        }}
        initialShowAddForm={true}
        addFormOnlyMode={true}
        initialLat={formData.pickupLat ?? undefined}
        initialLng={formData.pickupLong ?? undefined}
        initialAddress={formData.pickupName || undefined}
        onSuccess={async (address) => {
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
        }}
      />
      <WrapperContainer exceedNav>
        <PickupDialog title={t("confirm")} />
        <div className="w-full">
          <ReservationBreadCrump carId={carDetails?.ccbId} />
          <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
            <Stepper
              stepNum={activeStep > 1 ? <CheckIcon /> : "1"}
              title={t("reservation.stepper.stepOneTitle")}
              description={`${formData.pickupName} - ${formData.carReturnLocation}`}
              isActive={activeStep === 1}
              onClick={() => handleStepperClick(1)}
            />
            <Stepper
              stepNum={isStepTwoSkipped ? <CheckIcon /> : "2"}
              title={t("reservation.stepper.stepTwoTitle")}
              description={
                isStepTwoSkipped
                  ? ""
                  : t("reservation.stepper.stepTwoDescription")
              }
              secondaryLabel={
                isStepTwoSkipped
                  ? t("reservation.stepper.stepTwoSkippedLabel")
                  : undefined
              }
              isActive={activeStep === 2}
              nonInteractive={isStepTwoSkipped}
              onClick={() => handleStepperClick(2)}
            />
            <Stepper
              stepNum="3"
              title={t("reservation.stepper.stepThreeTitle")}
              description={t("reservation.stepper.stepThreeDescription")}
              isActive={activeStep === 3}
              onClick={() => handleStepperClick(3)}
            />
          </div>

          <div className="mt-6 flex w-full flex-col gap-4 lg:mt-10 lg:flex-row">
            <div className="h-fit w-full rounded-2xl bg-white p-4 lg:w-3/4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center">
                  <span className="mx-2 text-base">
                    {t("reservation.totalCost")}
                  </span>
                  {isCalculating ? (
                    <Skeleton className="h-6 w-36 bg-Grey200 rounded-sm" />
                  ) : (
                    <div className="flex flex-wrap items-center">
                      {pricingDetails.totalPrice <
                        pricingDetails.originalTotalPrice && (
                        <span className="text-Grey500 mx-2 line-through text-sm">
                          {formatPrice(pricingDetails.originalTotalPrice)}
                        </span>
                      )}
                      <span className="text-lg font-bold">
                        {formatPrice(pricingDetails.totalPrice)}
                      </span>
                      <SaudiRiyal />
                      <span className="mx-1 text-Grey500 text-xs sm:text-sm">
                        {t("reservation.durationAndPlan", {
                          days: pricingDetails.days,
                          plan: pricingTypeLabel,
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3 w-full">
                  <button
                    onClick={handleResetForm}
                    className="text-sm text-Grey500 underline underline-offset-2 cursor-pointer"
                  >
                    {t("reservation.resetToDefault")}
                  </button>

                  <Button
                    startIcon={
                      activeStep === 3 ? (
                        <HandCoins className="h-5! w-5!" />
                      ) : (
                        ""
                      )
                    }
                    onClick={handleNext}
                    className="w-fit text-sm! md:w-auto md:text-base!"
                    loading={
                      isLoading ||
                      isCalculating ||
                      isCalculatingUserProfileComplete
                    }
                    icon={<ChevronIcon className="w-5! h-5!" />}
                  >
                    <span className="mx-2 text-sm md:text-base">
                      {activeStep === 3
                        ? t("reservation.completeBooking")
                        : t("reservation.next")}
                    </span>
                  </Button>
                </div>
              </div>
              <Separator className="my-3" />
              <StepContent
                key={formResetKey}
                ref={stepContentRef}
                activeStep={activeStep}
                isForOtherReservation={isForOtherReservation}
              />
            </div>
            <div className="w-full lg:w-1/4">
              <div className="">
                <CarsCard
                  removeBookNowButton={true}
                  rate={carDetails?.company?.averageRating ?? 0}
                  showTax={isShowTax}
                  freeKm={carDetails?.allowedKm}
                  carName={carDetails?.car.carName}
                  companyName={
                    locale === "ar"
                      ? carDetails?.company.arabicName
                      : carDetails?.company.englishName
                  }
                  companyLogo={carDetails?.company.logo}
                  carBrand={
                    locale === "ar"
                      ? carDetails?.car.brandNameArabic
                      : carDetails?.car.brandNameEnglish
                  }
                  carImage={normalizeImageUrl(carDetails?.car.image)}
                  pricingType={pricingDetails.pricingType}
                  carPrice={pricingDetails.pricePerDay}
                  priceBeforeOffer={pricingDetails.originalPricePerDay}
                  rentalDays={rentalDays}
                  totalPrice={pricingDetails.totalPrice}
                  extraContent={
                    (formData.returnType === "BRANCH" ||
                      formData.pickupType === "BRANCH") && (
                      <div className="relative mt-2 h-[180px] w-full overflow-visible rounded-2xl sm:h-[220px]">
                        <GoogleMapsPolyLineLocation
                          hideUserLocation
                          containerHeight="100%"
                          destinationLat={carDetails?.latitude}
                          destinationLng={carDetails?.longitude}
                          disableMapClickToChangeLocation
                          destinationName={carDetails?.branchName}
                          destinationLogoUrl={normalizeImageUrl(
                            carDetails?.company.logo,
                          )}
                          autoFitBounds={true}
                          hideSearch={true}
                        />
                      </div>
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </WrapperContainer>
    </>
  );
};

export default page;
