import { cn } from "@/lib/utils";
import PaymentGateway from "../PaymentGateway";

type PaymentMethodsProps = {
  isRTL?: boolean;
  reservationId?: number | null;
};

const PaymentMethods = ({
  isRTL = false,
  reservationId = null,
}: PaymentMethodsProps) => {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        "animate-in fade-in duration-300 ease-out",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
        isRTL ? "slide-in-from-right" : "slide-in-from-left",
      )}
    >
      {reservationId != null ? (
        <div className="px-4 pt-3 text-sm sm:px-6">
          Reservation id: {reservationId}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 sm:px-6">
        <PaymentGateway />
      </div>
    </div>
  );
};

export default PaymentMethods;
