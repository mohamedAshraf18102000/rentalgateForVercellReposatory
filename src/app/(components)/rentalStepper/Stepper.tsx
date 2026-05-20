import { cn } from "@/lib/utils";

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
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 rounded-t-lg border-b-[3px] border-Grey500 bg-transparent px-4 py-3.5 transition-[border-color,background] duration-[250ms] ease-in-out hover:border-gray-700 hover:bg-white/5",
        isActive && "border-primary",
      )}
    >
      <div
        className={cn(
          "flex size-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-Grey500 text-sm font-black text-white transition-[background,transform,box-shadow] duration-[250ms] ease-in-out group-hover:scale-105 sm:size-12 sm:min-w-12 sm:text-[1.15rem] lg:size-[52px] lg:min-w-[52px] lg:text-[1.3rem]",
          isActive &&
            "scale-[1.08] bg-primary shadow-[0_0_0_4px_rgba(0,0,0,0.1)] animate-circle-pop-in",
        )}
      >
        {stepNum}
      </div>
      <div>
        <p
          className={cn(
            "text-[0.5rem] font-bold leading-[1.4] text-Grey500 transition-colors duration-[250ms] sm:text-[0.9rem] lg:text-[0.95rem]",
            isActive && "text-primary",
          )}
        >
          {title}
        </p>
        <p className="mt-[3px] text-[0.72rem] text-gray-500 sm:text-[0.78rem] lg:text-[0.8rem]">
          {""}
        </p>
      </div>
    </div>
  );
};

export default Stepper;
