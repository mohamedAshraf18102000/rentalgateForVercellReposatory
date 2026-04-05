"use client";

import { CompanyService } from "@/types/companyCars/carServices";
import { SaudiRiyal } from "lucide-react";

interface SelectableServiceCardProps {
  service: CompanyService;
  selected: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
}

const SelectableServiceCard = ({
  service,
  selected,
  onToggle,
  badge,
}: SelectableServiceCardProps) => {
  const checkboxId = `service-card-${service.csId ?? Math.random()}`;
  const hasDiscount = service.percentage > 0;
  const originalPrice = hasDiscount
    ? (service.price / (1 - service.percentage / 100)).toFixed(2)
    : null;

  return (
    <label
      htmlFor={checkboxId}
      dir="rtl"
      className={`
        w-full text-right rounded-lg py-2 px-4 flex flex-col gap-2 transition-all duration-300 relative border-2 cursor-pointer
        ${
          selected
            ? "bg-white border-primary border-[0.5px] shadow-lg"
            : "bg-Grey100 border-transparent hover:border-gray-200"
        }
      `}
    >
      <div className="flex justify-between">
        <div>
          <input
            id={checkboxId}
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="sr-only"
          />
          <div className="flex items-start justify-between gap-4 w-full">
            {/* Checkbox indicator - Top Right in RTL */}
            <div
              className={`
            shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 order-1
            ${selected ? "bg-black" : "bg-white border-2 border-gray-100"}
            `}
            >
              {selected && (
                <svg
                  className="w-4 h-4 text-white"
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

            {/* Service info - to the left of checkbox in RTL */}
            <div className="flex-1 min-w-0 pr-0 text-right order-2">
              <p className="font-bold text-base text-gray-900 leading-tight">
                {service.serviceArabicName}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-2 leading-relaxed">
                {service.notes}
              </p>
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    {originalPrice}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-base text-gray-900">
                    {service.price}
                  </span>
                  <SaudiRiyal className="w-4 h-4 text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-fit">
          {badge && <div className="w-fit">{badge}</div>}
        </div>
      </div>
    </label>
  );
};

export default SelectableServiceCard;
