"use client";
import { useState } from "react";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import Stepper from "./components/form/Stepper";
import CarsCard from "@/app/(components)/customCards/CarsCard/CarsCard";
import StepContent from "./components/form/StepContent";
import { Button } from "@/app/(components)";
import { ChevronLeft, SaudiRiyal } from "lucide-react";
import { Separator } from "@/app/(components)/ui/separator";
import ReservationBreadCrump from "./components/ReservationBreadCrump";
import GoogleMapsLocation from "@/app/(components)/mapsLocation/GoogleMapsLocation";

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <WrapperContainer exceedNav>
      <div className="w-full">
        <ReservationBreadCrump />
        <div className="w-full grid grid-cols-3 gap-5">
          <Stepper
            stepNum="1"
            title="تأكيد مكان و ميعاد الأستلام و التسليم"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 1}
            onClick={() => setActiveStep(1)}
          />
          <Stepper
            stepNum="2"
            title="تفاصيل المستأجر"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 2}
            onClick={() => setActiveStep(2)}
          />
          <Stepper
            stepNum="3"
            title="تحديد الخدمات"
            description="كان لوريم إيبسوم ولايزال المعيار للنص"
            isActive={activeStep === 3}
            onClick={() => setActiveStep(3)}
          />
        </div>

        <div className="flex gap-4 w-full mt-10">
          <div className="w-3/4 bg-white rounded-2xl p-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="mx-2 text-base">أجمالي التكلفة:</span>
                <span className="text-Grey500 mx-2">15.00</span>
                <span className="text-lg font-bold">10.56 </span>
                <SaudiRiyal />
              </div>
              <Button
                onClick={() =>
                  setActiveStep((prev) => (prev < 3 ? prev + 1 : prev))
                }
                className="text-base!"
                icon={<ChevronLeft className="w-5! h-5!" />}
              >
                {activeStep === 3 ? "تأكيد الحجز" : "التالي"}
              </Button>
            </div>
            <Separator className="my-3" />
            <StepContent activeStep={activeStep} />
          </div>
          <div className="w-1/4">
            <div className="">
              <CarsCard
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
