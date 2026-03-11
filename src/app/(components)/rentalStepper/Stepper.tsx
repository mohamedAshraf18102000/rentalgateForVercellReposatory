import "./stepper.animations.css";

interface StepperData {
  stepNum: string;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

const Stepper = ({
  title,
  description,
  stepNum,
  isActive,
  onClick,
}: StepperData) => {
  return (
    <div
      onClick={onClick}
      className={`stepper-item ${isActive ? "active" : ""}`}
    >
      <div className="stepper-circle">{stepNum}</div>
      <div>
        <p className="stepper-title">{title}</p>
        <p className="stepper-description">{description}</p>
      </div>
    </div>
  );
};

export default Stepper;
