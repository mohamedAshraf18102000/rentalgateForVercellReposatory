import { Button } from "@/app/(components)/ui/button";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/(components)/ui/sheet";
import { SaudiRiyal } from "lucide-react";
import ReservationFinalDetails from "./components/ReservationFinalDetails";
import Coupon from "./components/Coupon";
import Discounts from "./components/Discounts";
import WalletBalance from "./components/WalletBalance";
import PaymentGateway from "./components/PaymentGateway";
import { formatPrice } from "@/lib/utils/formatPrice";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { Skeleton } from "@/app/(components)/ui/skeleton";
import ReservationDetailsSkeleton from "./components/ReservationDetailsSkeleton";

type ReservationDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reservationData?: CalculateQuotePriceResponse;
  onCalculateQuote?: () => void;
  isCalculating?: boolean;
};

const ReservationDrawer = ({
  open,
  onOpenChange,
  reservationData,
  onCalculateQuote,
  isCalculating,
}: ReservationDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        dir="rtl"
        className="flex w-full max-w-full flex-col p-0 sm:max-w-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-start! mt-8 px-4 sm:mt-10 sm:px-6">
          <SheetTitle>إتمام الدفع</SheetTitle>
          <Separator className="my-2" />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 sm:px-4">
          <div className="w-full p-1.5 sm:p-2">
            <h1 className="text-base font-bold">تفاصيل الحجز</h1>
            <div className="bg-Grey100 p-3 mt-3 rounded-xl min-h-[500px]">
              {isCalculating ? (
                <ReservationDetailsSkeleton />
              ) : (
                <ReservationFinalDetails
                  data={reservationData}
                  isCalculating={isCalculating}
                />
              )}
            </div>
            <div className="mt-6">
              <Coupon isCalculating={isCalculating} />
            </div>
            <div className="mt-6">
              <Separator className="my-2" />
            </div>
            <div className="mt-6">
              <Discounts isCalculating={isCalculating} />
            </div>
            <div className="mt-6">
              <Separator className="my-2" />
            </div>
            <div className="mt-6 bg-Grey100 rounded-xl">
              <WalletBalance />
            </div>
            <div className="mt-6">
              <Separator className="my-2" />
            </div>
            <div className="mt-6">
              <PaymentGateway />
            </div>
          </div>
        </div>
        <SheetFooter className="border-t-2 p-5 shadow-[0px_-13px_15px_0px_#01250514]">
          <SheetClose asChild>
            <Button
              className="w-full text-lg! flex items-center justify-center"
              type="submit"
            >
              <span> دفع: </span>
              {isCalculating ? (
                <Skeleton className="w-15 h-5" />
              ) : (
                <>
                  <span className="mx-1">
                    {formatPrice(reservationData?.total || 0)}
                  </span>
                  <SaudiRiyal className="h-6! w-6!" />
                </>
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReservationDrawer;
