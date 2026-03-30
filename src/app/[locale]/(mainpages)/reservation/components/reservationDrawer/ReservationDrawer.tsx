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

type ReservationDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ReservationDrawer = ({ open, onOpenChange }: ReservationDrawerProps) => {
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
      <SheetContent dir="rtl" className="flex flex-col p-0">
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
              <Discounts />
            </div>
            <div className="mt-6">
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
              <span className="mx-1">500</span>
              <SaudiRiyal className="h-6! w-6!" />
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReservationDrawer;
