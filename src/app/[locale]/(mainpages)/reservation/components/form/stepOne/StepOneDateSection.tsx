"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { LucideIcon } from "lucide-react";

import { DateTimePicker } from "@/app/(components)/ui/dateTime-picker";
import CarRentIcon from "@/constants/icons/CarRentIcon";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";

interface StepOneDateSectionProps {
  control: Control<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
  watch: UseFormWatch<ReservationFormValues>;
  setValue: UseFormSetValue<ReservationFormValues>;
  ArrowIcon: LucideIcon;
  fromDate: Date | undefined;
  minToDate: Date | null;
  rentalPeriodLabel: string;
  pickupDatePlaceholder: string;
  dropoffDatePlaceholder: string;
  isDateBlocked: (date: Date, minBoundary?: Date | null) => boolean;
  isDateTimeBlocked: (
    date: Date | null | undefined,
    minBoundary?: Date | null,
  ) => boolean;
  normalizeDateTimeToAvailability: (
    date: Date | null,
    minBoundary?: Date | null,
  ) => Date | null;
  isDateLessThanMinimumRental: (
    startDate: Date | null | undefined,
    endDate: Date | null | undefined,
  ) => boolean;
}

const StepOneDateSection = ({
  control,
  errors,
  watch,
  setValue,
  ArrowIcon,
  fromDate,
  minToDate,
  rentalPeriodLabel,
  pickupDatePlaceholder,
  dropoffDatePlaceholder,
  isDateBlocked,
  isDateTimeBlocked,
  normalizeDateTimeToAvailability,
  isDateLessThanMinimumRental,
}: StepOneDateSectionProps) => {
  return (
    <div className="mb-1 flex w-full flex-col items-start gap-3 lg:flex-row lg:items-end">
      <div className="w-full">
        <Controller
          name="fromDate"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              required
              labelClassName="text-base!"
              placeholder={pickupDatePlaceholder}
              {...field}
              label={rentalPeriodLabel}
              labelIcon={<CarRentIcon />}
              className="w-full"
              inputClassName="text-base!"
              withTime
              allowClear
              isDateDisabled={(date) => isDateBlocked(date)}
              isTimeDisabled={(date) => isDateTimeBlocked(date)}
              value={field.value}
              onChange={(date: Date | null) => {
                const nextDate = normalizeDateTimeToAvailability(date);
                if (date && !nextDate) {
                  return;
                }

                field.onChange(nextDate);
                if (isDateLessThanMinimumRental(nextDate, watch("toDate"))) {
                  setValue("toDate", undefined);
                }
              }}
            />
          )}
        />
        {errors.fromDate && (
          <p className="text-StatusRedBG text-xs mb-3 flex items-center gap-1">
            {String(errors.fromDate?.message)}
          </p>
        )}
      </div>
      <ArrowIcon className="hidden h-12 w-12 shrink-0 pt-5 lg:block" />
      <div className="w-full">
        <Controller
          name="toDate"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              required
              placeholder={dropoffDatePlaceholder}
              {...field}
              className="w-full"
              inputClassName="text-base!"
              withTime
              allowClear
              minDate={minToDate ?? undefined}
              isDateDisabled={(date) => isDateBlocked(date, minToDate)}
              isTimeDisabled={(date) => isDateTimeBlocked(date, minToDate)}
              value={field.value}
              onChange={(date: Date | null) => {
                if (!date) {
                  field.onChange(null);
                  return;
                }

                const nextDate = normalizeDateTimeToAvailability(
                  date,
                  minToDate,
                );
                if (!nextDate) {
                  return;
                }

                if (isDateLessThanMinimumRental(fromDate, nextDate)) {
                  field.onChange(minToDate ?? nextDate);
                  return;
                }

                field.onChange(nextDate);
              }}
            />
          )}
        />
        {errors.toDate && (
          <p className="text-StatusRedBG text-xs mb-3 flex items-center gap-1">
            {String(errors.toDate?.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepOneDateSection;
