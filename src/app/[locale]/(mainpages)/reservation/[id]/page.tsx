"use client";
import { useState } from "react";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Stepper from "../../../../(components)/rentalStepper/Stepper";
import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import StepContent, { StepContentRef } from "../components/form/StepContent";

import { Button } from "@/app/(components)";
import { ChevronLeft, HandCoins, SaudiRiyal } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import ReservationBreadCrump from "../components/ReservationBreadCrump";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

import { useMemo, useRef } from "react";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";
import { buildReservationRawData } from "../utils/buildReservationRawData";
import { getUserProfileCompletnessState } from "@/services/userProfile/getUserProfileCompletnessState.service";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";
import {
  calculateRentalPrice,
  PricingType,
} from "@/lib/utils/calculateRentalPrice";
import { calculateDiscount } from "@/lib/utils/calculateDiscount";
import ReservationDrawer from "../components/reservationDrawer/ReservationDrawer";

const pricingTypeLabels: Record<PricingType, string> = {
  daily: "يومي",
  weekly: "أسبوعي",
  halfMonthly: "نصف شهري",
  monthly: "شهري",
  yearly: "سنوي",
};

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isStepTwoSkipped, setIsStepTwoSkipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const stepContentRef = useRef<StepContentRef>(null);
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const { filters } = useUserPreferedFiltersStore();
  const resetReservationForm = useBookedCarDetailsStore((s) => s.resetForm);
  const bookedCarDetails = useBookedCarDetailsStore();

  const rentalDays = useMemo(() => {
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [filters.fromDate, filters.toDate]);

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

    return {
      totalPrice: Math.round(effectivePricing.totalPrice),
      originalTotalPrice: Math.round(originalPricing.totalPrice),
      pricePerDay: Math.round(effectivePricing.pricePerDay),
      originalPricePerDay: Math.round(originalPricing.pricePerDay),
      pricingType: effectivePricing.pricingType,
    };
  }, [carDetails, rentalDays]);

  const { discountPercentage } = useMemo(
    () =>
      calculateDiscount({
        originalPrice: pricingDetails.originalPricePerDay,
        offerPrice: pricingDetails.pricePerDay,
      }),
    [pricingDetails.originalPricePerDay, pricingDetails.pricePerDay],
  );

  const discountBadge =
    discountPercentage > 0
      ? `خصم ${discountPercentage}% - ${pricingTypeLabels[pricingDetails.pricingType]}`
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
      }
      setActiveStep(step);
    }
  };

  const handleSubmit = async () => {
    const isValid = await stepContentRef.current?.validateStep();
    if (!isValid) return;

    const rawData = buildReservationRawData(bookedCarDetails);

    console.log(rawData);
  };

  const handleNext = async () => {
    if (activeStep < 3) {
      handleStepNavigation(activeStep + 1);
    } else {
      await handleSubmit();
    }
  };

  return (
    <WrapperContainer exceedNav>
      <PickupDialog title="تأكيد" />
      <div className="w-full">
        <ReservationBreadCrump carId={carDetails?.ccbId} />
        <div
          className={`w-full grid ${isStepTwoSkipped ? "grid-cols-2" : "grid-cols-3"} gap-5`}
        >
          <Stepper
            stepNum="1"
            title="تأكيد مكان و ميعاد الأستلام و التسليم"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 1}
            onClick={() => handleStepNavigation(1)}
          />
          {!isStepTwoSkipped && (
            <Stepper
              stepNum="2"
              title="تفاصيل المستأجر"
              description="كان لوريم إيبسوم ولايزال المعيار للنص"
              isActive={activeStep === 2}
              onClick={() => handleStepNavigation(2)}
            />
          )}
          <Stepper
            stepNum={isStepTwoSkipped ? "2" : "3"}
            title="تحديد الخدمات"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 3}
            onClick={() => handleStepNavigation(3)}
          />
        </div>

        <div className="flex gap-4 w-full mt-10">
          <div className="w-3/4 bg-white h-fit rounded-2xl p-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="mx-2 text-base">أجمالي التكلفة:</span>
                {pricingDetails.totalPrice <
                  pricingDetails.originalTotalPrice && (
                  <span className="text-Grey500 mx-2 line-through text-sm">
                    {pricingDetails.originalTotalPrice}
                  </span>
                )}
                <span className="text-lg font-bold">
                  {pricingDetails.totalPrice}{" "}
                </span>
                <SaudiRiyal />
              </div>
              <Button
                startIcon={
                  activeStep === 3 ? <HandCoins className="h-5! w-5!" /> : ""
                }
                onClick={handleNext}
                className="text-base!"
                loading={isLoading}
                icon={<ChevronLeft className="w-5! h-5!" />}
              >
                <span className="mx-2">
                  {activeStep === 3 ? "إتمام الحجز" : "التالي"}
                </span>
              </Button>
            </div>
            <Separator className="my-3" />
            <StepContent ref={stepContentRef} activeStep={activeStep} />
          </div>
          <div className="w-1/4">
            <div className="">
              <CarsCard
                freeKm={carDetails?.allowedKm}
                carName={carDetails?.car.carName}
                companyName={carDetails?.company.arabicName}
                companyLogo={`${process.env.NEXT_PUBLIC_IMAGES_PREFIX_URL}${carDetails?.company.logo}`}
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
                  <div className="mt-2 w-full h-50 rounded-2xl overflow-hidden">
                    <GoogleMapsLocation />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default page;
