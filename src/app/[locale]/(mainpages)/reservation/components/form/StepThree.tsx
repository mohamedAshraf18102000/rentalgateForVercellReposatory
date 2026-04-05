"use client";

import { useState } from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import SelectableServiceCard from "@/app/(components)/customCards/SelectableServiceCard";
import SelectableServiceDriverCard from "@/app/(components)/customCards/SelectableServiceDriverCard";
import { Flame } from "lucide-react";
import { useCompanyDriversPricing } from "@/hooks/api/useCompanyDriversPricing";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const StepThree = ({ control, errors }: StepThreeProps) => {
  const services = useBookedCarDetailsStore((s) => s.services);
  const formdata = useBookedCarDetailsStore((s) => s.formData);
  const { data: companyDriversPricing } = useCompanyDriversPricing(
    formdata.company_id!,
  );

  const {
    field: { value: selectedServiceIds, onChange: onChangeServices },
  } = useController({
    name: "services",
    control,
    defaultValue: [],
  });

  const {
    field: { value: selectedDriver, onChange: onChangeDriver },
  } = useController({
    name: "driver",
    control,
    defaultValue: null,
  });

  const {
    field: { value: unlimitedKm, onChange: onChangeUnlimited },
  } = useController({
    name: "unlimitedKm",
    control,
    defaultValue: false,
  });

  const setFormData = useBookedCarDetailsStore((s) => s.setFormData);

  // Lifted state: keyed by drvId
  const [driverHours, setDriverHours] = useState<Record<number, number>>({});
  const [driverDays, setDriverDays] = useState<Record<number, number>>({});

  const toggleService = (
    id: number,
    type: "service" | "driver" | "unlimited",
  ) => {
    if (type === "service") {
      const current = selectedServiceIds ?? [];
      const isSelected = current.includes(id);
      const next = isSelected
        ? current.filter((sid: number) => sid !== id)
        : [...current, id];

      onChangeServices(next);
      setFormData({ services: next });
    } else if (type === "driver") {
      const isSelected = selectedDriver?.id === id;
      if (isSelected) {
        onChangeDriver(null);
        setFormData({ driver: null });
      } else {
        const driverInfo = companyDriversPricing?.find((d) => d.cdsId === id);
        const nextDriver = {
          id,
          hours: driverHours[id] ?? 1,
          days: driverDays[id] ?? 1,
          type: driverInfo?.cdsType as "in" | "out",
        };
        onChangeDriver(nextDriver);
        setFormData({ driver: nextDriver });
      }
    } else if (type === "unlimited") {
      const next = !unlimitedKm;
      onChangeUnlimited(next);
      setFormData({ unlimitedKm: next });
    }
  };

  const handleLogServices = () => {
    console.group("الخدمات المختارة");
    console.log("الخدمات العادية (Form State):", selectedServiceIds);
    console.log("الخدمات العادية (Store State):", formdata.services);

    if (selectedDriver) {
      const drvId = selectedDriver.id;
      const driver = companyDriversPricing?.find((d) => d.cdsId === drvId);
      console.log("خدمة السائق:", {
        driverRequested: true,
        id: drvId,
        type: driver?.cdsType === "in" ? "داخل المدينة" : "خارج المدينة",
        hoursPerDay: selectedDriver.hours,
        numberOfDays: selectedDriver.days,
      });
    } else {
      console.log("لم يتم اختيار خدمة سائق");
    }

    console.log("كيلومترات غير محدودة:", unlimitedKm);
    console.groupEnd();
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
              selected={unlimitedKm ?? false}
              badge={
                <p className="text-sm p-2 bg-StatusBrownBG rounded-[8px] text-StatusBrown200 font-bold flex items-center gap-1">
                  <Flame />
                  <span>قيادة بلا نهاية</span>
                </p>
              }
              onToggle={() => toggleService(0, "unlimited")}
            />
          )}
          {services.map((service) => {
            const id = service.csId;
            return (
              <SelectableServiceCard
                key={service.csId}
                service={service}
                selected={!!selectedServiceIds?.includes(id)}
                onToggle={() => toggleService(id, "service")}
              />
            );
          })}

          {companyDriversPricing?.map((driver) => {
            const drvId = driver.cdsId;
            const isSelected = selectedDriver?.id === drvId;
            return (
              <SelectableServiceDriverCard
                key={driver.cdsId}
                driver={driver}
                selected={isSelected}
                onToggle={() => toggleService(drvId, "driver")}
                badge={
                  driver.cdsType === "in" ? "داخل المدينة" : "خارج المدينة"
                }
                hoursPerDay={driverHours[drvId] ?? selectedDriver?.hours ?? 1}
                numberOfDays={driverDays[drvId] ?? selectedDriver?.days ?? 1}
                onHoursChange={(h) => {
                  setDriverHours((prev) => ({ ...prev, [drvId]: h }));
                  if (isSelected) {
                    const next = {
                      ...selectedDriver,
                      hours: h,
                      type: driver.cdsType as "in" | "out",
                    };
                    onChangeDriver(next);
                    setFormData({ driver: next });
                  }
                }}
                onDaysChange={(d) => {
                  setDriverDays((prev) => ({ ...prev, [drvId]: d }));
                  if (isSelected) {
                    const next = {
                      ...selectedDriver,
                      days: d,
                      type: driver.cdsType as "in" | "out",
                    };
                    onChangeDriver(next);
                    setFormData({ driver: next });
                  }
                }}
              />
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={handleLogServices}
        className="bg-blue-200 w-full p-2 rounded-xl"
      >
        Click here to log the services
      </button>

      {errors.services && (
        <p className="text-sm text-red-500">
          {errors.services.message as string}
        </p>
      )}
    </div>
  );
};

export default StepThree;
