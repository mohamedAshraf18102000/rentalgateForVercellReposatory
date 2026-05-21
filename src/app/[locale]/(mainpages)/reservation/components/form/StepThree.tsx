"use client";

import { useState } from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import SelectableServiceCard from "@/app/(components)/customCards/SelectableServiceCard";
import SelectableServiceDriverCard from "@/app/(components)/customCards/SelectableServiceDriverCard";
import { Flame, SaudiRiyal } from "lucide-react";
import { useCompanyDriversPricing } from "@/hooks/api/useCompanyDriversPricing";
import { calculateServicePrice } from "@/lib/utils/calculateServicePrice";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/app/(components)/ui/skeleton";

interface StepThreeProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

const StepThree = ({ control, errors }: StepThreeProps) => {
  const t = useTranslations("carDetails");
  const services = useBookedCarDetailsStore((s) => s.services);
  const formdata = useBookedCarDetailsStore((s) => s.formData);
  const carDetails = useBookedCarDetailsStore((s) => s.carDetails);
  const { data: companyDriversPricing, isPending } = useCompanyDriversPricing(
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
    field: { value: extraKmApplied, onChange: onChangeExtraKmApplied },
  } = useController({
    name: "extraKmApplied",
    control,
    defaultValue: false,
  });

  const {
    field: { value: extraKmQuotaId, onChange: onChangeExtraKmQuotaId },
  } = useController({
    name: "extraKmQuotaId",
    control,
    defaultValue: null,
  });

  const setFormData = useBookedCarDetailsStore((s) => s.setFormData);

  const clearExtraKm = () => {
    onChangeExtraKmType("QUOTA");
    onChangeExtraKmApplied(false);
    onChangeExtraKmQuotaId(null);
    setFormData({
      extraKmType: "QUOTA",
      extraKmApplied: false,
      extraKmQuotaId: null,
    });
  };

  const selectQuota = (quotaId: number) => {
    if (
      extraKmApplied &&
      extraKmType === "QUOTA" &&
      extraKmQuotaId === quotaId
    ) {
      clearExtraKm();
      return;
    }

    onChangeExtraKmType("QUOTA");
    onChangeExtraKmApplied(true);
    onChangeExtraKmQuotaId(quotaId);
    setFormData({
      extraKmType: "QUOTA",
      extraKmApplied: true,
      extraKmQuotaId: quotaId,
    });
  };

  const selectUnlimited = () => {
    if (extraKmApplied && extraKmType === "UNLIMITED") {
      clearExtraKm();
      return;
    }

    onChangeExtraKmType("UNLIMITED");
    onChangeExtraKmApplied(true);
    onChangeExtraKmQuotaId(null);
    setFormData({
      extraKmType: "UNLIMITED",
      extraKmApplied: true,
      extraKmQuotaId: null,
    });
  };

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
      selectUnlimited();
    }
  };

  const visibleDrivers = companyDriversPricing?.filter((driver) =>
    [
      driver.dailyPrice,
      driver.dayNumberHours,
      driver.extraHourPrice,
      driver.halfMonthPrice,
      driver.hourPrice,
      driver.minHours,
      driver.monthlyPrice,
      driver.notes,
      driver.percentage,
      driver.weeklyPrice,
      driver.yearlyPrice,
    ].some((value) => value !== null),
  );

  return (
    <div className="grid grid-cols-1 gap-4">
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
        <>
          <div className="grid grid-cols-1 gap-4">
            {carDetails?.kilometerPackages.map((km) => (
              <SelectableServiceCard
                key={km.cceId}
                service={{
                  serviceArabicName: "عرض كيلوميترات",
                  notes: `يمكنك شراء عدد ${km.km} كيلومترات بسعر ${formatPrice(km.price)} ريال`,
                  price: formatPrice(km.price),
                }}
                selected={
                  !!extraKmApplied &&
                  extraKmType === "QUOTA" &&
                  extraKmQuotaId === km.cceId
                }
                onToggle={() => selectQuota(km.cceId)}
              />
            ))}
          </div>

          {formdata.carDetails?.unlimitedKmPrice !== 0 && (
            <SelectableServiceCard
              service={{
                serviceArabicName: t("reservation.stepThree.unlimitedKmTitle"),
                notes: t("reservation.stepThree.unlimitedKmNotes"),
                price: calculateServicePrice(
                  {
                    price: formdata.carDetails?.unlimitedKmPrice || 0,
                    csType: "everyday",
                    priceType: "same",
                  },
                  formdata.rentalDays || 1,
                ),
              }}
              selected={!!extraKmApplied && extraKmType === "UNLIMITED"}
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
                rentalDays={Number(formdata.rentalDays) || 1}
                key={service.serviceId}
                service={{ ...service, price: calculatedPrice }}
                selected={!!selectedServiceIds?.includes(id)}
                onToggle={() => toggleService(id, "service")}
              />
            );
          })}

          {isPending ? (
            <Skeleton className="bg-Grey200 w-full h-[200px] rounded-md" />
          ) : (
            <>
              {visibleDrivers?.map((driver) => {
                const drvId = driver.cdsId;
                const isSelected = selectedDriver?.id === drvId;
                return (
                  <SelectableServiceDriverCard
                    rentalDays={Number(formdata.rentalDays) || 1}
                    key={driver.cdsId}
                    driver={driver}
                    selected={isSelected}
                    onToggle={() => toggleService(drvId, "driver")}
                    badge={
                      driver.cdsType === "in"
                        ? t("reservation.stepThree.driverInsideCity")
                        : t("reservation.stepThree.driverOutsideCity")
                    }
                    hoursPerDay={
                      driverHours[drvId] ?? selectedDriver?.hours ?? 1
                    }
                    numberOfDays={
                      driverDays[drvId] ?? selectedDriver?.days ?? 1
                    }
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
            </>
          )}
        </>
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
