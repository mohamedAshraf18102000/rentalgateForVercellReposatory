import { useMemo } from "react";
import { Button } from "@/app/(components)/ui/button";
import { Separator } from "@/app/(components)/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/(components)/ui/sheet";
import { Funnel, SaudiRiyal } from "lucide-react";
import ReservationFinalDetails from "./components/ReservationFinalDetails";
import Coupon from "./components/Coupon";
import Discounts from "./components/Discounts";
import WalletBalance from "./components/WalletBalance";
import PaymentGateway from "./components/PaymentGateway";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { applyPromoCodeValueChecker } from "@/lib/utils/promoCodeValueChecker";

type ReservationDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ReservationDrawer = ({ open, onOpenChange }: ReservationDrawerProps) => {
  const { formData, services: allServices } = useBookedCarDetailsStore();

  const servicesCost = useMemo(() => {
    return allServices
      .filter((s) => formData.services.includes(s.csId))
      .reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [allServices, formData.services]);

  const totalToPay = (formData.price || 0) + servicesCost;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger dir="rtl" asChild>
        <button
          type="button"
          className="border-2 border-Grey400 rounded-xl p-1.5 text-base font-bold flex items-center gap-2"
        >
          <div className="flex items-center gap-2 relative px-2">
            <Funnel />
            <span>تصفية </span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        dir="rtl"
        className="flex flex-col p-0 "
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-start! mt-10 px-6 ">
          <SheetTitle>إتمام الدفع</SheetTitle>
          <Separator className="my-2" />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="w-full p-2">
            <h1 className="text-base font-bold">تفاصيل الحجز</h1>
            <div className="bg-Grey100 p-3 mt-3 rounded-xl">
              <ReservationFinalDetails />
            </div>
            <div className="mt-6">
              <Coupon />
            </div>
            <div className="mt-6">
              <Separator className="my-2" />
            </div>
            <div className="flex justify-between items-center bg-red-100 py-2 px-2 rounded-lg">
              <p className="text-base font-bold">
                المجموع: هنا معمول apply علي قيمة وهمية{" "}
              </p>
              <p className="text-base font-bold">
                {applyPromoCodeValueChecker(
                  formData.price || 0,
                  formData.promoData?.codeType || 1,
                  formData.promoData?.discountValue || 0,
                )}
              </p>
            </div>
            <div className="mt-6">
              <Separator className="my-2" />
            </div>
            <div className="mt-6">
              <Discounts />
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
              <span className="mx-1">{formatPrice(totalToPay)}</span>
              <SaudiRiyal className="h-6! w-6!" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReservationDrawer;
