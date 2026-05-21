"use client";

import { Minus, Plus, SaudiRiyal } from "lucide-react";
import { Badge } from "../ui/badge";
import { CompanyService } from "@/types/companyDrivers";
import WarningMessage from "../WarningMessage";
import { useLocale, useTranslations } from "next-intl";

interface SelectableServiceDriverCardProps {
  rentalDays?: number;
  driver?: CompanyService;
  selected?: boolean;
  onToggle?: () => void;
  badge?: string;
  hoursPerDay?: number;
  numberOfDays?: number;
  onHoursChange?: (hours: number) => void;
  onDaysChange?: (days: number) => void;
}

const SelectableServiceDriverCard = ({
  rentalDays,
  driver,
  selected,
  onToggle,
  badge,
  hoursPerDay: hoursPerDayProp,
  numberOfDays: numberOfDaysProp,
  onHoursChange,
  onDaysChange,
}: SelectableServiceDriverCardProps) => {
  const locale = useLocale();
  const t = useTranslations("carDetails");
  const isRTL = locale === "ar";
  const checkboxId = `driver-service-${driver?.cdsId ?? Math.random()}`;

  const minHours = 1;
  const maxHours = driver?.dayNumberHours ?? 24;

  const minDays = 1;
  const maxDays = rentalDays ?? minDays;

  const hoursPerDay = hoursPerDayProp ?? 1;
  const numberOfDays = numberOfDaysProp ?? 1;

  const handleHoursDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = Math.max(minHours, hoursPerDay - 1);
    onHoursChange?.(next);
  };

  const handleHoursIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = Math.min(maxHours, hoursPerDay + 1);
    onHoursChange?.(next);
  };

  const handleDaysDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = Math.max(minDays, numberOfDays - 1);
    onDaysChange?.(next);
  };

  const handleDaysIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = Math.min(maxDays, numberOfDays + 1);
    onDaysChange?.(next);
  };

  return (
    <label
      htmlFor={checkboxId}
      dir={isRTL ? "rtl" : "ltr"}
      className={`
        relative flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-lg px-3 py-3 transition-all duration-300 sm:px-4
        ${isRTL ? "text-right" : "text-left"}
        ${
          selected
            ? "border-[0.5px] border-primary bg-white shadow-lg"
            : "border-transparent bg-Grey100 hover:border-gray-200"
        }
      `}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="sr-only"
      />
      <div className="flex w-full items-start justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3 sm:gap-4">
          <div
            className={`
              order-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all duration-200 sm:h-6 sm:w-6 sm:rounded-lg
              ${selected ? "bg-black" : "border-2 border-gray-100 bg-white"}
            `}
          >
            {selected && (
              <svg
                className="h-3 w-3 text-white sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          <div
            className={`order-2 min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}
          >
            <p className="text-sm font-bold leading-tight text-gray-900 sm:text-base">
              {t("reservation.stepThree.driverCard.title")}
              <span className="mx-1 text-sm font-normal sm:text-base">
                {t("reservation.stepThree.driverCard.dayHours", {
                  hours: driver?.dayNumberHours ?? 0,
                })}
              </span>
            </p>
            <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-gray-500">
              {t("reservation.stepThree.driverCard.cityRestriction", {
                type:
                  driver?.cdsType === "in"
                    ? t("reservation.stepThree.driverCard.insideCity")
                    : t("reservation.stepThree.driverCard.outsideCity"),
              })}
            </p>

            <div className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-lg bg-white p-2 sm:w-fit">
              <p className="text-sm font-bold sm:text-base">
                {t("reservation.stepThree.driverCard.hoursPerDayLabel")}
              </p>
              <div className="mx-1 flex items-center gap-2 sm:mx-2">
                <button
                  type="button"
                  onClick={handleHoursDecrement}
                  disabled={hoursPerDay <= minHours}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 font-bold transition duration-300 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-6 text-center text-sm font-bold sm:text-base">
                  {hoursPerDay}
                </span>
                <button
                  type="button"
                  onClick={handleHoursIncrement}
                  disabled={hoursPerDay >= maxHours}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 font-bold transition duration-300 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <WarningMessage
              message={t("reservation.stepThree.driverCard.minHoursWarning", {
                hours: driver?.minHours ?? 0,
              })}
            />

            <WarningMessage
              message={t("reservation.stepThree.driverCard.maxHoursWarning", {
                hours: driver?.dayNumberHours ?? 0,
              })}
            />

            <div className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-lg bg-white p-2 sm:w-fit">
              <p className="text-sm font-bold sm:text-base">
                {t("reservation.stepThree.driverCard.daysCountLabel")}
              </p>
              <div className="mx-1 flex items-center gap-2 sm:mx-2">
                <button
                  type="button"
                  onClick={handleDaysDecrement}
                  disabled={numberOfDays <= minDays}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 font-bold transition duration-300 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-6 text-center text-sm font-bold sm:text-base">
                  {numberOfDays}
                </span>
                <button
                  type="button"
                  onClick={handleDaysIncrement}
                  disabled={numberOfDays >= maxDays}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 font-bold transition duration-300 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <WarningMessage
              message={t("reservation.stepThree.driverCard.bookingDuration", {
                days: numberOfDays,
              })}
            />

            <div className="mt-2 flex w-fit items-center gap-1 rounded-lg">
              <p className="text-base font-bold sm:text-lg">
                {driver?.dailyPrice}
              </p>
              <SaudiRiyal className="h-4 w-4 sm:h-5 sm:w-5" />
              <p>/</p>
              <p>{t("reservation.stepThree.driverCard.dayUnit")}</p>
            </div>
          </div>
        </div>
        {badge && (
          <Badge className="shrink-0 rounded-lg border-2 border-StatusDarkGreen bg-StatusGreen px-2 py-3! text-xs font-bold text-StatusDarkGreen sm:px-3 sm:py-2 sm:text-sm">
            {badge}
          </Badge>
        )}
      </div>
    </label>
  );
};

export default SelectableServiceDriverCard;
