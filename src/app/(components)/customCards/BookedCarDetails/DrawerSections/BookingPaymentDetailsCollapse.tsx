import { Button } from "@/app/(components)/ui/button";
import { Card, CardContent } from "@/app/(components)/ui/card";
import { ChevronDown, ChevronDownIcon, SaudiRiyal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/(components)/ui/collapsible";
import { Separator } from "@/app/(components)/ui/separator";

const BookingPaymentDetailsCollapse = () => {
  return (
    <Card className="w-full border-0 mt-2 p-0! mb-3">
      <CardContent className="px-0!">
        <Collapsible className="data-[state=open]:bg-muted border-none! p-2!">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group px-0! text-base! hover:bg-transparent!"
            >
              التفاصيل
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180 w-5! h-5!" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 pt-0 text-sm">
            <div className="w-full text-base">
              <p className="font-bold">تكلفة مدة الإيجار:</p>
              <div className="flex justify-between items-center w-full mt-2">
                <p>سعر الإيجار اليومي</p>
                <div className="flex items-center">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-2">
                <p>سعر الساعات الأضافية</p>
                <div className="flex items-center">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="w-full text-base">
              <p className="font-bold">تكلفة الخدمات</p>
              <div className="flex justify-between items-center w-full mt-2">
                <p>سائق خاص</p>
                <div className="flex items-center">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-2">
                <p>كرسي أطفال</p>
                <div className="flex items-center">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-2">
                <p>تأمين شامل</p>
                <div className="flex items-center">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>
            </div>

            <Separator className="my-3" />
            <div className="w-full text-base">
              <p className="font-bold">الخصومات و العروض</p>

              <div className="flex justify-between items-center w-full mt-2">
                <p>خصم عرض (15%)</p>
                <div className="flex items-center bg-StatusGreen text-StatusDarkGreen p-1 rounded-lg">
                  <span>10.56 </span>
                  <SaudiRiyal />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default BookingPaymentDetailsCollapse;
