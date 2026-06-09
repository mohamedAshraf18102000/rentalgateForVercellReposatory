"use client";

import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";
import { useLocale, useTranslations } from "next-intl";
import ReservationBreadCrump from "../components/ReservationBreadCrump";
import ReservationPageDialogs from "../components/page/ReservationPageDialogs";
import ReservationStepperSection from "../components/page/ReservationStepperSection";
import ReservationFormSection from "../components/page/ReservationFormSection";
import ReservationCarSidebar from "../components/page/ReservationCarSidebar";
import { useReservationPage } from "../hooks/useReservationPage";

const ReservationPage = () => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";

  const {
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
  } = useReservationPage();

  const pricingTypeLabel = pricingDetails.pricingType
    ? t(`pricingType.${pricingDetails.pricingType.toLowerCase()}`)
    : "";

  const durationAndPlanLabel = t("reservation.durationAndPlan", {
    days: pricingDetails.days,
    plan: pricingTypeLabel,
  });

  return (
    <>
      <ReservationPageDialogs
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={setIsDrawerOpen}
        calculatedQuotePricingData={calculatedQuotePricingData}
        onCalculateQuote={handleCalculateQuote}
        isCalculating={isCalculating}
        showSaveAddressDialog={showSaveAddressDialog}
        onAddressDialogOpenChange={handleAddressDialogOpenChange}
        formData={formData}
        onAddressSaveSuccess={handleAddressSaveSuccess}
      />
      <WrapperContainer exceedNav>
        <PickupDialog title={t("confirm")} />
        <div className="w-full">
          <ReservationBreadCrump carId={carDetails?.ccbId} />
          <ReservationStepperSection
            activeStep={activeStep}
            isStepTwoSkipped={isStepTwoSkipped}
            formData={formData}
            stepOneTitle={t("reservation.stepper.stepOneTitle")}
            stepTwoTitle={t("reservation.stepper.stepTwoTitle")}
            stepTwoDescription={t("reservation.stepper.stepTwoDescription")}
            stepTwoSkippedLabel={t("reservation.stepper.stepTwoSkippedLabel")}
            stepThreeTitle={t("reservation.stepper.stepThreeTitle")}
            stepThreeDescription={t(
              "reservation.stepper.stepThreeDescription",
            )}
            onStepperClick={handleStepperClick}
          />

          <div className="mt-6 flex w-full flex-col gap-4 lg:mt-10 lg:flex-row">
            <ReservationFormSection
              activeStep={activeStep}
              formResetKey={formResetKey}
              isForOtherReservation={isForOtherReservation}
              isCalculating={isCalculating}
              isLoading={isLoading}
              isCalculatingUserProfileComplete={
                isCalculatingUserProfileComplete
              }
              pricingDetails={pricingDetails}
              isRTL={isRTL}
              stepContentRef={stepContentRef}
              totalCostLabel={t("reservation.totalCost")}
              durationAndPlanLabel={durationAndPlanLabel}
              resetToDefaultLabel={t("reservation.resetToDefault")}
              completeBookingLabel={t("reservation.completeBooking")}
              nextLabel={t("reservation.next")}
              onResetForm={handleResetForm}
              onNext={handleNext}
            />
            <ReservationCarSidebar
              locale={locale}
              formData={formData}
              isShowTax={isShowTax}
              rentalDays={rentalDays}
              pricingDetails={pricingDetails}
            />
          </div>
        </div>
      </WrapperContainer>
    </>
  );
};

export default ReservationPage;
