import { SaudiRiyal } from "lucide-react";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ReactNode, useMemo } from "react";
import ReservationFinalDetailsItem from "./ReservationFinalDetailsItem";

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
    return allServices.filter((s) =>
      formData.services.includes(String(s.csId)),
    );
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

      {selectedServices.length > 0 && (
        <ReservationFinalDetailsItem
          itemHeader="تكلفة الخدمات الإضافية:"
          items={selectedServices.map((s) => ({
            label: s.serviceArabicName,
            value: formatPrice(s.price),
          }))}
        />
      )}

      {formData.originalPrice &&
        formData.price &&
        formData.originalPrice > formData.price && (
          <ReservationFinalDetailsItem
            offer
            itemHeader="الخصومات و العروض:"
            items={[
              {
                label: `خصم عرض ال ( ${rentalDays} يوم )`,
                value: (
                  <span dir="ltr" className="p-1 rounded-lg">
                    -{formatPrice(formData.originalPrice - formData.price)}
                  </span>
                ),
              },
            ]}
          />
        )}
    </div>
  );
};

export default ReservationFinalDetails;
