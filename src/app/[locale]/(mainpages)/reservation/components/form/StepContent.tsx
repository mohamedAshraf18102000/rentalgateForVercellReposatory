"use client";
import { useStepAnimation } from "../../../../../(components)/rentalStepper/hooks/useStepAnimation";
import ExeclusiveOfferIcon from "@/constants/icons/ExeclusiveOfferIcon";
import { Separator } from "@/app/(components)/ui/separator";
import OffersCard from "@/app/(components)/customCards/OffersCard";

interface StepContentProps {
  activeStep: number;
}

const stepData = [
  {
    step: 1,
    colorClass: "step-color-1",
    label: "الخطوة الأولى",
    content: (
      <>
        <div className="bg-StatusGreen p-2 rounded-xl flex items-center justify-center gap-3 text-StatusDarkGreen">
          <div className="scale-130">
            <ExeclusiveOfferIcon />
          </div>
          <p className="flex gap-1 items-center">
            <span className="text-sm font-extrabold">يومين</span>
            <span>مجانا لأن مدة الأيجار أكثر من</span>
            <span className="text-sm font-extrabold">7 أيام</span>
          </p>
        </div>
        <Separator className="my-2" />
        <div className="mb-6">
          <p className="text-base">عروض رينتال جيت:</p>
          <p className="text-sm text-Grey600 mt-2">
            أختر من أفضل عروض التأجير المضافة حديثاً
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <OffersCard />
          <OffersCard />
          <OffersCard />
        </div>
      </>
    ),
  },
  {
    step: 2,
    colorClass: "step-color-2",
    label: "الخطوة الثانية",
    content: "...",
  },
  {
    step: 3,
    colorClass: "step-color-3",
    label: "الخطوة الثالثة",
    content: "...",
  },
];

const StepContent = ({ activeStep }: StepContentProps) => {
  const { displayStep, animationClass } = useStepAnimation(activeStep);
  const current = stepData.find((s) => s.step === displayStep);
  if (!current) return null;

  return (
    <div className={`${animationClass}`}>
      <div>{current.content}</div>
    </div>
  );
};

export default StepContent;
