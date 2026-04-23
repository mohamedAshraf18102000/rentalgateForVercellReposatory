"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/app/(components)/ui/button";

const CALENDAR_STYLES = `

  .cal-root {
    padding: 24px;
    font-family: 'Geist Mono', monospace;
    width: fit-content;
    --cell: 2.5rem;
    --accent: #1a1a1a;
    --range-bg: transparent;
  }

  /* ── Header ── */
  .cal-caption {
    font-family: 'arial', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: #1a1a1a;
    letter-spacing: 0.01em;
  }

  .cal-nav-btn {
    width: var(--cell);
    height: var(--cell);
    border-radius: 8px;
    border: 1px solid #e8e4de;
    background: #fff;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .cal-nav-btn:hover {
    background: #f5f2ee;
    border-color: #d4cfc8;
    color: #1a1a1a;
  }
  .cal-nav-btn[aria-disabled="true"] {
    opacity: 0.25;
    pointer-events: none;
  }

  /* ── Weekday labels ── */
  .cal-weekdays-row {
    display: flex;
    border-bottom: 1px solid #f0ede8;
    padding-bottom: 8px;
    margin-bottom: 6px;
  }
  .cal-weekday {
    font-family: 'Geist Mono', monospace;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #c0b9b0;
    text-align: center;
    width: var(--cell);
    flex: 1;
  }

  /* ── Week row ── */
  .cal-week {
    display: flex;
    align-items: stretch;
    margin-bottom: 2px;
  }

  /* ── Day cell wrapper ── */
  /*
    Each day cell is positioned relatively.
    We use a ::before pseudo on the cell itself to paint the
    range highlight band, and the <button> sits on top.
  */
  .cal-day-cell {
    position: relative;
    width: var(--cell);
    flex: 1;
    height: var(--cell);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* range-middle: full-width warm band */
  .cal-day-cell.range-middle::before {
    content: '';
    position: absolute;
    inset-block: 4px;
    inset-inline: 0;
    background: var(--range-bg);
    z-index: 0;
  }

  /* range-start: band only on the RIGHT half */
  .cal-day-cell.range-start::before {
    content: '';
    position: absolute;
    inset-block: 4px;
    left: 50%;
    right: 0;
    background: var(--range-bg);
    z-index: 0;
  }

  /* range-end: band only on the LEFT half */
  .cal-day-cell.range-end::before {
    content: '';
    position: absolute;
    inset-block: 4px;
    left: 0;
    right: 50%;
    background: var(--range-bg);
    z-index: 0;
  }

  /* ── Day button ── */
  .cal-day-btn {
    position: relative;
    z-index: 1;
    width: var(--cell);
    height: var(--cell);
    border-radius: 50%;
    border: 1.5px solid transparent;
    color: #2a2520;
    font-family: 'Geist Mono', monospace;
    font-size: 0.78rem;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    outline: none;
    letter-spacing: 0.02em;
  }
  .cal-day-btn:hover {
    background: #ece9e4;
    color: #1a1a1a;
  }

  /* Today ring */
  .cal-today .cal-day-btn {
    border-color: #000000;
    color: #000000;
    font-weight: 900;
  }

  /* Outside month */
  .cal-outside .cal-day-btn {
    color: #ccc8c2;
  }

  /* Disabled */
  .cal-disabled .cal-day-btn {
    color: #ddd9d4;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── SINGLE SELECTED (no range) ── full circle */
  .cal-day-btn.is-selected-single {
    background: var(--accent) !important;
    border-color: var(--accent) !important;
    color: #fff !important;
    font-weight: 500;
    border-radius: 50% !important;
  }

  /* ── RANGE START ── left half circle (flat on right) */
  .cal-day-btn.is-range-start {
    background: var(--accent) !important;
    border-color: var(--accent) !important;
    color: #fff !important;
    font-weight: 500;
    border-radius: 0 30% 30% 0 !important;
  }

  /* ── RANGE END ── right half circle (flat on left) */
  .cal-day-btn.is-range-end {
    background: var(--accent) !important;
    border-color: var(--accent) !important;
    color: #fff !important;
    font-weight: 500;
    border-radius: 30% 0 0 30% !important;
  }

  /* ── RANGE MIDDLE ── no fill, sits on top of the band */
  .cal-day-btn.is-range-middle {
    border-color: transparent !important;
    color: #2a2520 !important;
    border-radius: 0 !important;
  }
  .cal-day-btn.is-range-middle:hover {
    background: rgba(0,0,0,0.06) !important;
  }

  /* Focus */
  .cal-day-btn:focus-visible {
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #1a1a1a;
  }
`;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  formatters,
  components,
  startMonth,
  endMonth,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();
  const today = new Date();
  const defaultStartMonth = new Date(today.getFullYear() - 50, 0);
  const defaultEndMonth = new Date(today.getFullYear() + 10, 11);

  return (
    <>
      <style>{CALENDAR_STYLES}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("cal-root group/calendar", className)}
        captionLayout={captionLayout}
        startMonth={startMonth ?? defaultStartMonth}
        endMonth={endMonth ?? defaultEndMonth}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit", defaultClassNames.root),
          months: cn(
            "relative flex flex-col gap-6 md:flex-row",
            defaultClassNames.months,
          ),
          month: cn("flex w-full flex-col gap-1", defaultClassNames.month),
          nav: cn(
            "absolute inset-x-0 top-0 flex w-full items-center justify-between",
            defaultClassNames.nav,
          ),
          button_previous: cn("cal-nav-btn", defaultClassNames.button_previous),
          button_next: cn("cal-nav-btn", defaultClassNames.button_next),
          month_caption: cn(
            "flex h-10 w-full items-center justify-center px-10 mb-3",
            defaultClassNames.month_caption,
          ),
          dropdowns: cn(
            "flex h-10 w-full items-center justify-center gap-2",
            defaultClassNames.dropdowns,
          ),
          dropdown_root: cn(
            "relative rounded border border-stone-200",
            defaultClassNames.dropdown_root,
          ),
          dropdown: cn(
            "relative h-8 cursor-pointer appearance-none bg-transparent px-2 pr-6 text-sm opacity-100",
            defaultClassNames.dropdown,
          ),
          caption_label: cn("cal-caption", defaultClassNames.caption_label),
          table: "w-full border-collapse",
          weekdays: cn("cal-weekdays-row", defaultClassNames.weekdays),
          weekday: cn("cal-weekday", defaultClassNames.weekday),
          week: cn("cal-week", defaultClassNames.week),
          week_number_header: cn(
            "w-10 select-none",
            defaultClassNames.week_number_header,
          ),
          week_number: cn(
            "text-xs text-stone-300 select-none",
            defaultClassNames.week_number,
          ),
          day: cn("cal-day-cell", defaultClassNames.day),
          range_start: cn("range-start", defaultClassNames.range_start),
          range_middle: cn("range-middle", defaultClassNames.range_middle),
          range_end: cn("range-end", defaultClassNames.range_end),
          today: cn("cal-today", defaultClassNames.today),
          outside: cn("cal-outside ", defaultClassNames.outside),
          disabled: cn("cal-disabled", defaultClassNames.disabled),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          ),
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left")
              return (
                <ChevronRightIcon
                  className={cn(
                    "size-5 stroke-0 stroke-width-0 fill-black!",
                    className,
                  )}
                  {...props}
                />
              );
            if (orientation === "right")
              return (
                <ChevronLeftIcon
                  className={cn(
                    "5 stroke-0 stroke-width-0 fill-black!",
                    className,
                  )}
                  {...props}
                />
              );
            return (
              <ChevronDownIcon
                className={cn(
                  "5 stroke-0 stroke-width-0 fill-black!",
                  className,
                )}
                {...props}
              />
            );
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...props }) => (
            <td {...props}>
              <div className="flex size-10 items-center justify-center text-center">
                {children}
              </div>
            </td>
          ),
          ...components,
        }}
        {...props}
      />
    </>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isRangeStart = !!modifiers.range_start;
  const isRangeEnd = !!modifiers.range_end;
  const isRangeMiddle = !!modifiers.range_middle;
  const isSelectedSingle =
    !!modifiers.selected && !isRangeStart && !isRangeEnd && !isRangeMiddle;

  return (
    <button
      ref={ref}
      className={cn(
        "cal-day-btn",
        isSelectedSingle && "is-selected-single",
        isRangeStart && "is-range-start",
        isRangeEnd && "is-range-end",
        isRangeMiddle && "is-range-middle",
        className,
      )}
      data-day={day.date.toLocaleDateString()}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
