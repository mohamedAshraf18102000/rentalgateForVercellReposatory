"use client";

import { useState } from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import SelectableServiceCard from "@/app/(components)/customCards/SelectableServiceCard";
import SelectableServiceDriverCard from "@/app/(components)/customCards/SelectableServiceDriverCard";
import { Flame } from "lucide-react";
import { useCompanyDriversPricing } from "@/hooks/api/useCompanyDriversPricing";
import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { useTranslations } from "next-intl";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const StepThree = ({ control, errors }: StepThreeProps) => {
  const t = useTranslations("carDetails");
  const services = useBookedCarDetailsStore((s) => s.services);
  const formdata = useBookedCarDetailsStore((s) => s.formData);
  const { data: companyDriversPricing } = useCompanyDriversPricing(
    formdata.branchId!,
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
    field: { value: extraKmType, onChange: onChangeExtraKmType },
  } = useController({
    name: "extraKmType",
    control,
    defaultValue: "QUOTA",
  });

  const {
    field: { onChange: onChangeExtraKmApplied },
  } = useController({
    name: "extraKmApplied",
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
      const next: "UNLIMITED" | "QUOTA" =
        extraKmType === "UNLIMITED" ? "QUOTA" : "UNLIMITED";
      const isApplied = next === "UNLIMITED";
      onChangeExtraKmType(next);
      onChangeExtraKmApplied(isApplied);
      setFormData({ extraKmType: next, extraKmApplied: isApplied });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <h2 className="text-lg font-semibold leading-tight text-gray-900 sm:text-xl">
          {t("reservation.stepThree.title")}
        </h2>
        <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
          {t("reservation.stepThree.description")}
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">
            {t("reservation.stepThree.noServices")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {formdata.carDetails?.unlimitedKmPrice !== 0 && (
            <SelectableServiceCard
              service={
                {
                  serviceArabicName: t("reservation.stepThree.unlimitedKmTitle"),
                  notes: t("reservation.stepThree.unlimitedKmNotes"),
                  price: calculateServicePrice(
                    {
                      price: formdata.carDetails?.unlimitedKmPrice || 0,
                      csType: "everyday",
                      priceType: "same",
                    } as any,
                    formdata.rentalDays || 1,
                  ),
                  originalPrice: 0,
                  percentage: 0,
                } as any
              }
              selected={extraKmType === "UNLIMITED"}
              badge={
                <p className="text-sm p-2 bg-StatusBrownBG rounded-[8px] text-StatusBrown200 font-bold flex items-center gap-1">
                  <Flame />
                  <span>{t("reservation.stepThree.unlimitedKmBadge")}</span>
                </p>
              }
              onToggle={() => toggleService(0, "unlimited")}
            />
          )}
          {services.map((service) => {
            const id = service.serviceId;
            const calculatedPrice = calculateServicePrice(
              service,
              formdata.rentalDays || 1,
            );
            return (
              <SelectableServiceCard
                key={service.serviceId}
                service={{ ...service, price: calculatedPrice }}
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
                  driver.cdsType === "in"
                    ? t("reservation.stepThree.driverInsideCity")
                    : t("reservation.stepThree.driverOutsideCity")
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

      {errors.services && (
        <p className="text-sm text-red-500">
          {errors.services.message as string}
        </p>
      )}
    </div>
  );
};

export default StepThree;
