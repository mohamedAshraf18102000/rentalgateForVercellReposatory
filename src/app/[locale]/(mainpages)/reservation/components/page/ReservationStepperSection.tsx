import { Check } from "lucide-react";
import Stepper from "@/app/(components)/rentalStepper/Stepper";
import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";

const CheckIcon = () => <Check className="text-green-400" />;

interface ReservationStepperSectionProps {
  activeStep: number;
  isStepTwoSkipped: boolean;
  formData: ReservationFormData;
  stepOneTitle: string;
  stepTwoTitle: string;
  stepTwoDescription: string;
  stepTwoSkippedLabel: string;
  stepThreeTitle: string;
  stepThreeDescription: string;
  onStepperClick: (step: number) => void;
}

const ReservationStepperSection = ({
  activeStep,
  isStepTwoSkipped,
  formData,
  stepOneTitle,
  stepTwoTitle,
  stepTwoDescription,
  stepTwoSkippedLabel,
  stepThreeTitle,
  stepThreeDescription,
  onStepperClick,
}: ReservationStepperSectionProps) => {
  return (
    <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
      <Stepper
        stepNum={activeStep > 1 ? <CheckIcon /> : "1"}
        title={stepOneTitle}
        description={`${formData.pickupName} - ${formData.carReturnLocation}`}
        isActive={activeStep === 1}
        onClick={() => onStepperClick(1)}
      />
      <Stepper
        stepNum={isStepTwoSkipped ? <CheckIcon /> : "2"}
        title={stepTwoTitle}
        description={isStepTwoSkipped ? "" : stepTwoDescription}
        secondaryLabel={isStepTwoSkipped ? stepTwoSkippedLabel : undefined}
        isActive={activeStep === 2}
        nonInteractive={isStepTwoSkipped}
        onClick={() => onStepperClick(2)}
      />
      <Stepper
        stepNum="3"
        title={stepThreeTitle}
        description={stepThreeDescription}
        isActive={activeStep === 3}
        onClick={() => onStepperClick(3)}
      />
    </div>
  );
};

export default ReservationStepperSection;
