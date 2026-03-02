"use client";

import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  subtitle: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  locale?: string;
}

export function Stepper({ steps, currentStep, locale = "ar" }: StepperProps) {
  const isRTL = locale === "ar";

  return (
    <div className="w-full mb-6 sm:mb-8 md:mb-12">
      <div className="relative flex items-start justify-between px-2 sm:px-4 max-w-5xl mx-auto">
        {/* Connection lines background - from first circle center to last circle center */}
        <div 
          className="absolute top-4 sm:top-5 h-px bg-gray-300 z-0 hidden sm:block"
          style={{
            left: `${(1 / steps.length) * 50}%`,
            right: `${(1 / steps.length) * 50}%`,
          }}
        />

        {/* Connection lines progress - from first circle to current step center */}
        {currentStep > 1 && (
          <div
            className="absolute top-4 sm:top-5 h-px bg-black z-0 transition-all duration-300 hidden sm:block"
            style={
              isRTL
                ? {
                    right: `${(1 / steps.length) * 50}%`,
                    width: `${((currentStep - 1) / (steps.length - 1)) * (100 - (100 / steps.length))}%`,
                  }
                : {
                    left: `${(1 / steps.length) * 50}%`,
                    width: `${((currentStep - 1) / (steps.length - 1)) * (100 - (100 / steps.length))}%`,
                  }
            }
          />
        )}

        {/* Steps */}
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex === currentStep;
          const isCompleted = stepIndex < currentStep;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center flex-1 px-1"
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 mb-2 sm:mb-4",
                  isActive || isCompleted
                    ? "bg-black text-white border-0"
                    : "bg-white text-black border border-gray-300"
                )}
              >
                {step.number}
              </div>

              {/* Step content */}
              <div className={cn("w-full", isRTL ? "text-right" : "text-left")}>
                <h3
                  className={cn(
                    "text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 text-center px-1",
                    isActive || isCompleted
                      ? "text-black"
                      : "text-gray-400"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed text-center hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

