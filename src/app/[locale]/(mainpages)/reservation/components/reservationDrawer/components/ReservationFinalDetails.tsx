import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useMemo } from "react";
import ReservationFinalDetailsItem from "./ReservationFinalDetailsItem";
import { Percent } from "lucide-react";
import { Skeleton } from "@/app/(components)/ui/skeleton";

import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

type ReservationFinalDetailsProps = {
  data?: CalculateQuotePriceResponse;
  isCalculating?: boolean;
};

const ReservationFinalDetails = ({
  data: reservationData,
  isCalculating,
}: ReservationFinalDetailsProps) => {
  const { formData, services: allServices } = useBookedCarDetailsStore();

  const rentalDays = useMemo(() => {
    if (formData.fromDate && formData.toDate) {
      const normalizedFromDate = formatLocalDateTime(formData.fromDate);
      const normalizedToDate = formatLocalDateTime(formData.toDate);
      if (!normalizedFromDate || !normalizedToDate) return 1;

      const fromDate = new Date(normalizedFromDate);
      const toDate = new Date(normalizedToDate);
      if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()))
        return 1;

      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  }, [formData.fromDate, formData.toDate]);

  return (
    <div className="flex flex-col gap-6">
      <ReservationFinalDetailsItem
        itemHeader="تكلفة مدة الإيجار:"
        items={[
          {
            label: "المجموع الفرعي (غير شامل الضريبة)",
            isCalculating: isCalculating,
            value: formatPrice(reservationData?.basePrice || 0),
          },
        ]}
      />

      <ReservationFinalDetailsItem
        itemHeader="تكلفة الخدمات الإضافية:"
        items={[
          {
            isAvailable: (reservationData?.servicesPrice ?? 0) !== 0,
            label: "خدمات اضافية",
            value: formatPrice(reservationData?.servicesPrice || 0),
          },
          {
            isAvailable: (reservationData?.driverPrice ?? 0) !== 0,
            label: "خدمة سائق",
            value: formatPrice(reservationData?.driverPrice || 0),
          },
          {
            isAvailable: (reservationData?.extraKmPrice ?? 0) !== 0,
            label: "رسوم الكيلومترات الاضافية",
            value: formatPrice(reservationData?.extraKmPrice || 0),
          },
          {
            isAvailable: (reservationData?.pickupFee ?? 0) !== 0,
            label: "رسوم استلام",
            value: formatPrice(reservationData?.pickupFee || 0),
          },
          {
            isAvailable: (reservationData?.deliveryFee ?? 0) !== 0,
            label: "رسوم التسليم",
            value: formatPrice(reservationData?.deliveryFee || 0),
          },
        ]}
      />

      <ReservationFinalDetailsItem
        offer
        itemHeader="الخصومات و العروض:"
        items={[
          {
            label: `خصم:`,
            isAvailable:
              !!reservationData && reservationData.businessDiscount !== null,
            value: (
              <span dir="ltr">
                -{formatPrice(reservationData?.businessDiscount || 0)}
              </span>
            ),
          },
          {
            label: `خصم عرض ال ( ${rentalDays} يوم )`,
            isAvailable:
              !!reservationData && reservationData.carDaysDiscount !== 0,
            value: (
              <span dir="ltr">
                -{formatPrice(reservationData?.carDaysDiscount || 0)}
              </span>
            ),
          },
          {
            label: "كود الخصم",
            isAvailable: (reservationData?.promoDiscount ?? 0) !== 0,
            value: (
              <span dir="ltr" className="p-1 rounded-lg">
                <span>-</span>
                {formatPrice(reservationData?.promoDiscount || 0)}
              </span>
            ),
            icon:
              formData.promoData?.codeType === 1 ? (
                <span className="text-sm font-bold">
                  <Percent className="h-5 w-5" />
                </span>
              ) : undefined,
          },
          {
            label: "خصم النقاط",
            isAvailable: (reservationData?.pointsDiscount ?? 0) !== 0,
            value: (
              <span dir="ltr" className="p-1 rounded-lg">
                -{formatPrice(reservationData?.pointsDiscount || 0)}
              </span>
            ),
          },
        ]}
      />

      <ReservationFinalDetailsItem
        showSeparator
        itemHeader={""}
        items={[
          {
            label: "إجمالي المبلغ (غير شامل الضريبة)",
            value: formatPrice(reservationData?.totalBeforeTax || 0),
          },
          {
            label: "قيمة الضريبة",
            value: formatPrice(reservationData?.taxValue || 0),
          },
        ]}
      />
    </div>
  );
};

export default ReservationFinalDetails;
