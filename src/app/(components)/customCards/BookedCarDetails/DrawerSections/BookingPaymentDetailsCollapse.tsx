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
import { useState } from "react";

const BookingPaymentDetailsCollapse = ({
  data,
}: {
  data: ReservationDetailsResponse;
}) => {
  const t = useTranslations("common");
  const [open, setOpen] = useState(true);
  return (
    <Card className="w-full border-0! p-0! mb-3 mt-5">
      <CardContent className="px-0!">
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="data-[state=open]:bg-muted border-none! p-2!"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="group px-0! text-sm md:text-base! hover:bg-transparent!"
            >
              {t("myBookingsDrawer.paymentDetails.detailsButton")}
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180 w-5! h-5!" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 pt-0 text-sm">
            <div className="w-full">
              <ReservationFinalDetailsItem
                itemHeader={t(
                  "myBookingsDrawer.paymentDetails.rentalDurationCostHeader",
                )}
                largeText
                items={[
                  {
                    isAvailable: data?.basePrice !== 0,
                    label: t(
                      "myBookingsDrawer.paymentDetails.subtotalBeforeTaxLabel",
                    ),
                    value: formatPrice(data?.basePrice || 0),
                  },
                ]}
              />

              <div className="mt-3">
                <ReservationFinalDetailsItem
                  itemHeader={t(
                    "myBookingsDrawer.paymentDetails.additionalServicesCostHeader",
                  )}
                  largeText
                  items={[
                    {
                      isAvailable: data?.servicesPrice !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.additionalServicesLabel",
                      ),
                      value: formatPrice(data?.servicesPrice || 0),
                    },
                    {
                      isAvailable: (data?.driverPrice ?? 0) !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.driverServiceLabel",
                      ),
                      value: formatPrice(data?.driverPrice || 0),
                    },
                    {
                      isAvailable: (data?.extraKmPrice ?? 0) !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.extraKilometersFeeLabel",
                      ),
                      value: formatPrice(data?.extraKmPrice || 0),
                    },
                    {
                      isAvailable: (data?.receiveFee ?? 0) !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.pickupFeeLabel",
                      ),
                      value: formatPrice(data?.receiveFee || 0),
                    },
                    {
                      isAvailable: (data?.deliverFee ?? 0) !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.deliveryFeeLabel",
                      ),
                      value: formatPrice(data?.deliverFee || 0),
                    },
                    {
                      isAvailable: (data?.invoiceFee ?? 0) !== 0,
                      label: t(
                        "myBookingsDrawer.paymentDetails.rentalAgreementFeeLabel",
                      ),
                      value: formatPrice(data?.invoiceFee || 0),
                    },
                  ]}
                />
              </div>

              <ReservationFinalDetailsItem
                itemHeader={t(
                  "myBookingsDrawer.paymentDetails.discountsAndOffersHeader",
                )}
                largeText
                offer
                items={[
                  {
                    label: t(
                      "myBookingsDrawer.paymentDetails.rentalDaysOfferDiscountLabel",
                      {
                        days: data?.days ?? 0,
                      },
                    ),
                    isAvailable: data.carDaysDiscount !== 0,
                    value: (
                      <span dir="ltr">
                        -{formatPrice(data?.carDaysDiscount || 0)}
                      </span>
                    ),
                  },
                  {
                    label: t("myBookingsDrawer.paymentDetails.promoCodeLabel"),
                    isAvailable: (data?.promoDiscount ?? 0) !== 0,
                    value: (
                      <span dir="ltr" className="p-1 rounded-lg">
                        <span>-</span>
                        {formatPrice(data?.promoDiscount || 0)}
                      </span>
                    ),
                  },
                  {
                    label: t(
                      "myBookingsDrawer.paymentDetails.pointsDiscountLabel",
                    ),
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
                    label: t(
                      "myBookingsDrawer.paymentDetails.totalBeforeTaxLabel",
                    ),
                    value: formatPrice(data?.totalBeforeTax || 0),
                  },
                  {
                    label: t("myBookingsDrawer.paymentDetails.taxValueLabel"),
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
