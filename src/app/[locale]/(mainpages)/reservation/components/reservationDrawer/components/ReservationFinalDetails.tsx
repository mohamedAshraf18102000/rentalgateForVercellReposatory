import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useMemo } from "react";
import ReservationFinalDetailsItem from "./ReservationFinalDetailsItem";
import { Percent } from "lucide-react";

import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { CalculateQuotePriceResponse } from "@/services/calculateQuotePrice/calculateQuotePrice.service";

type ReservationFinalDetailsProps = {
  data?: CalculateQuotePriceResponse;
};

const ReservationFinalDetails = ({
  data: reservationData,
}: ReservationFinalDetailsProps) => {
  const { formData, services: allServices } = useBookedCarDetailsStore();
  console.log("reservationData>>>>", reservationData);

  const rentalDays = useMemo(() => {
    if (formData.fromDate && formData.toDate) {
      const diffTime = Math.abs(
        formData.toDate.getTime() - formData.fromDate.getTime(),
      );
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }
    return 1;
  }, [formData.fromDate, formData.toDate]);

  const selectedServices = useMemo(() => {
    return allServices.filter((s) => formData.services.includes(s.csId));
  }, [allServices, formData.services]);

  return (
    <div className="flex flex-col gap-6">
      <ReservationFinalDetailsItem
        itemHeader="تكلفة مدة الإيجار:"
        items={[
          {
            label: "المجموع الفرعي (غير شامل الضريبة)",
            value: reservationData?.basePrice,
          },
        ]}
      />

      {(selectedServices.length > 0 ||
        formData.extraKmType === "UNLIMITED") && (
        <ReservationFinalDetailsItem
          itemHeader="تكلفة الخدمات الإضافية:"
          items={[
            {
              label: "خدمات اضافية",
              value: formatPrice(reservationData?.servicesPrice || 0),
            },
            {
              label: "خدمة سائق",
              value: formatPrice(reservationData?.driverPrice || 0),
            },
            {
              label: "رسوم استلام",
              value: formatPrice(reservationData?.pickupFee || 0),
            },
            {
              label: "رسوم التسليم",
              value: formatPrice(reservationData?.deliveryFee || 0),
            },
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
      )}

      <ReservationFinalDetailsItem
        offer
        itemHeader="الخصومات و العروض:"
        items={[
          {
            label: `خصم عرض ال ( ${rentalDays} يوم )`,
            // isAvailable:
            //   !!formData.originalPrice &&
            //   !!formData.price &&
            //   formData.originalPrice > formData.price,
            value: (
              <span dir="ltr">
                -{formatPrice(reservationData?.businessDiscount || 0)}
              </span>
            ),
          },
          {
            label: "كود الخصم",
            isAvailable: formData.promoData !== null,
            value: (
              <span dir="ltr" className="p-1 rounded-lg">
                <span>-</span>
                {formData.promoData?.discountValue}
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
            isAvailable: formData.points !== null,
            value: (
              <span dir="ltr" className="p-1 rounded-lg">
                -{formData.points?.value}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ReservationFinalDetails;
