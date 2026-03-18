"use client";

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EditIcon } from "@/constants/icons";
import { DayPicker } from "react-day-picker";
import { ar, enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "./style.css";
import { buttonVariants } from "./button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  label?: string;
  labelIcon?: ReactNode;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  fromLabel?: string;
  toLabel?: string;
  fromValue?: Date | null;
  toValue?: Date | null;
  onFromChange?: (date: Date | null) => void;
  onToChange?: (date: Date | null) => void;
  dialogTitle?: string;
  fromDialogTitle?: string;
  toDialogTitle?: string;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  toDisabled?: boolean;
  minDaysFromToday?: number;
  minDate?: Date | null;
  locale?: string;
  /** Enable time selection alongside the calendar */
  withTime?: boolean;
  pickerDateLabel?: string;
  pickerTimeLabel?: string;
  /** Show an X button to clear the selected date */
  allowClear?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const arabicDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
const englishDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDate(
  date: Date | null | undefined,
  locale: string = "ar",
): string {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const isArabic = locale === "ar";
  const days = isArabic ? arabicDays : englishDays;
  const day = days[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  return `${day} ${dayNum}-${month}-${year}`;
}

function formatDateTime(
  date: Date | null | undefined,
  locale: string = "ar",
): string {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const isArabic = locale === "ar";
  const datePart = formatDate(dateObj, locale);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const ampm =
    hours >= 12 ? (isArabic ? "مساءً" : "Pm") : isArabic ? "صباحاً" : "Am";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${datePart}  ${displayHour}:${minutes} ${ampm}`;
}

/** Generate time slots every 30 minutes from 00:00 to 23:30 */
function generateTimeSlots(): {
  hours: number;
  minutes: number;
}[] {
  const slots: { hours: number; minutes: number }[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      slots.push({
        hours: h,
        minutes: m,
      });
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

// ─── TimePicker sub-component ─────────────────────────────────────────────────

interface TimePickerProps {
  selectedDate: Date | null | undefined;
  onTimeSelect: (hours: number, minutes: number) => void;
  locale?: string;
}

function TimePicker({
  selectedDate,
  onTimeSelect,
  locale = "ar",
}: TimePickerProps) {
  const selectedHours = selectedDate?.getHours() ?? -1;
  const selectedMinutes = selectedDate?.getMinutes() ?? -1;

  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedHours, selectedMinutes]);

  return (
    <div
      className="time-picker-scroll bg-Grey100 p-2 rounded-2xl grid grid-cols-3 gap-2 overflow-y-auto max-h-[325px] pr-1"
      style={{ scrollbarWidth: "thin" }}
    >
      {TIME_SLOTS.map((slot) => {
        const isActive =
          slot.hours === selectedHours && slot.minutes === selectedMinutes;

        const displayH = slot.hours % 12 === 0 ? 12 : slot.hours % 12;
        const displayM = slot.minutes.toString().padStart(2, "0");
        const ampm =
          slot.hours >= 12
            ? locale === "ar"
              ? "م"
              : "Pm"
            : locale === "ar"
              ? "ص"
              : "Am";
        const label = `${displayH}:${displayM} ${ampm}`;

        // Gray out hours that are in the past if selected date is today
        const now = new Date();
        const isToday =
          selectedDate &&
          selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate();
        const isPast =
          isToday &&
          (slot.hours < now.getHours() ||
            (slot.hours === now.getHours() && slot.minutes < now.getMinutes()));

        return (
          <button
            key={label}
            ref={isActive ? activeRef : null}
            onClick={() => onTimeSelect(slot.hours, slot.minutes)}
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap text-left",
              isActive
                ? "bg-gray-900 text-white shadow-md"
                : isPast
                  ? "text-gray-300 cursor-not-allowed bg-transparent"
                  : "text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Calendar sub-component ───────────────────────────────────────────────────

interface CalendarProps {
  selected: Date | null | undefined;
  onSelect: (date: Date | undefined) => void;
  locale: string;
  minAllowedDate: Date;
  maxAllowedDate?: Date | null;
  fromValue?: Date | null;
  mode?: "single" | "range";
  rangeSelected?: { from?: Date; to?: Date };
  onRangeSelect?: (range: { from?: Date; to?: Date } | undefined) => void;
}

function CalendarPanel({
  selected,
  onSelect,
  locale,
  minAllowedDate,
  maxAllowedDate,
  fromValue,
  mode = "single",
  rangeSelected,
  onRangeSelect,
}: CalendarProps) {
  const dayPickerLocale = locale === "ar" ? ar : enUS;
  const defaultMonth = selected ?? minAllowedDate;

  const chevronComponents = {
    Chevron: ({ orientation }: { orientation?: string }) => {
      if (orientation === "left") {
        return (
          <div
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          >
            <ChevronRight className="h-4 w-4" />
          </div>
        );
      }
      return (
        <div
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <ChevronLeft className="h-4 w-4" />
        </div>
      );
    },
  };

  if (mode === "range" && onRangeSelect) {
    return (
      <DayPicker
        mode="range"
        defaultMonth={defaultMonth ?? undefined}
        onSelect={(range) =>
          onRangeSelect(range as { from?: Date; to?: Date } | undefined)
        }
        locale={dayPickerLocale}
        disabled={(date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          if (d < minAllowedDate) return true;
          if (fromValue) {
            const f = new Date(fromValue);
            f.setHours(0, 0, 0, 0);
            return d < f;
          }
          return false;
        }}
        components={chevronComponents}
      />
    );
  }

  return (
    <DayPicker
      className="bg-Grey100 p-2 rounded-2xl"
      mode="single"
      selected={selected ?? undefined}
      defaultMonth={defaultMonth ?? undefined}
      onSelect={onSelect}
      locale={dayPickerLocale}
      disabled={(date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        if (d < minAllowedDate) return true;
        if (maxAllowedDate && d > maxAllowedDate) return true;
        return false;
      }}
      components={chevronComponents}
    />
  );
}

// ─── DateTimePicker popover content ──────────────────────────────────────────

interface DateTimeContentProps {
  selectedDate: Date | null | undefined;
  onDateChange: (date: Date | undefined) => void;
  locale: string;
  minAllowedDate: Date;
  maxAllowedDate?: Date | null;
  withTime?: boolean;
  title?: string;
  pickerDateLabel?: string;
  pickerTimeLabel?: string;
}

function DateTimeContent({
  selectedDate,
  onDateChange,
  locale,
  minAllowedDate,
  maxAllowedDate,
  withTime = false,
  title,
  pickerDateLabel,
  pickerTimeLabel,
}: DateTimeContentProps) {
  const isArabic = locale === "ar";
  const displayDateLabel = pickerDateLabel || (isArabic ? "من يوم:" : "Day:");
  const displayTimeLabel =
    pickerTimeLabel || (isArabic ? "من الساعة:" : "Time:");

  function handleTimeSelect(hours: number, minutes: number) {
    const base = selectedDate ? new Date(selectedDate) : new Date();
    base.setHours(hours, minutes, 0, 0);
    onDateChange(base);
  }

  return (
    // RED
    <div className="p-4 rounded-2xl">
      {title && <div className="text-[16px] font-semibold mb-2">{title}</div>}
      {title && <hr className="my-3" />}
      <div
        className={cn(
          "flex gap-4",
          locale === "ar" ? "flex-row" : "flex-row-reverse",
        )}
      >
        {/* Time column */}
        <div className="">
          <p className="text-base! mb-3">{displayDateLabel}</p>
          <CalendarPanel
            selected={selectedDate}
            onSelect={onDateChange}
            locale={locale}
            minAllowedDate={minAllowedDate}
            maxAllowedDate={maxAllowedDate}
          />
        </div>

        {withTime && (
          <div className="">
            <p className="text-base! mb-3">{displayTimeLabel}</p>
            <TimePicker
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              locale={locale}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main DatePicker export ───────────────────────────────────────────────────

export function DateTimePicker({
  label,
  labelIcon,
  value,
  onChange,
  placeholder,
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  dialogTitle,
  fromDialogTitle,
  toDialogTitle,
  errorMessage,
  className,
  inputClassName,
  labelClassName,
  toDisabled = false,
  minDaysFromToday = 0,
  minDate,
  locale = "ar",
  withTime = false,
  pickerDateLabel,
  pickerTimeLabel,
  allowClear = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [isFromSelected, setIsFromSelected] = useState(true);

  const isArabic = locale === "ar";
  const defaultPlaceholder =
    placeholder || (isArabic ? "اختر التاريخ" : "Select date");
  const defaultFromLabel = fromLabel || (isArabic ? "من:" : "From:");
  const defaultToLabel = toLabel || (isArabic ? "إلى:" : "To:");
  const defaultDialogTitle =
    dialogTitle ||
    (isArabic ? "حدد يوم أستلام السيارة:" : "Select car pickup day:");

  const isRange = onFromChange !== undefined || onToChange !== undefined;
  const displayValue = isRange ? (isFromSelected ? fromValue : toValue) : value;

  // Compute min/max dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let minAllowedDate: Date;
  if (minDate) {
    minAllowedDate = new Date(minDate);
    minAllowedDate.setHours(0, 0, 0, 0);
    if (minAllowedDate < today) minAllowedDate = new Date(today);
  } else {
    minAllowedDate = new Date(today);
  }

  let maxAllowedDate: Date | null = null;
  if (!minDate && minDaysFromToday > 0) {
    maxAllowedDate = new Date(today);
    maxAllowedDate.setDate(today.getDate() + minDaysFromToday - 1);
    maxAllowedDate.setHours(23, 59, 59, 999);
  }

  const formatFn = withTime ? formatDateTime : formatDate;

  // ── Range variant ─────────────────────────────────────────────────────────
  if (isRange) {
    const currentValue = isFromSelected ? fromValue : toValue;

    function handleDateChange(date: Date | undefined) {
      if (!date) return;
      // Keep existing time if withTime
      const base = withTime && currentValue ? new Date(currentValue) : date;
      if (withTime && currentValue) {
        base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      }
      if (isFromSelected) onFromChange?.(base);
      else onToChange?.(base);
    }

    const rangeTitle = isFromSelected
      ? fromDialogTitle || defaultDialogTitle
      : toDialogTitle || defaultDialogTitle;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap md:flex-nowrap gap-2 ">
          {/* From */}
          <div className="flex-1 min-w-0">
            <Popover
              open={isFromSelected && open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                setIsFromSelected(true);
              }}
            >
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex items-center justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit transition-colors",
                    isFromSelected && open
                      ? "bg-[#ECEEF2]"
                      : "bg-transparent hover:bg-[#ECEEF2]",
                  )}
                >
                  <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                    {defaultFromLabel}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                    {fromValue
                      ? formatFn(fromValue, locale)
                      : defaultPlaceholder}
                  </span>
                  {allowClear && fromValue ? (
                    <span
                      role="button"
                      tabIndex={0}
                      className="shrink-0 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        onFromChange?.(null);
                      }}
                    >
                      <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500" />
                    </span>
                  ) : (
                    <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                      <EditIcon />
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DateTimeContent
                  selectedDate={fromValue}
                  onDateChange={(d) => {
                    if (!d) return;
                    onFromChange?.(d);
                    if (!withTime) setOpen(false);
                  }}
                  locale={locale}
                  minAllowedDate={minAllowedDate}
                  maxAllowedDate={maxAllowedDate}
                  withTime={withTime}
                  title={fromDialogTitle || defaultDialogTitle}
                  pickerDateLabel={pickerDateLabel}
                  pickerTimeLabel={pickerTimeLabel}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To */}
          <div className="flex-1 min-w-0">
            {toDisabled ? (
              <div className="flex items-center justify-center gap-1 md:gap-2 bg-[#ECEEF2] rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit opacity-75">
                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {defaultToLabel}
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                  {toValue ? formatFn(toValue, locale) : defaultPlaceholder}
                </span>
              </div>
            ) : (
              <Popover
                open={!isFromSelected && open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  setIsFromSelected(false);
                }}
              >
                <PopoverTrigger asChild>
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "flex items-center justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit transition-colors",
                      !isFromSelected && open
                        ? "bg-[#ECEEF2]"
                        : "bg-transparent hover:bg-[#ECEEF2]",
                    )}
                  >
                    <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                      {defaultToLabel}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                      {toValue ? formatFn(toValue, locale) : defaultPlaceholder}
                    </span>
                    {allowClear && toValue ? (
                      <span
                        role="button"
                        tabIndex={0}
                        className="shrink-0 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          onToChange?.(null);
                        }}
                      >
                        <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500" />
                      </span>
                    ) : (
                      <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                        <EditIcon />
                      </span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DateTimeContent
                    selectedDate={toValue}
                    onDateChange={(d) => {
                      if (!d) return;
                      onToChange?.(d);
                      if (!withTime) setOpen(false);
                    }}
                    locale={locale}
                    minAllowedDate={minAllowedDate}
                    maxAllowedDate={maxAllowedDate}
                    withTime={withTime}
                    title={toDialogTitle || defaultDialogTitle}
                    pickerDateLabel={pickerDateLabel}
                    pickerTimeLabel={pickerTimeLabel}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Single variant ────────────────────────────────────────────────────────
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium mb-2 flex items-center gap-1",
            labelClassName,
          )}
        >
          {labelIcon}
          {label}
        </label>
      )}
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Input
                readOnly
                value={formatFn(displayValue, locale)}
                placeholder={defaultPlaceholder}
                className={cn(
                  "cursor-pointer w-full",
                  allowClear && value ? "pe-8" : "",
                  inputClassName,
                )}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl!" align="start">
            <DateTimeContent
              selectedDate={value}
              onDateChange={(d) => {
                if (!d) return;
                onChange?.(d);
                if (!withTime) setOpen(false);
              }}
              locale={locale}
              minAllowedDate={minAllowedDate}
              maxAllowedDate={maxAllowedDate}
              withTime={withTime}
              pickerDateLabel={pickerDateLabel}
              pickerTimeLabel={pickerTimeLabel}
            />
          </PopoverContent>
        </Popover>
        {allowClear && value && (
          <span
            role="button"
            tabIndex={0}
            className="absolute end-2 top-1/2 -translate-y-1/2 z-10 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              onChange?.(null);
            }}
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </span>
        )}
      </div>
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
