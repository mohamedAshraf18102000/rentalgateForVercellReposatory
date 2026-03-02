"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Edit } from "lucide-react"
import { EditIcon } from "@/constants/icons"
import { DayPicker } from "react-day-picker"
import { ar, enUS } from "date-fns/locale"
import "react-day-picker/dist/style.css"
import "./style.css"
import { Button, buttonVariants } from "./button"
interface DatePickerProps {
    label?: string
    value?: Date | null
    onChange?: (date: Date | null) => void
    placeholder?: string
    fromLabel?: string
    toLabel?: string
    fromValue?: Date | null
    toValue?: Date | null
    onFromChange?: (date: Date | null) => void
    onToChange?: (date: Date | null) => void
    dialogTitle?: string
    fromDialogTitle?: string
    toDialogTitle?: string
    errorMessage?: string
    className?: string
    toDisabled?: boolean
    minDaysFromToday?: number
    minDate?: Date | null // Minimum allowed date
    locale?: string
}

const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function formatDate(date: Date | null | undefined, locale: string = "ar"): string {
    if (!date) return ""
    
    // Ensure date is a Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return ""
    
    const isArabic = locale === "ar"
    const days = isArabic ? arabicDays : englishDays
    const day = days[dateObj.getDay()]
    const dayNum = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    
    return `${day} ${dayNum}-${month}-${year}`
}

