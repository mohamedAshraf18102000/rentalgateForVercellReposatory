import { Button } from "@/app/(components)/ui/button";
import { Card, CardContent } from "@/app/(components)/ui/card";
import {
  ChevronDown,
  ChevronDownIcon,
  Percent,
  SaudiRiyal,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/(components)/ui/collapsible";
import { Separator } from "@/app/(components)/ui/separator";
import { ReservationDetailsResponse } from "@/types/myBookings/BookingDetails";
import { useTranslations } from "next-intl";
import ReservationFinalDetailsItem from "@/app/[locale]/(mainpages)/reservation/components/reservationDrawer/components/ReservationFinalDetailsItem";
import { formatPrice } from "@/lib/utils";

const BookingPaymentDetailsCollapse = ({
  data,
}: {
  data: ReservationDetailsResponse;
}) => {
  const t = useTranslations("common");
  return (
    <Card className="w-full border-0! p-0! mb-3 mt-5">
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
            <div className="w-full">
              <ReservationFinalDetailsItem
                itemHeader="تكلفة مدة الإيجار:"
                largeText
                items={[
                  {
                    isAvailable: data?.basePrice !== 0,
                    label: "المجموع الفرعي (غير شامل الضريبة)",
                    value: formatPrice(data?.basePrice || 0),
                  },
                ]}
              />

              <div className="mt-3">
                <ReservationFinalDetailsItem
                  itemHeader="تكلفة الخدمات الإضافية:"
                  largeText
                  items={[
                    {
                      isAvailable: data?.servicesPrice !== 0,
                      label: "خدمات اضافية",
                      value: formatPrice(data?.servicesPrice || 0),
                    },
                    {
                      isAvailable: (data?.driverPrice ?? 0) !== 0,
                      label: "خدمة سائق",
                      value: formatPrice(data?.driverPrice || 0),
                    },
                    {
                      isAvailable: (data?.extraKmPrice ?? 0) !== 0,
                      label: "رسوم الكيلومترات الاضافية",
                      value: formatPrice(data?.extraKmPrice || 0),
                    },
                    {
                      isAvailable: (data?.receiveFee ?? 0) !== 0,
                      label: "رسوم استلام",
                      value: formatPrice(data?.receiveFee || 0),
                    },
                    {
                      isAvailable: (data?.deliverFee ?? 0) !== 0,
                      label: "رسوم التسليم",
                      value: formatPrice(data?.deliverFee || 0),
                    },
                  ]}
                />
              </div>

              <ReservationFinalDetailsItem
                itemHeader="الخصومات و العروض:"
                largeText
                offer
                items={[
                  {
                    label: `خصم عرض ال ( ${data?.days} يوم )`,
                    isAvailable: data.carDaysDiscount !== 0,
                    value: (
                      <span dir="ltr">
                        -{formatPrice(data?.carDaysDiscount || 0)}
                      </span>
                    ),
                  },
                  {
                    label: "كود الخصم",
                    isAvailable: (data?.promoDiscount ?? 0) !== 0,
                    value: (
                      <span dir="ltr" className="p-1 rounded-lg">
                        <span>-</span>
                        {formatPrice(data?.promoDiscount || 0)}
                      </span>
                    ),
                  },
                  {
                    label: "خصم النقاط",
                    isAvailable: (data?.pointsDiscount ?? 0) !== 0,
                    value: (
                      <span dir="ltr" className="p-1 rounded-lg">
                        -{formatPrice(data?.pointsDiscount || 0)}
                      </span>
                    ),
                  },
                ]}
              />

              <Separator className="mt-3! mb-0!" />

              <ReservationFinalDetailsItem
                largeText
                showSeparator
                itemHeader={""}
                items={[
                  {
                    label: "إجمالي المبلغ (غير شامل الضريبة)",
                    value: formatPrice(data?.totalBeforeTax || 0),
                  },
                  {
                    label: "قيمة الضريبة",
                    value: formatPrice(data?.taxValue || 0),
                  },
                ]}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default BookingPaymentDetailsCollapse;
