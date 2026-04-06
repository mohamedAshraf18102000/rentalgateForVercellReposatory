"use client";
import { useState, FormEvent } from "react";
import { Button } from "@/app/(components)";
import { ChevronLeft } from "lucide-react";
import Stepper from "@/app/(components)/rentalStepper/Stepper";
import BussinessAccountsStepContent from "./RentalGateBussinessAccounts/BussinessAccountsStepContent";
import BussinessAccountFeatures from "./RentalGateBussinessAccounts/BussinessAccountFeatures";
import SuccessDialoge from "./dialog/SuccessDialoge";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateBusinessAccountMutation } from "@/services/bussinessAccounts/bussinissAccounts.service";
import { CreateBusinessAccountPayload } from "@/types/bussinessAccounts/bussinessAccounts";
import { createBusinessAccountSchema } from "@/schemas/bussinessAccountsSchema";

interface BussinessAccountsContentProps {
  withOutStepper?: boolean;
}

const BussinessAccountsContent = ({
  withOutStepper = false,
}: BussinessAccountsContentProps) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);

  const methods = useForm<CreateBusinessAccountPayload>({
    resolver: zodResolver(createBusinessAccountSchema),
    defaultValues: {
      responsableName: "",
      responsableMobile: "",
      companyName: "",
      empsNumber: 0,
      taxImage: "",
      registrationImage: "",
      notes: "",
      discountPercentage: 0,
      registrationNumber: "",
      taxNumber: "",
    },
    mode: "onBlur",
  });

  const { trigger, handleSubmit, reset } = methods;

  const { mutate, isPending } = useCreateBusinessAccountMutation();

  const handleNextStep = async (e: FormEvent) => {
    e.preventDefault();
    let fieldsToValidate: (keyof CreateBusinessAccountPayload)[] = [];

    if (activeStep === 1) {
      fieldsToValidate = ["responsableName", "responsableMobile"];
    } else if (activeStep === 2) {
      fieldsToValidate = ["companyName", "empsNumber"];
    } else if (activeStep === 3) {
      fieldsToValidate = ["taxImage", "registrationImage"];
    } else if (activeStep === 4) {
      fieldsToValidate = ["notes"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (activeStep < 4) {
        setActiveStep((prev) => prev + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = (data: CreateBusinessAccountPayload) => {
    mutate(data, {
      onSuccess: () => {
        setActiveStep(1);
        setIsSuccessDialogOpen(true);
        reset();
      },
      onError: (error) => {
        console.error("Failed to create business account", error);
      },
    });
  };

  return (
    <>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 ${
          withOutStepper ? "hidden" : ""
        }`}
      >
        <Stepper
          stepNum="1"
          title="بيانات المسئول"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 1}
          onClick={async () => {
            if (activeStep > 1) setActiveStep(1);
          }}
        />
        <Stepper
          stepNum="2"
          title="بيانات الشركة"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 2 || activeStep === 3}
          onClick={async () => {
            if (activeStep > 2) {
              const isStep1Valid = await trigger([
                "responsableName",
                "responsableMobile",
              ]);
              if (isStep1Valid) setActiveStep(2);
            }
          }}
        />
        <Stepper
          stepNum="3"
          title="الملاحظات"
          description="كان لوريم إيبسوم ولايزال المعيار للنص"
          isActive={activeStep === 4}
          onClick={async () => {
            if (activeStep > 4) setActiveStep(4);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 mt-8 lg:mt-10 relative">
        <div className="rounded-2xl border-2 border-white overflow-hidden min-h-[450px] lg:h-[420px]">
          <div className=" bg-[url(/bussinesAccounts/img1.png)] bg-cover bg-no-repeat p-4 md:p-6 h-full flex flex-col">
            <h6 className="font-bold text-xl md:text-2xl">
              ماهو حساب الأعمال🤔؟!!
            </h6>
            <p className="text-base md:text-lg">
              هو حساب مصمم خصيصًا للشركات وأصحاب الأعمال
            </p>
            <FormProvider {...methods}>
              <form
                className="w-full md:w-3/4 lg:w-1/2 flex flex-col flex-1 mt-4"
                onSubmit={handleNextStep}
              >
                <div className="flex-1 overflow-y-auto pr-2">
                  <BussinessAccountsStepContent activeStep={activeStep} />
                </div>
                <div className="mt-4 flex justify-center md:justify-end">
                  <Button
                    type="submit"
                    className="border border-Grey600 text-primary bg-white! hover:bg-none text-sm! md:text-base! hover:bg-Grey200! transition-all duration-300 w-full md:w-auto"
                    icon={<ChevronLeft />}
                    loading={isPending}
                  >
                    {activeStep !== 4 ? "الخطوة التالية" : "انضم الأن!"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl h-full">
          <BussinessAccountFeatures />
        </div>
      </div>
      <SuccessDialoge
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      />
    </>
  );
};

export default BussinessAccountsContent;
