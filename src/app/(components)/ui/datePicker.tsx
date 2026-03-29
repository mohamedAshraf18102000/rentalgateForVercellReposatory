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

export function DatePicker({
  label,
  value,
}: {
  label: string;
  value?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

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
              variant="outline"
              id="date-picker-optional"
              className="justify-between font-normal text-sm bg-Grey100"
            >
              {date ? format(date, "PPP") : "أختر تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  );
}
