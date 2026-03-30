import { Input } from "@/app/(components)";
import { Button } from "@base-ui/react";
import { ChevronLeft, TicketPercent } from "lucide-react";

const Coupon = () => {
  return (
    <>
      <p className="text-base font-bold mb-2">أدخل كود الخصم:</p>
      <div className="flex items-center gap-8">
        <Input
          startIcon={<TicketPercent />}
          placeholder="أدخل كود الخصم الخاص بك"
          className="h-12! text-sm! bg-Grey100!"
        />
        <Button className="underline underline-offset-2 flex items-center">
          <span>تأكيد</span>
          <ChevronLeft className="h-5 w-5 mt-1" />
        </Button>
      </div>
    </>
  );
};

export default Coupon;
