"use client";

import { CircleAlert, Minus, Plus, SaudiRiyal } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { CompanyService } from "@/types/companyDrivers";
import WarningMessage from "../WarningMessage";

interface SelectableServiceDriverCardProps {
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
  driver,
  selected,
  onToggle,
  badge,
  hoursPerDay: hoursPerDayProp,
  numberOfDays: numberOfDaysProp,
  onHoursChange,
  onDaysChange,
}: SelectableServiceDriverCardProps) => {
  const checkboxId = `driver-service-${driver?.cdsId ?? Math.random()}`;

  const minHours = 1;
  const maxHours = driver?.dayNumberHours ?? 24;

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
    const next = Math.max(1, numberOfDays - 1);
    onDaysChange?.(next);
  };

  const handleDaysIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = numberOfDays + 1;
    onDaysChange?.(next);
  };

  return (
    <>
      <label
        htmlFor={checkboxId}
        dir="rtl"
        className={`
        w-full text-right rounded-lg py-2 px-4 flex flex-col gap-2 transition-all duration-300 relative overflow-hidden cursor-pointer
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
              سائق خاص
              <span className="text-base font-normal mx-1">
                (اليوم = {driver?.dayNumberHours} ساعات)
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium line-clamp-2 leading-relaxed">
              <span className="mx-1">لا يمكن الإستفادة من خدمة السائق إلا</span>
              <span>{driver?.cdsType === "in" ? "داخل" : "خارج"}</span>{" "}
              <span>المدينة المحددة</span>
            </p>

            <div className="bg-white p-2 w-fit flex items-center rounded-lg mt-3">
              <p className="font-bold">عدد الساعات في اليوم:</p>
              <div className="flex items-center gap-2 mx-2">
                <button
                  type="button"
                  onClick={handleHoursDecrement}
                  disabled={hoursPerDay <= minHours}
                  className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-red-200 transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus />
                </button>
                <span className="font-bold min-w-6 text-center">
                  {hoursPerDay}
                </span>
                <button
                  type="button"
                  onClick={handleHoursIncrement}
                  disabled={hoursPerDay >= maxHours}
                  className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-green-200 transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus />
                </button>
              </div>
            </div>

            <WarningMessage
              message={`خدمة السائق محددة ب ${driver?.minHours ?? ""} ساعات و إن زادت تكون بتكلفة إضافية أخرى.`}
            />

            <WarningMessage
              message={`حد اقصى لعدد ساعات اليوم ${driver?.dayNumberHours ?? ""} ساعة`}
            />

            <div className="bg-white p-2 w-fit flex items-center rounded-lg mt-3">
              <p className="font-bold">عدد الأيام:</p>
              <div className="flex items-center gap-2 mx-2">
                <button
                  type="button"
                  onClick={handleDaysDecrement}
                  disabled={numberOfDays <= 1}
                  className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-red-200 transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus />
                </button>
                <span className="font-bold min-w-6 text-center">
                  {numberOfDays}
                </span>
                <button
                  type="button"
                  onClick={handleDaysIncrement}
                  className="bg-gray-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center font-bold hover:bg-green-200 transition duration-300 cursor-pointer"
                >
                  <Plus />
                </button>
              </div>
            </div>
            <WarningMessage
              message={`مدة الحجز الخاصة بك هي (${numberOfDays} أيام)`}
            />

            <div className=" w-fit flex items-center rounded-lg gap-1 mt-2">
              <p className="font-bold text-lg">{driver?.dailyPrice}</p>
              <SaudiRiyal className="w-5 h-5" />
              <p className="">/</p>
              <p className="">يوم</p>
            </div>
          </div>
          {badge && (
            <Badge className="text-sm font-bold absolute top-2 left-2 bg-StatusGreen text-StatusDarkGreen border-2 border-StatusDarkGreen p-4 rounded-lg">
              {badge}
            </Badge>
          )}
        </div>
      </label>
    </>
  );
};

export default SelectableServiceDriverCard;
