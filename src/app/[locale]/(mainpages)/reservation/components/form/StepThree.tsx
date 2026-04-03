"use client";

import { Control, FieldErrors, useController } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import SelectableServiceCard from "@/app/(components)/customCards/SelectableServiceCard";
import SelectableServiceDriverCard from "@/app/(components)/customCards/SelectableServiceDriverCard";
import { Flame } from "lucide-react";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const StepThree = ({ control, errors }: StepThreeProps) => {
  const services = useBookedCarDetailsStore((s) => s.services);
  const formdata = useBookedCarDetailsStore((s) => s.formData);

  const {
    field: { value: selectedIds, onChange },
  } = useController({
    name: "services",
    control,
    defaultValue: [],
  });

  const toggleService = (id: string) => {
    const current = selectedIds ?? [];
    if (current.includes(id)) {
      onChange(current.filter((s) => s !== id));
    } else {
      onChange([...current, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          الخدمات الإضافية
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          اختر ما يناسبك من الخدمات لتجربة قيادة متكاملة ومميزة
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">
            لا توجد خدمات إضافية متاحة لهذه السيارة حالياً
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {formdata.carDetails?.unlimitedKmPrice !== 0 && (
            <SelectableServiceCard
              service={
                {
                  serviceArabicName: "عدد كيلومترات لا نهائي",
                  notes:
                    "مع الكيلومترات غير المحدودة، استكشف أكثر وسافر أبعد بدون قلق من العداد.",
                  price: formdata.carDetails?.unlimitedKmPrice,
                  originalPrice: 0,
                  percentage: 0,
                } as any
              }
              selected={false}
              badge={
                <p className="text-sm p-2 bg-StatusBrownBG rounded-[8px] text-StatusBrown200 font-bold flex items-center gap-1">
                  <Flame />
                  <span>قيادة بلا نهاية</span>
                </p>
              }
              onToggle={() => console.log("clicked")}
            />
          )}
          {services.map((service) => {
            const id = String(service.csId);
            return (
              <SelectableServiceCard
                key={service.csId}
                service={service}
                selected={(selectedIds ?? []).includes(id)}
                onToggle={() => toggleService(id)}
              />
            );
          })}

          <SelectableServiceDriverCard badge="داخل المدينة" />
          <SelectableServiceDriverCard badge="خارج المدينة" />
        </div>
      )}

      {errors.services && (
        <p className="text-sm text-red-500">
          {errors.services.message as string}
        </p>
      )}
    </div>
  );
};

export default StepThree;
