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
import { useLocale } from "next-intl";

interface BussinessAccountsContentClientProps {
  withOutStepper?: boolean;
  copy: {
    stepper: {
      responsible: { title: string; description: string };
      company: { title: string; description: string };
      notes: { title: string; description: string };
    };
    hero: { title: string; description: string };
    actions: { nextStep: string; joinNow: string };
  };
}

const BussinessAccountsContentClient = ({
  withOutStepper = false,
  copy,
}: BussinessAccountsContentClientProps) => {
  const locale = useLocale();
  const isRtl = locale === "ar";

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
        className={`w-full min-w-0 max-w-full grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 ${
          withOutStepper ? "hidden" : ""
        }`}
      >
        <Stepper
          stepNum="1"
          title={copy.stepper.responsible.title}
          description={copy.stepper.responsible.description}
          isActive={activeStep === 1}
          onClick={async () => {
            if (activeStep > 1) setActiveStep(1);
          }}
        />
        <Stepper
          stepNum="2"
          title={copy.stepper.company.title}
          description={copy.stepper.company.description}
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
          title={copy.stepper.notes.title}
          description={copy.stepper.notes.description}
          isActive={activeStep === 4}
          onClick={async () => {
            if (activeStep > 4) setActiveStep(4);
          }}
        />
      </div>

      <div className="relative mt-6 grid w-full min-w-0 max-w-full grid-cols-1 gap-6 sm:mt-8 lg:mt-10 lg:grid-cols-2 lg:gap-5 xl:gap-6">
        <div
          className={`flex flex-col rounded-2xl border-2 border-white min-h-88 sm:min-h-96 lg:min-h-104 lg:max-h-[min(90vh,36rem)] ${
            activeStep === 1 ? "overflow-visible" : "overflow-hidden"
          }`}
        >
          <div
            className={`flex min-h-0 flex-1 flex-col ${isRtl ? "bg-[url(/bussinesAccounts/img1.png)]" : "bg-[url(/bussinesAccounts/img1_LTR.png)]"} bg-cover bg-center bg-no-repeat p-4 sm:p-5 md:p-6`}
          >
            <h6 className="text-balance font-bold text-lg sm:text-xl md:text-2xl">
              {copy.hero.title}
            </h6>
            <p className="mt-1 text-pretty text-sm leading-relaxed sm:text-base md:text-lg">
              {copy.hero.description}
            </p>
            <FormProvider {...methods}>
              <form
                className="mt-3 flex min-h-0 w-full max-w-full flex-1 flex-col sm:mt-4 md:max-w-[90%] lg:max-w-[min(100%,28rem)]"
                onSubmit={handleNextStep}
              >
                <div
                  className={`min-h-0 flex-1 overscroll-y-contain px-0.5 pe-2 [-webkit-overflow-scrolling:touch] ${
                    activeStep === 1 ? "overflow-visible" : "overflow-y-auto"
                  }`}
                >
                  <BussinessAccountsStepContent activeStep={activeStep} />
                </div>
                <div className="mt-3 flex shrink-0 justify-center sm:mt-4 sm:justify-end">
                  <Button
                    variant={"ghost"}
                    type="submit"
                    className="border border-Grey600 text-primary bg-white! hover:bg-none text-sm! sm:text-base! hover:bg-Grey200! transition-all duration-300 w-full min-h-11 sm:min-h-0 sm:w-auto sm:min-w-40"
                    icon={<ChevronLeft />}
                    loading={isPending}
                  >
                    {activeStep !== 4
                      ? copy.actions.nextStep
                      : copy.actions.joinNow}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>

        <div className="h-full min-h-0 rounded-2xl bg-white p-4 shadow-xl sm:p-5 md:p-6">
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

export default BussinessAccountsContentClient;
