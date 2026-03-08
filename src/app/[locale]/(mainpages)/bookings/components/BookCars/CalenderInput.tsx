"use client";

import * as React from "react";
import { Field, FieldLabel } from "@/app/(components)/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(components)/ui/popover";
import { Button } from "@/app/(components)";
import { Calendar } from "@/app/(components)/ui/calendar";
import CarRentIcon from "@/constants/icons/CarRentIcon";

export function CalInput() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <Field className="">
      <FieldLabel className="text-base text-primary" htmlFor="date">
        <CarRentIcon />
        مدة الإيجار:
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start font-normal border-2 border-Grey400! rounded-xl!"
          >
            <span className="text-Grey600">
              {date ? date.toLocaleDateString() : "من ..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
