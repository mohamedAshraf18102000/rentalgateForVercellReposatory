import WalletBalance from "./WalletBalance";
import { Button } from "@/app/(components)/ui/button";

const PaymentGateway = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-red-900">
      <div className="min-h-0 flex-1 overflow-y-auto pt-1">
        <div className="bg-Grey100 rounded-xl">
          <WalletBalance />
        </div>
      </div>
      <div className="sticky bottom-0 shrink-0 border-t-2 bg-background p-5 shadow-[0px_-13px_15px_0px_#01250514]">
        <Button
          className="w-full text-lg! flex items-center justify-center"
          type="button"
        >
          <span>استكمال الدفع</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentGateway;
