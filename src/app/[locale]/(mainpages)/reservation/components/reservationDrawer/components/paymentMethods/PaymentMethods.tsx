import { cn } from "@/lib/utils";
import PaymentGateway from "../PaymentGateway";

type PaymentMethodsProps = {
  isRTL?: boolean;
};

const PaymentMethods = ({ isRTL = false }: PaymentMethodsProps) => {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-red-900 px-4 sm:px-6",
        "animate-in fade-in duration-300 ease-out",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
        isRTL ? "slide-in-from-right" : "slide-in-from-left",
      )}
    >
      <div className="mt-3">
        <PaymentGateway />
      </div>
    </div>
  );
};

export default PaymentMethods;
