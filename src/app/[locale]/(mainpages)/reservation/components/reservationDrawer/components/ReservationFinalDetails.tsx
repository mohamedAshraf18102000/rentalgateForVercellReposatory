import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useMemo } from "react";
import ReservationFinalDetailsItem from "./ReservationFinalDetailsItem";
import { Percent } from "lucide-react";

const ReservationFinalDetails = () => {
  const { formData, services: allServices } = useBookedCarDetailsStore();

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
            label: `إجمالي مدة الإيجار (${rentalDays} يوم)`,
            value: formatPrice(formData.price),
          },
        ]}
      />

      {(selectedServices.length > 0 ||
        formData.extraKmType === "UNLIMITED") && (
        <ReservationFinalDetailsItem
          itemHeader="تكلفة الخدمات الإضافية:"
          items={[
            ...selectedServices.map((s) => ({
              label: s.serviceArabicName,
              value: formatPrice(s.price),
            })),
            ...(formData.extraKmType === "UNLIMITED"
              ? [
                  {
                    label: "كيلومترات لا نهائي",
                    value: formatPrice(formData.carDetails?.unlimitedKmPrice),
                  },
                ]
              : []),
          ]}
        />
      )}

      <ReservationFinalDetailsItem
        offer
        itemHeader="الخصومات و العروض:"
        items={[
          {
            label: `خصم عرض ال ( ${rentalDays} يوم )`,
            isAvailable:
              !!formData.originalPrice &&
              !!formData.price &&
              formData.originalPrice > formData.price,
            value: (
              <>
                <span dir="ltr" className="p-1 rounded-lg">
                  {formatPrice(
                    (formData.originalPrice ?? 0) - (formData.price ?? 0),
                  )}
                </span>
              </>
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
