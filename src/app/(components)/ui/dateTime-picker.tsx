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
import { X } from "lucide-react";
import { EditIcon } from "@/constants/icons";
import { DayPicker } from "react-day-picker";
import { ar, enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "./style.css";
import { DialogWrapper } from "./dialog-wrapper"; // adjust path

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  label?: string;
  labelIcon?: ReactNode;
  required?: boolean;
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
  withTime?: boolean;
  pickerDateLabel?: string;
  pickerTimeLabel?: string;
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

function formatDate(date: Date | null | undefined, locale = "ar"): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  const days = locale === "ar" ? arabicDays : englishDays;
  return `${days[d.getDay()]} ${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function formatDateTime(date: Date | null | undefined, locale = "ar"): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  const datePart = formatDate(d, locale);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm =
    h >= 12
      ? locale === "ar"
        ? "مساءً"
        : "Pm"
      : locale === "ar"
        ? "صباحاً"
        : "Am";
  return `${datePart}  ${h % 12 === 0 ? 12 : h % 12}:${m} ${ampm}`;
}

function generateTimeSlots() {
  const slots: { hours: number; minutes: number }[] = [];
  for (let h = 0; h < 24; h++)
    for (const m of [0, 30]) slots.push({ hours: h, minutes: m });
  return slots;
}
const TIME_SLOTS = generateTimeSlots();

// ─── TimePicker ───────────────────────────────────────────────────────────────

function TimePicker({
  selectedDate,
  onTimeSelect,
  locale = "ar",
}: {
  selectedDate: Date | null | undefined;
  onTimeSelect: (h: number, m: number) => void;
  locale?: string;
}) {
  const selH = selectedDate?.getHours() ?? -1;
  const selM = selectedDate?.getMinutes() ?? -1;
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selH, selM]);

  return (
    <div
      className="time-picker-scroll bg-Grey100 p-2 rounded-2xl grid grid-cols-3 gap-2 overflow-y-auto max-h-[260px] sm:max-h-[325px] pr-1"
      style={{ scrollbarWidth: "thin" }}
    >
      {TIME_SLOTS.map((slot) => {
        const isActive = slot.hours === selH && slot.minutes === selM;
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

        const now = new Date();
        const isToday =
          !!selectedDate &&
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
            type="button"
            disabled={isPast}
            aria-disabled={isPast}
            onClick={() => {
              if (isPast) return;
              onTimeSelect(slot.hours, slot.minutes);
            }}
            className={cn(
              "rounded-2xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap text-left",
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

// ─── CalendarPanel ────────────────────────────────────────────────────────────

function CalendarPanel({
  selected,
  onSelect,
  locale,
  minAllowedDate,
  maxAllowedDate,
}: {
  selected: Date | null | undefined;
  onSelect: (date: Date | undefined) => void;
  locale: string;
  minAllowedDate: Date;
  maxAllowedDate?: Date | null;
}) {
  const dayPickerLocale = locale === "ar" ? ar : enUS;
  const defaultMonth = selected ?? minAllowedDate;
  const fromYear = minAllowedDate.getFullYear();
  const toYear =
    maxAllowedDate?.getFullYear() ??
    Math.max(fromYear, new Date().getFullYear() + 10);

  return (
    <DayPicker
      className="cal-root bg-Grey100 p-2 rounded-2xl w-full max-w-full overflow-hidden"
      mode="single"
      selected={selected ?? undefined}
      defaultMonth={defaultMonth ?? undefined}
      onSelect={onSelect}
      locale={dayPickerLocale}
      captionLayout="dropdown"
      fromYear={fromYear}
      toYear={toYear}
      hideNavigation
      disabled={(date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        if (d < minAllowedDate) return true;
        if (maxAllowedDate && d > maxAllowedDate) return true;
        return false;
      }}
    />
  );
}

// ─── DateTimeContent ──────────────────────────────────────────────────────────

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
}: {
  selectedDate: Date | null | undefined;
  onDateChange: (date: Date | undefined) => void;
  locale: string;
  minAllowedDate: Date;
  maxAllowedDate?: Date | null;
  withTime?: boolean;
  title?: string;
  pickerDateLabel?: string;
  pickerTimeLabel?: string;
}) {
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
    <div className="p-3 sm:p-4 rounded-2xl">
      {title && (
        <div className="text-[15px] sm:text-[16px] font-semibold mb-2">
          {title}
        </div>
      )}
      {title && <hr className="my-3" />}
      <div
        className={cn(
          "flex flex-col gap-4 lg:flex-row",
          locale === "ar" ? "lg:flex-row" : "lg:flex-row-reverse",
        )}
      >
        <div className="w-full lg:w-auto">
          <p className="text-sm sm:text-base! mb-2 sm:mb-3">
            {displayDateLabel}
          </p>
          <CalendarPanel
            selected={selectedDate}
            onSelect={onDateChange}
            locale={locale}
            minAllowedDate={minAllowedDate}
            maxAllowedDate={maxAllowedDate}
          />
        </div>
        {withTime && (
          <div className="w-full lg:w-auto">
            <p className="text-sm sm:text-base! mb-2 sm:mb-3">
              {displayTimeLabel}
            </p>
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

// ─── computeAllowedDates ──────────────────────────────────────────────────────

function computeAllowedDates(minDate?: Date | null, minDaysFromToday = 0) {
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

  return { minAllowedDate, maxAllowedDate };
}

// ─── PickerShell ──────────────────────────────────────────────────────────────
// Renders a Popover on desktop, DialogWrapper bottom-sheet on mobile/tablet.
// Both open/onOpenChange are fully controlled by the parent — no internal state.

function PickerShell({
  open,
  onOpenChange,
  trigger,
  isMobile,
  title,
  selectedDate,
  onDateChange,
  locale,
  minAllowedDate,
  maxAllowedDate,
  withTime,
  pickerDateLabel,
  pickerTimeLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger: ReactNode;
  isMobile: boolean;
  title?: string;
  selectedDate: Date | null | undefined;
  onDateChange: (date: Date | undefined) => void;
  locale: string;
  minAllowedDate: Date;
  maxAllowedDate?: Date | null;
  withTime?: boolean;
  pickerDateLabel?: string;
  pickerTimeLabel?: string;
}) {
  const isArabic = locale === "ar";

  const pickerContent = (
    <DateTimeContent
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      locale={locale}
      minAllowedDate={minAllowedDate}
      maxAllowedDate={maxAllowedDate}
      withTime={withTime}
      // On mobile the title lives in the sheet header, not inside the content
      title={isMobile ? undefined : title}
      pickerDateLabel={pickerDateLabel}
      pickerTimeLabel={pickerTimeLabel}
    />
  );

  // ── Mobile / tablet → DialogWrapper bottom sheet ──────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Trigger rendered outside the sheet so it stays in normal DOM flow */}
        <div onClick={() => onOpenChange(true)}>{trigger}</div>

        <DialogWrapper
          open={open}
          onOpenChange={onOpenChange}
          header={title ? { mainTitle: title } : undefined}
          content={pickerContent}
          scrollableContent
          maxScrollHeight="70vh"
          footer={
            // withTime needs an explicit confirm; plain date-pick closes on day tap
            withTime ? (
              <button
                className="w-full rounded-xl bg-gray-900 text-white py-3 text-sm font-medium"
                onClick={() => onOpenChange(false)}
              >
                {isArabic ? "تأكيد" : "Confirm"}
              </button>
            ) : undefined
          }
        />
      </>
    );
  }

  // ── Desktop → Popover (original behaviour) ───────────────────────────────
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-fit max-w-[95vw] p-0 rounded-2xl! overflow-auto"
        align="start"
      >
        {pickerContent}
      </PopoverContent>
    </Popover>
  );
}

// ─── Main DateTimePicker ──────────────────────────────────────────────────────

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
  required = false,
}: DatePickerProps) {
  // ── All hooks at the top — never inside conditionals ──────────────────────
  const isMobile = useIsMobile();
  const [singleOpen, setSingleOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const isArabic = locale === "ar";
  const defaultPlaceholder =
    placeholder || (isArabic ? "اختر التاريخ" : "Select date");
  const defaultFromLabel = fromLabel || (isArabic ? "من:" : "From:");
  const defaultToLabel = toLabel || (isArabic ? "إلى:" : "To:");
  const defaultDialogTitle =
    dialogTitle ||
    (isArabic ? "حدد يوم أستلام السيارة:" : "Select car pickup day:");

  const isRange = onFromChange !== undefined || onToChange !== undefined;
  const formatFn = withTime ? formatDateTime : formatDate;
  const { minAllowedDate, maxAllowedDate } = computeAllowedDates(
    minDate,
    minDaysFromToday,
  );

  // ── Range variant ─────────────────────────────────────────────────────────
  if (isRange) {
    function handleFromDateChange(date: Date | undefined) {
      if (!date) return;
      const base = withTime && fromValue ? new Date(fromValue) : date;
      if (withTime && fromValue)
        base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      onFromChange?.(base);
      if (!withTime) setFromOpen(false);
    }

    function handleToDateChange(date: Date | undefined) {
      if (!date) return;
      const base = withTime && toValue ? new Date(toValue) : date;
      if (withTime && toValue)
        base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      onToChange?.(base);
      if (!withTime) setToOpen(false);
    }

    const fromTrigger = (
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "flex items-center justify-between md:justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-2 md:px-2 py-1.5 md:py-1.5 w-full md:w-fit min-h-9 transition-colors",
          fromOpen ? "bg-[#ECEEF2]" : "bg-transparent hover:bg-[#ECEEF2]",
        )}
      >
        <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap shrink-0">
          {defaultFromLabel}
        </span>
        <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate flex-1 min-w-0">
          {fromValue ? formatFn(fromValue, locale) : defaultPlaceholder}
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
    );

    const toTrigger = (
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "flex items-center justify-between md:justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-2 md:px-2 py-1.5 md:py-1.5 w-full md:w-fit min-h-9 transition-colors",
          toOpen ? "bg-[#ECEEF2]" : "bg-transparent hover:bg-[#ECEEF2]",
        )}
      >
        <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap shrink-0">
          {defaultToLabel}
        </span>
        <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate flex-1 min-w-0">
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
    );

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex flex-wrap md:flex-nowrap gap-2">
          {/* From */}
          <div className="flex-1 min-w-0">
            <PickerShell
              open={fromOpen}
              onOpenChange={setFromOpen}
              trigger={fromTrigger}
              isMobile={isMobile}
              title={fromDialogTitle || defaultDialogTitle}
              selectedDate={fromValue}
              onDateChange={handleFromDateChange}
              locale={locale}
              minAllowedDate={minAllowedDate}
              maxAllowedDate={maxAllowedDate}
              withTime={withTime}
              pickerDateLabel={pickerDateLabel}
              pickerTimeLabel={pickerTimeLabel}
            />
          </div>

          {/* To */}
          <div className="flex-1 min-w-0">
            {toDisabled ? (
              <div className="flex items-center justify-between md:justify-center gap-1 md:gap-2 bg-[#ECEEF2] rounded-lg px-2 md:px-2 py-1.5 md:py-1.5 w-full md:w-fit min-h-9 opacity-75">
                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap shrink-0">
                  {defaultToLabel}
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate flex-1 min-w-0">
                  {toValue ? formatFn(toValue, locale) : defaultPlaceholder}
                </span>
              </div>
            ) : (
              <PickerShell
                open={toOpen}
                onOpenChange={setToOpen}
                trigger={toTrigger}
                isMobile={isMobile}
                title={toDialogTitle || defaultDialogTitle}
                selectedDate={toValue}
                onDateChange={handleToDateChange}
                locale={locale}
                minAllowedDate={minAllowedDate}
                maxAllowedDate={maxAllowedDate}
                withTime={withTime}
                pickerDateLabel={pickerDateLabel}
                pickerTimeLabel={pickerTimeLabel}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Single variant ────────────────────────────────────────────────────────
  const singleTrigger = (
    <div
      role="button"
      tabIndex={0}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Input
        readOnly
        value={formatFn(value, locale)}
        placeholder={defaultPlaceholder}
        className={cn(
          "cursor-pointer w-full",
          allowClear && value ? "pe-8" : "",
          inputClassName,
        )}
      />
    </div>
  );

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
          {required && <span className="text-StatusRed text-base">*</span>}
        </label>
      )}
      <div className="relative">
        <PickerShell
          open={singleOpen}
          onOpenChange={setSingleOpen}
          trigger={singleTrigger}
          isMobile={isMobile}
          title={dialogTitle}
          selectedDate={value}
          onDateChange={(d) => {
            if (!d) return;
            onChange?.(d);
            if (!withTime) setSingleOpen(false);
          }}
          locale={locale}
          minAllowedDate={minAllowedDate}
          maxAllowedDate={maxAllowedDate}
          withTime={withTime}
          pickerDateLabel={pickerDateLabel}
          pickerTimeLabel={pickerTimeLabel}
        />
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
