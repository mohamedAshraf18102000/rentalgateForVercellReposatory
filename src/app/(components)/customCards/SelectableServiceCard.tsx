"use client";

import { CompanyService } from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";
import { useLocale } from "next-intl";

interface SelectableServiceCardProps {
  rentalDays?: number;
  service: CompanyService;
  selected: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
}

const SelectableServiceCard = ({
  rentalDays,
  service,
  selected,
  onToggle,
  badge,
}: SelectableServiceCardProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const checkboxId = `service-card-${service.csId ?? Math.random()}`;
  const serviceName =
    locale === "ar"
      ? service.serviceArabicName
      : service.serviceEnglishName || service.name || service.serviceArabicName;

  return (
    <label
      htmlFor={checkboxId}
      dir={isRTL ? "rtl" : "ltr"}
      className={`
        relative flex w-full cursor-pointer flex-col gap-2 rounded-lg border-2 px-3 py-3 transition-all duration-300 sm:px-4
        ${isRTL ? "text-right" : "text-left"}
        ${
          selected
            ? "bg-white border-primary border-[0.5px] shadow-lg"
            : "bg-Grey100 border-transparent hover:border-gray-200"
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
              {serviceName}
            </p>
            <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-gray-500">
              {service.notes}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <div className="flex gap-1">
                <span className="text-sm font-black text-gray-900 sm:text-base">
                  {service.price}
                </span>
                <SaudiRiyal className="h-5 w-5 text-gray-900 p-0WS" />
              </div>
              {service.csType === "everyday" && (
                <>
                  <span>/</span>
                  <span className="text-sm font-bold">
                    {rentalDays} {locale === "ar" ? "يوم" : "day"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-fit shrink-0">
          {badge && <div className="w-fit text-xs sm:text-sm">{badge}</div>}
        </div>
      </div>
    </label>
  );
};

export default SelectableServiceCard;
