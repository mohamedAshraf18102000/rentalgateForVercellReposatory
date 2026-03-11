"use client";
import WrapperContainer from "@/app/(components)/wrapperContainer/WrapperContainer";
import { useState, FormEvent } from "react";
import Stepper from "../../../(components)/rentalStepper/Stepper";
import BussinessAccountsStepContent from "./components/RentalGateBussinessAccounts/BussinessAccountsStepContent";
import BussinessAccountFeatures from "./components/RentalGateBussinessAccounts/BussinessAccountFeatures";
import SuccessDialoge from "./components/dialog/SuccessDialoge";
import { Button } from "@/app/(components)";
import { ChevronLeft } from "lucide-react";

const page = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsSuccessDialogOpen(true);
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
          isActive={activeStep === 2 || activeStep === 3}
          onClick={() => setActiveStep(2)}
        />
        <Stepper
          stepNum="3"
          title="الملاحظات"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 4}
          onClick={() => setActiveStep(4)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="rounded-2xl border-2 border-white overflow-hidden h-[420px]">
          <div className=" bg-[url(/bussinesAccounts/img1.png)] bg-cover bg-no-repeat p-6 h-full flex flex-col">
            <h6 className="font-bold text-2xl">ماهو حساب الأعمال🤔؟!!</h6>
            <p className="text-lg">
              هو حساب مصمم خصيصًا للشركات وأصحاب الأعمال
            </p>
            <form
              className="w-1/2 flex flex-col flex-1 mt-4"
              onSubmit={handleNextStep}
            >
              <div className="flex-1 overflow-y-auto pr-2">
                <BussinessAccountsStepContent activeStep={activeStep} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  className="border border-Grey600 text-primary bg-white! hover:bg-none text-base! hover:bg-Grey200! transition-all duration-300"
                  icon={<ChevronLeft />}
                >
                  {activeStep !== 4 ? "الخطوة التالية" : "انضم الأن!"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <BussinessAccountFeatures />
        </div>
      </div>
      <SuccessDialoge
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      />
    </WrapperContainer>
  );
};

export default page;
