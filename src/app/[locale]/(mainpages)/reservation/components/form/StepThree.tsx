"use client";

import { Control, FieldErrors, useController } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { SaudiRiyal } from "lucide-react";
import { CompanyService } from "@/types/companyCars/carServices";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const ServiceCheckCard = ({
  service,
  selected,
  onToggle,
}: {
  service: CompanyService;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        w-full text-right rounded-2xl border-2 p-4 flex items-center gap-4 transition-all duration-200
        ${
          selected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      {/* Checkbox indicator */}
      <div
        className={`
          shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${selected ? "border-primary bg-primary" : "border-gray-300 bg-white"}
        `}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Service info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base text-gray-800 truncate">
          {service.serviceArabicName}
        </p>
        {service.notes && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">{service.notes}</p>
        )}
      </div>

      {/* Price */}
      <div className="shrink-0 flex items-center gap-1 font-extrabold text-primary text-base">
        <span>{service.price}</span>
        <SaudiRiyal className="w-4 h-4" />
      </div>
    </button>
  );
};

const StepThree = ({ control, errors }: StepThreeProps) => {
  const services = useBookedCarDetailsStore((s) => s.services);

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
    <div className="space-y-5">
      <div>
        <p className="text-lg font-bold text-gray-800">تحديد الخدمات الإضافية</p>
        <p className="text-sm text-gray-500 mt-1">
          اختر الخدمات التي تريد إضافتها لحجزك
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-base">لا توجد خدمات إضافية لهذه السيارة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const id = String(service.csId);
            return (
              <ServiceCheckCard
                key={service.csId}
                service={service}
                selected={(selectedIds ?? []).includes(id)}
                onToggle={() => toggleService(id)}
              />
            );
          })}
        </div>
      )}

      {(selectedIds ?? []).length > 0 && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-gray-700">
          <span className="font-bold text-primary">
            {(selectedIds ?? []).length}
          </span>{" "}
          {(selectedIds ?? []).length === 1 ? "خدمة مختارة" : "خدمات مختارة"}
        </div>
      )}

      {errors.services && (
        <p className="text-sm text-red-500">{errors.services.message as string}</p>
      )}
    </div>
  );
};

export default StepThree;
