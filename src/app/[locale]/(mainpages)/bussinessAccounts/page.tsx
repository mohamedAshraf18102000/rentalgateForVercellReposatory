"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useState, FormEvent } from "react";
import Stepper from "../../../(components)/rentalStepper/Stepper";
import BussinessAccountsStepContent from "./components/RentalGateBussinessAccounts/BussinessAccountsStepContent";
import BussinessAccountFeatures from "./components/RentalGateBussinessAccounts/BussinessAccountFeatures";
import { Button } from "@/app/(components)";
import { ChevronLeft } from "lucide-react";

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (activeStep < 3) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final submission logic
      console.log("Form submitted!");
    }
  };

  return (
    <WrapperContainer exceedNav>
      <div className="w-full grid grid-cols-3 gap-5">
        <Stepper
          stepNum="1"
          title="بيانات المسئول"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 1}
          onClick={() => setActiveStep(1)}
        />
        <Stepper
          stepNum="2"
          title="بيانات الشركة"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 2}
          onClick={() => setActiveStep(2)}
        />
        <Stepper
          stepNum="3"
          title="الملاحظات"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 3}
          onClick={() => setActiveStep(3)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="rounded-2xl border-2 border-white overflow-hidden">
          <div className=" bg-[url(/bussinesAccounts/img1.png)] bg-cover bg-no-repeat p-6">
            <h6 className="font-bold text-2xl">ماهو حساب الأعمال🤔؟!!</h6>
            <p className="text-lg">
              هو حساب مصمم خصيصًا للشركات وأصحاب الأعمال
            </p>
            <form className="w-1/2" onSubmit={handleNextStep}>
              <BussinessAccountsStepContent activeStep={activeStep} />
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  className="border border-Grey600 text-primary bg-white! hover:bg-none text-base! hover:bg-Grey200! transition-all duration-300"
                  icon={<ChevronLeft />}
                >
                  {activeStep !== 3 ? "الخطوة التالية" : "انضم الأن!"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <BussinessAccountFeatures />
        </div>
      </div>
    </WrapperContainer>
  );
};

export default page;
