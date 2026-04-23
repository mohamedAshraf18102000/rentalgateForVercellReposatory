"use client";
import { useState, useEffect } from "react";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Stepper from "../../../../(components)/rentalStepper/Stepper";
import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import StepContent, { StepContentRef } from "../components/form/StepContent";

import { Button } from "@/app/(components)";
import { ChevronLeft, HandCoins, SaudiRiyal } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import ReservationBreadCrump from "../components/ReservationBreadCrump";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

import { useMemo, useRef } from "react";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";
import { getUserProfileCompletnessState } from "@/services/userProfile/getUserProfileCompletnessState.service";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  calculateRentalPrice,
  PricingType,
} from "@/lib/utils/calculateRentalPrice";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";
import ReservationDrawer from "../components/reservationDrawer/ReservationDrawer";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCalculateQuotePrice } from "@/hooks/api/useCalculateQuotePrice";
import { buildReservationPayload } from "../utils/buildReservationPayload";
import { toast } from "sonner";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import GoogleMapsPolyLineLocation from "@/app/(components)/mapsLocation/GoogleMapsPolyLinedLocation";
import { useRouter, useSearchParams } from "next/navigation";
import { useRentalDays } from "@/hooks/useCalculateRentalDays";
import { resetReservationState } from "@/lib/stores/resetReservationState";

const pricingTypeLabels: Record<PricingType, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
  HALF_MONTHLY: "نصف شهري",
  MONTHLY: "شهري",
  YEARLY: "سنوي",
};

const page = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isStepTwoSkipped, setIsStepTwoSkipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formResetKey, setFormResetKey] = useState<number>(0);
  const stepContentRef = useRef<StepContentRef>(null);
  const searchParams = useSearchParams();
  const isForOtherReservation = searchParams.get("forOther") === "true";
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const formData = useBookedCarDetailsStore((s) => s.formData);
  const { filters } = useUserPreferedFiltersStore();
  const setFormField = useBookedCarDetailsStore((s) => s.setFormField);

  const calculateUserQoutePayload = buildReservationPayload(formData);

  const {
    mutate: calculateQuotePrice,
    mutateAsync: calculateQuotePriceAsync,
    reset: resetQuoteState,
    isPending: isCalculating,
    data: calculatedQuotePricingData,
    isError: isQuoteError,
    error,
  } = useCalculateQuotePrice();

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
      const { completeness } = await getUserProfileCompletnessState();
      if (completeness) {
        setIsStepTwoSkipped(true);
        setActiveStep(3);
        return;
      } else {
        setIsStepTwoSkipped(false);
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
    } finally {
      setIsLoading(false);
    }

    setActiveStep(step);
  };

  useEffect(() => {
    setFormField("plan", pricingDetails.pricingType);
  }, [pricingDetails.pricingType]);

  const { discountPercentage } = useMemo(
    () =>
      calculateDiscount({
        originalPrice: pricingDetails.originalPricePerDay,
        offerPrice: pricingDetails.pricePerDay,
      }),
    [pricingDetails.originalPricePerDay, pricingDetails.pricePerDay],
  );

  const pricingTypeLabel = pricingDetails.pricingType
    ? pricingTypeLabels[pricingDetails.pricingType]
    : "";

  const discountBadge =
    discountPercentage > 0
      ? pricingTypeLabel
        ? `خصم ${discountPercentage}% - ${pricingTypeLabel}`
        : `خصم ${discountPercentage}%`
      : "";

  const handleStepNavigation = async (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
      return;
    }

    if (step === activeStep) return;

    const isValid = await stepContentRef.current?.validateStep();
    if (isValid) {
      if (activeStep === 1 && step >= 2) {
        await handleStepOneNavigation(step);
        return;
      }
      setActiveStep(step);
    }
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const isValid = await stepContentRef.current?.validateStep();
      if (!isValid) return;

      try {
        resetQuoteState();
        const latestFormData = useBookedCarDetailsStore.getState().formData;
        await calculateQuotePriceAsync(buildReservationPayload(latestFormData));
      } catch {
        return;
      }

      await handleStepOneNavigation(2);
      return;
    }

    if (activeStep < 3) {
      handleStepNavigation(activeStep + 1);
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
      <WrapperContainer exceedNav>
        <PickupDialog title="تأكيد" />
        <div className="w-full">
          <ReservationBreadCrump carId={carDetails?.ccbId} />
          <div
            className={`w-full grid grid-cols-1 gap-3 md:gap-5 ${
              isStepTwoSkipped ? "md:grid-cols-2" : "md:grid-cols-3"
            }`}
          >
            <Stepper
              stepNum="1"
              title="تأكيد مكان و ميعاد الأستلام و التسليم"
              description={`${formData.pickupName} - ${formData.carReturnLocation}`}
              isActive={activeStep === 1}
              onClick={() => handleStepNavigation(1)}
            />
            {!isStepTwoSkipped && (
              <Stepper
                stepNum="2"
                title="تفاصيل المستأجر"
                description="استكمال بيانات المستأجر"
                isActive={activeStep === 2}
                onClick={() => handleStepNavigation(2)}
              />
            )}
            <Stepper
              stepNum={isStepTwoSkipped ? "2" : "3"}
              title="تحديد الخدمات"
              description="تحديد خدمات السيارة"
              isActive={activeStep === 3}
              onClick={() => handleStepNavigation(3)}
            />
          </div>

          <div className="mt-6 flex w-full flex-col gap-4 lg:mt-10 lg:flex-row">
            <div className="h-fit w-full rounded-2xl bg-white p-4 lg:w-3/4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center">
                  <span className="mx-2 text-base">أجمالي التكلفة:</span>
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
                        ({pricingDetails.days}
                        {pricingDetails.days > 1 && pricingDetails.days < 11
                          ? " أيام"
                          : " يوم"}
                        / حجز {pricingTypeLabel})
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetForm}
                    className="text-sm text-Grey500 underline underline-offset-2 cursor-pointer"
                  >
                    إعاده الاعدادات للافتراضي
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
                    className="w-full text-sm! md:w-auto md:text-base!"
                    loading={isLoading || isCalculating}
                    icon={<ChevronLeft className="w-5! h-5!" />}
                  >
                    <span className="mx-2 text-sm md:text-base">
                      {activeStep === 3 ? "إتمام الحجز" : "التالي"}
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
                  freeKm={carDetails?.allowedKm}
                  carName={carDetails?.car.carName}
                  companyName={carDetails?.company.arabicName}
                  companyLogo={carDetails?.company.logo}
                  carBrand={carDetails?.car.brandNameArabic}
                  carImage={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${carDetails?.car.image}`}
                  pricingType={pricingDetails.pricingType}
                  carPrice={pricingDetails.pricePerDay}
                  priceBeforeOffer={pricingDetails.originalPricePerDay}
                  rentalDays={rentalDays}
                  totalPrice={pricingDetails.totalPrice}
                  firstBadgeTitle={discountBadge}
                  firstBadgeColor="green"
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
                          destinationLogoUrl={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${carDetails?.company.logo}`}
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
