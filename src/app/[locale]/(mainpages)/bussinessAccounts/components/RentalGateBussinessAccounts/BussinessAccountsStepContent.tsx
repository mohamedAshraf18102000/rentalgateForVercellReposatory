"use client";
import { useStepAnimation } from "@/app/(components)/rentalStepper/hooks/useStepAnimation";
import ResponsiblePersonForm from "./forms/ResponsiblePersonForm";
import CompanyInfoForm from "./forms/CompanyInfoForm";
import NotesForm from "./forms/NotesForm";

interface StepContentProps {
  activeStep: number;
}

const stepData = [
  {
    step: 1,
    colorClass: "step-color-1",
    label: "الخطوة الأولى",
    content: <ResponsiblePersonForm />,
  },
  {
    step: 2,
    colorClass: "step-color-2",
    label: "الخطوة الثانية",
    content: <CompanyInfoForm />,
  },
  {
    step: 3,
    colorClass: "step-color-3",
    label: "الخطوة الثالثة",
    content: <NotesForm />,
  },
];

const BussinessAccountsStepContent = ({ activeStep }: StepContentProps) => {
  const { displayStep, animationClass } = useStepAnimation(activeStep);
  const current = stepData.find((s) => s.step === displayStep);
  if (!current) return null;

  return (
    <div className={`${animationClass}`}>
      <div>{current.content}</div>
    </div>
  );
};

export default BussinessAccountsStepContent;
