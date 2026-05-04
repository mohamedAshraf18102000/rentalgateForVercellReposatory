"use client";

import * as React from "react";
import { Button } from "@/app/(components)/ui/button";
import { Calendar } from "@/app/(components)/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/app/(components)/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(components)/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export function DatePicker({
  label,
  value,
  onChange,
  fromYear,
  toYear,
  className,
}: {
  label: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  fromYear?: number;
  toYear?: number;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  const startMonth = fromYear ? new Date(fromYear, 0) : undefined;
  const endMonth = toYear ? new Date(toYear, 11) : undefined;

  // Sync state if prop changes
  React.useEffect(() => {
    if (value) setDate(value);
  }, [value]);

  return (
    <FieldGroup className="flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional" className="text-base!">
          {label}
        </FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              startIcon={
                <CalendarIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-Grey600" />
              }
              variant="outline"
              id="date-picker-optional"
              className={cn(
                "font-normal text-sm bg-Grey100 flex justify-baseline relative px-7",
                className,
              )}
            >
              {date ? (
                format(date, "PPP")
              ) : (
                <span className="text-Grey600">أختر تاريخ</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              startMonth={startMonth}
              endMonth={endMonth}
              onSelect={(date) => {
                setDate(date);
                onChange?.(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  );
}
