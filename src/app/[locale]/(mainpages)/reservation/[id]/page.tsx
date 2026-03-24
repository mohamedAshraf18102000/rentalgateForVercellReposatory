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
import { useReservationFormStore } from "@/lib/stores/useReservationFormStore";
import { useRef } from "react";
import { PickupDialog } from "@/app/[locale]/(dialogs)/PickupDialog/PickUpDialog";

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepContentRef = useRef<StepContentRef>(null);
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const resetReservationForm = useReservationFormStore((s) => s.resetForm);

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

    const data = stepContentRef.current!.getValues();

    // Build FormData — licenceImage is a real File object
    const formData = new FormData();
    formData.append("pickupName", data.pickupName);
    formData.append("carReturnLocation", data.carReturnLocation);
    formData.append("fromDate", (data.fromDate as Date).toISOString());
    formData.append("toDate", (data.toDate as Date).toISOString());
    formData.append("fullName", data.fullName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("idNumber", data.idNumber);
    formData.append("nationality", data.nationality);
    formData.append("email", data.email);
formData.append(
      "licenceExpiryDate",
      (data.licenceExpiryDate as Date).toISOString(),
    );
    if (data.licenceImage instanceof File) {
      formData.append(
        "licenceImage",
        data.licenceImage,
        data.licenceImage.name,
      );
    }
    if (data.services && data.services.length > 0) {
      data.services.forEach((serviceId) =>
        formData.append("services[]", serviceId),
      );
    }

    console.log(
      "✅ Reservation FormData ready:",
      Object.fromEntries(formData.entries()),
    );

    // TODO: call your API here, e.g.:
    // await createReservation(formData);

    // Reset the in-memory licence store after successful submission
    resetReservationForm();
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
      <PickupDialog />
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
