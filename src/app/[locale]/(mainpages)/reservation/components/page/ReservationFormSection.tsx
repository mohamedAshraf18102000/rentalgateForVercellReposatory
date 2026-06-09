import { RefObject } from "react";
import { ChevronLeft, ChevronRight, HandCoins, SaudiRiyal } from "lucide-react";
import { Button } from "@/app/(components)";
import { Separator } from "@/app/(components)/ui/separator";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import StepContent, { StepContentRef } from "../form/StepContent";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ReservationPricingDetails } from "../../hooks/useReservationPricing";

interface ReservationFormSectionProps {
  activeStep: number;
  formResetKey: number;
  isForOtherReservation: boolean;
  isCalculating: boolean;
  isLoading: boolean;
  isCalculatingUserProfileComplete: boolean;
  pricingDetails: ReservationPricingDetails;
  isRTL: boolean;
  stepContentRef: RefObject<StepContentRef | null>;
  totalCostLabel: string;
  durationAndPlanLabel: string;
  resetToDefaultLabel: string;
  completeBookingLabel: string;
  nextLabel: string;
  onResetForm: () => void;
  onNext: () => void;
}

const ReservationFormSection = ({
  activeStep,
  formResetKey,
  isForOtherReservation,
  isCalculating,
  isLoading,
  isCalculatingUserProfileComplete,
  pricingDetails,
  isRTL,
  stepContentRef,
  totalCostLabel,
  durationAndPlanLabel,
  resetToDefaultLabel,
  completeBookingLabel,
  nextLabel,
  onResetForm,
  onNext,
}: ReservationFormSectionProps) => {
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="h-fit w-full rounded-2xl bg-white p-4 lg:w-3/4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center">
          <span className="mx-2 text-base">{totalCostLabel}</span>
          {isCalculating ? (
            <Skeleton className="h-6 w-36 bg-Grey200 rounded-sm" />
          ) : (
            <div className="flex flex-wrap items-center">
              {pricingDetails.totalPrice < pricingDetails.originalTotalPrice && (
                <span className="text-Grey500 mx-2 line-through text-sm">
                  {formatPrice(pricingDetails.originalTotalPrice)}
                </span>
              )}
              <span className="text-lg font-bold">
                {formatPrice(pricingDetails.totalPrice)}
              </span>
              <SaudiRiyal />
              <span className="mx-1 text-Grey500 text-xs sm:text-sm">
                {durationAndPlanLabel}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onResetForm}
            className="text-sm text-Grey500 underline underline-offset-2 cursor-pointer"
          >
            {resetToDefaultLabel}
          </button>

          <Button
            startIcon={
              activeStep === 3 ? <HandCoins className="h-5! w-5!" /> : ""
            }
            onClick={onNext}
            className="w-fit text-sm! md:w-auto md:text-base!"
            loading={
              isLoading || isCalculating || isCalculatingUserProfileComplete
            }
            icon={<ChevronIcon className="w-5! h-5!" />}
          >
            <span className="mx-2 text-sm md:text-base">
              {activeStep === 3 ? completeBookingLabel : nextLabel}
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
  );
};

export default ReservationFormSection;
