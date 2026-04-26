import { useStepAnimation } from "@/app/(components)/rentalStepper/hooks/useStepAnimation";
import ResponsiblePersonForm from "./forms/ResponsiblePersonForm";
import CompanyInfoForm from "./forms/CompanyInfoForm";
import NotesForm from "./forms/NotesForm";
import { useTranslations } from "next-intl";

interface StepContentProps {
  activeStep: number;
}

const BussinessAccountsStepContent = ({ activeStep }: StepContentProps) => {
  const t = useTranslations("companyQuotation");
  const stepData = [
    {
      step: 1,
      colorClass: "step-color-1",
      label: t("businessAccount.steps.first"),
      content: <ResponsiblePersonForm />,
    },
    {
      step: 2,
      colorClass: "step-color-2",
      label: t("businessAccount.steps.second"),
      content: <CompanyInfoForm step={1} />,
    },
    {
      step: 3,
      colorClass: "step-color-2",
      label: t("businessAccount.steps.second"),
      content: <CompanyInfoForm step={2} />,
    },
    {
      step: 4,
      colorClass: "step-color-3",
      label: t("businessAccount.steps.third"),
      content: <NotesForm />,
    },
  ];

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
