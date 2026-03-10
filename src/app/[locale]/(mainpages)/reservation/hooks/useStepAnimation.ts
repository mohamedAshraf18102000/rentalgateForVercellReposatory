import { useState, useEffect } from "react";

export const useStepAnimation = (activeStep: number) => {
  const [displayStep, setDisplayStep] = useState(activeStep);
  const [animationClass, setAnimationClass] = useState("step-fade-in");

  useEffect(() => {
    setAnimationClass("step-fade-out");

    const timeout = setTimeout(() => {
      setDisplayStep(activeStep);
      setAnimationClass("step-fade-in");
    }, 200);

    return () => clearTimeout(timeout);
  }, [activeStep]);

  return { displayStep, animationClass };
};
