"use client";
import { useState } from "react";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Stepper from "../../../../(components)/rentalStepper/Stepper";
import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import StepContent, { StepContentRef } from "../components/form/StepContent";

import { Button } from "@/app/(components)";
import { ChevronLeft, SaudiRiyal } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import ReservationBreadCrump from "../components/ReservationBreadCrump";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

import { useRef } from "react";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";
import { buildReservationRawData } from "../utils/buildReservationRawData";

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepContentRef = useRef<StepContentRef>(null);
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const resetReservationForm = useBookedCarDetailsStore((s) => s.resetForm);
  const bookedCarDetails = useBookedCarDetailsStore();

  const handleStepNavigation = async (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
      return;
    }

    if (step === activeStep) return;

    const isValid = await stepContentRef.current?.validateStep();
    if (isValid) {
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
        <div className="w-full grid grid-cols-3 gap-5">
          <Stepper
            stepNum="1"
            title="تأكيد مكان و ميعاد الأستلام و التسليم"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 1}
            onClick={() => handleStepNavigation(1)}
          />
          <Stepper
            stepNum="2"
            title="تفاصيل المستأجر"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 2}
            onClick={() => handleStepNavigation(2)}
          />
          <Stepper
            stepNum="3"
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
                <span className="text-Grey500 mx-2">15.00</span>
                <span className="text-lg font-bold">10.56 </span>
                <SaudiRiyal />
              </div>
              <Button
                onClick={handleNext}
                className="text-base!"
                icon={<ChevronLeft className="w-5! h-5!" />}
              >
                {activeStep === 3 ? "تأكيد الحجز" : "التالي"}
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
                extraBadgeTitle="خصم 20%"
                firstBadgeColor="red"
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