export function DatePicker({
    label,
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
    toDisabled = false,
    minDaysFromToday = 0,
    minDate,
    locale = "ar",
}: DatePickerProps) {
    const [open, setOpen] = useState(false)
    const [isFromSelected, setIsFromSelected] = useState(true)

    const isArabic = locale === "ar"
    const dayPickerLocale = isArabic ? ar : enUS

    // Default values based on locale
    const defaultPlaceholder = placeholder || (isArabic ? "اختر التاريخ" : "Select date")
    const defaultFromLabel = fromLabel || (isArabic ? "من:" : "From:")
    const defaultToLabel = toLabel || (isArabic ? "إلى:" : "To:")
    const defaultDialogTitle = dialogTitle || (isArabic ? "حدد يوم أستلام السيارة:" : "Select car pickup day:")

    const isRange = (onFromChange !== undefined || onToChange !== undefined)

    const displayValue = isRange 
        ? (isFromSelected ? fromValue : toValue)
        : value

    const CalendarContent = () => {
        const selectedDateForPicker = isRange
            ? (isFromSelected ? fromValue : toValue)
            : value

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Calculate minimum allowed date
        // Use minDate if provided, otherwise use today
        let minAllowedDate: Date;
        if (minDate) {
            minAllowedDate = new Date(minDate)
            minAllowedDate.setHours(0, 0, 0, 0)
            // If minDate is in the past, use today instead
            if (minAllowedDate < today) {
                minAllowedDate = new Date(today)
            }
        } else {
            minAllowedDate = new Date(today)
            minAllowedDate.setHours(0, 0, 0, 0)
        }
        
        // Calculate maximum allowed date based on minDaysFromToday
        // Only allow minDaysFromToday days from today (including today)
        // If minDaysFromToday = 2, allow today and tomorrow (2 days total)
        // If minDate is provided, don't limit maximum date (allow all future dates)
        let maxAllowedDate: Date | null = null;
        if (!minDate && minDaysFromToday > 0) {
            maxAllowedDate = new Date(today)
            maxAllowedDate.setDate(today.getDate() + minDaysFromToday - 1)
            maxAllowedDate.setHours(23, 59, 59, 999)
        }

        // When selecting toDate, show range from fromDate to toDate
        const shouldShowRange = isRange && !isFromSelected && fromValue

        if (shouldShowRange) {
            // Range mode for toDate picker
            // Set defaultMonth to toValue if available, otherwise use fromValue, otherwise use minAllowedDate
            const defaultMonthForRange = toValue 
                ? toValue 
                : fromValue 
                    ? fromValue 
                    : minAllowedDate

            return (
                <DayPicker
                    mode="range"
                    selected={fromValue && toValue ? { from: fromValue, to: toValue } : fromValue ? { from: fromValue } : undefined}
                    defaultMonth={defaultMonthForRange}
                    onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                        if (range?.from && range?.to) {
                            onToChange?.(range.to)
                        } else if (range?.from && !range.to) {
                            // Still selecting range
                            onToChange?.(range.from)
                        }
                    }}
                    locale={dayPickerLocale}
                    disabled={(date) => {
                        const dateToCheck = new Date(date)
                        dateToCheck.setHours(0, 0, 0, 0)
                        // Disable dates before today
                        if (dateToCheck < minAllowedDate) {
                            return true
                        }
                        // For toDate, don't limit the maximum date (open to infinity)
                        // Only check if date is before fromDate
                        if (fromValue) {
                            const fromDateCheck = new Date(fromValue)
                            fromDateCheck.setHours(0, 0, 0, 0)
                            return dateToCheck < fromDateCheck
                        }
                        return false
                    }}
                    components={{
                        Chevron: ({ orientation }) => {
                            if (orientation === "left") {
                                return <div className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            }
                            return <div className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                <ChevronLeft className="h-4 w-4" />
                            </div>
                        },
                    }}
                />
            )
        }

        // Single mode for fromDate picker or single date picker
        // Set defaultMonth to selected date if available, otherwise use minAllowedDate
        const defaultMonth = selectedDateForPicker 
            ? selectedDateForPicker 
            : minAllowedDate

        return (
            <DayPicker
                mode="single"
                selected={selectedDateForPicker || undefined}
                defaultMonth={defaultMonth}
                onSelect={(date: Date | undefined) => {
                    if (isRange) {
                        if (isFromSelected) {
                            onFromChange?.(date || null)
                        } else {
                            onToChange?.(date || null)
                        }
                    } else {
                        onChange?.(date || null)
                        setOpen(false)
                    }
                }}
                locale={dayPickerLocale}
                disabled={(date) => {
                    const dateToCheck = new Date(date)
                    dateToCheck.setHours(0, 0, 0, 0)
                    // Disable dates before minAllowedDate
                    if (dateToCheck < minAllowedDate) {
                        return true
                    }
                    // Disable dates after maxAllowedDate (only if maxAllowedDate is set)
                    if (maxAllowedDate && dateToCheck > maxAllowedDate) {
                        return true
                    }
                    return false
                }}
                components={{
                    Chevron: ({ orientation }) => {
                        if (orientation === "left") {
                            return <div className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        }
                        return <div className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                    },
                }}
            />
    )
    }

    return (
        <div className={cn("space-y-2", className)}>
            {isRange ? (
                <div className="flex flex-wrap md:flex-nowrap gap-2">
                    <div className="flex-1 min-w-0">
                        <Popover
                            open={isFromSelected && open}
                            onOpenChange={(isOpen) => {
                                setOpen(isOpen)
                                setIsFromSelected(true)
                            }}
                        >
                            <PopoverTrigger asChild>
                                <div 
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                        "flex items-center justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit transition-colors",
                                        (isFromSelected && open) ? "bg-[#ECEEF2]" : "bg-transparent hover:bg-[#ECEEF2]"
                                    )}
                                >
                                    <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">{defaultFromLabel}</span>
                                    <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                                        {fromValue ? formatDate(fromValue, locale) : defaultPlaceholder}
                                    </span>
                                    <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                                        <EditIcon />
                                    </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="p-[16px]">
                                    <div className="text-[16px] font-semibold mb-2">{fromDialogTitle || defaultDialogTitle}</div>
                                    <hr className="my-4" />
                                    <CalendarContent />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex-1 min-w-0">
                        {toDisabled ? (
                            <div className="flex items-center justify-center gap-1 md:gap-2 bg-[#ECEEF2] rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit opacity-75">
                                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">{defaultToLabel}</span>
                                <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                                    {toValue ? formatDate(toValue, locale) : defaultPlaceholder}
                                </span>
                            </div>
                        ) : (
                        <Popover
                            open={!isFromSelected && open}
                            onOpenChange={(isOpen) => {
                                setOpen(isOpen)
                                setIsFromSelected(false)
                            }}
                        >
                            <PopoverTrigger asChild>
                                    <div 
                                        role="button"
                                        tabIndex={0}
                                        className={cn(
                                            "flex items-center justify-center gap-1 md:gap-2 cursor-pointer rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-full md:w-fit transition-colors",
                                            (!isFromSelected && open) ? "bg-[#ECEEF2]" : "bg-transparent hover:bg-[#ECEEF2]"
                                        )}
                                    >
                                        <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">{defaultToLabel}</span>
                                        <span className="text-xs md:text-sm font-medium text-gray-900 underline truncate">
                                            {toValue ? formatDate(toValue, locale) : defaultPlaceholder}
                                        </span>
                                        <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                                            <EditIcon />
                                        </span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                    <div className="p-[16px]">
                                        <div className="text-[16px] font-semibold mb-2">{toDialogTitle || defaultDialogTitle}</div>
                                        <hr className="my-4" />
                                    <CalendarContent />
                                </div>
                            </PopoverContent>
                        </Popover>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {label && <label className="text-sm font-medium mb-2 block">{label}</label>}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <div 
                                role="button"
                                tabIndex={0}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Input
                                    readOnly
                                    value={formatDate(displayValue, locale)}
                                    placeholder={defaultPlaceholder}
                                    className="cursor-pointer"
                                />
                                {/* <Edit className="h-4 w-4 text-muted-foreground" /> */}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2">
                                <div className="text-sm font-semibold mb-2">{defaultDialogTitle}</div>
                                <CalendarContent />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    )
}

