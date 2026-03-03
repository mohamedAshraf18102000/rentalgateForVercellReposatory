"use client"

import { useState } from "react"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/(components)/ui/popover"
import { Input } from "@/app/(components)/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/(components)/ui/select"
import { cn } from "@/lib/utils"
import { Edit } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ar, enUS } from "date-fns/locale"
import "react-day-picker/dist/style.css"
import "@/app/(components)/ui/style.css"
import { buttonVariants } from "@/app/(components)/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SimpleDatePickerProps {
    value?: Date | null
    onChange?: (date: Date | null) => void
    placeholder?: string
    dialogTitle?: string
    className?: string
    locale?: string
    allowPastOnly?: boolean // For birthdate - only allow past dates
    allowFutureOnly?: boolean // For license expiration - only allow future dates (from tomorrow)
}

const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function formatDate(date: Date | null | undefined, locale: string = "ar"): string {
    if (!date) return ""
    
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

export function SimpleDatePicker({
    value,
    onChange,
    placeholder,
    dialogTitle,
    className,
    locale = "ar",
    allowPastOnly = false,
    allowFutureOnly = false,
}: SimpleDatePickerProps) {
    const [open, setOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number | null>(
        value ? value.getFullYear() : null
    )
    const [selectedMonth, setSelectedMonth] = useState<number | null>(
        value ? value.getMonth() : null
    )

    const isArabic = locale === "ar"
    const dayPickerLocale = isArabic ? ar : enUS

    const defaultPlaceholder = placeholder || (isArabic ? "اختر التاريخ" : "Select date")
    const defaultDialogTitle = dialogTitle || (isArabic ? "اختر التاريخ" : "Select date")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate date restrictions
    let minAllowedDate: Date | null = null
    let maxAllowedDate: Date | null = null
    let fromYear: number | undefined
    let toYear: number | undefined

    if (allowPastOnly) {
        // For birthdate: allow dates from any past year, but don't show years older than 21 years ago
        // Maximum year to show: 21 years ago
        const maxYearToShow = today.getFullYear() - 21
        fromYear = undefined // No minimum year limit (open)
        toYear = today.getFullYear() - 1 // Last year (since we can't select today)
        
        // minAllowedDate is not set (no minimum limit)
        minAllowedDate = null
        
        maxAllowedDate = new Date(today)
        maxAllowedDate.setDate(today.getDate() - 1) // Yesterday
        maxAllowedDate.setHours(23, 59, 59, 999)
    } else if (allowFutureOnly) {
        // For license expiration: allow dates from tomorrow onwards
        minAllowedDate = new Date(today)
        minAllowedDate.setDate(today.getDate() + 1) // Tomorrow
        minAllowedDate.setHours(0, 0, 0, 0)
        
        maxAllowedDate = new Date(today)
        maxAllowedDate.setFullYear(today.getFullYear() + 100) // Far future
        maxAllowedDate.setHours(23, 59, 59, 999)
    }

    // Generate years list for birthdate
    // Show years from (current year - 20) and older (e.g., if current year is 2025, show 2005, 2004, 2003, ...)
    // Do NOT show years from (current year - 19) to (current year - 1) (e.g., 2006, 2007, ..., 2024)
    const years: number[] = []
    if (allowPastOnly) {
        const cutoffYear = today.getFullYear() - 20 // 20 years ago (e.g., 2005 if current year is 2025)
        // Show all years from cutoffYear down to a reasonable past year (e.g., 100 years ago)
        // This includes cutoffYear itself (e.g., 2005) and all years before it
        const startYear = cutoffYear // Include the cutoff year itself (2005)
        const endYear = today.getFullYear() - 100 // 100 years ago as reasonable limit
        for (let year = startYear; year >= endYear; year--) {
            years.push(year)
        }
    } else if (allowFutureOnly) {
        // Generate future years list for license expiration
        // Show years from current year onwards (e.g., if current year is 2025, show 2025, 2026, 2027, ...)
        const startYear = today.getFullYear() // Current year
        const endYear = today.getFullYear() + 20 // 20 years in the future
        for (let year = startYear; year <= endYear; year++) {
            years.push(year)
        }
    }

    // Update selectedYear and selectedMonth when value changes from outside
    React.useEffect(() => {
        if (value) {
            setSelectedYear(value.getFullYear())
            setSelectedMonth(value.getMonth())
        }
    }, [value])

    // Set to closest available year (first in list) when popover opens and no value is set
    React.useEffect(() => {
        if (open && !value && years.length > 0) {
            // Set to closest available year (first in list) when popover opens
            // For past: first year is most recent (e.g., 2005)
            // For future: first year is current year (e.g., 2025)
            if (!selectedYear || (allowFutureOnly && selectedYear !== years[0])) {
                setSelectedYear(years[0])
            }
        }
    }, [open, value, years, selectedYear, allowFutureOnly])

    const handleYearChange = (year: number) => {
        setSelectedYear(year)
        // Update calendar to show the selected year
        // Keep the same month if available, otherwise use January
        const monthToUse = selectedMonth !== null ? selectedMonth : (value?.getMonth() || 0)
        setSelectedMonth(monthToUse)
        
        if (value) {
            const newDate = new Date(value)
            newDate.setFullYear(year)
            // Adjust day if needed (e.g., Feb 29 in non-leap year)
            if (newDate.getDate() !== value.getDate()) {
                newDate.setDate(0) // Last day of previous month
            }
            onChange?.(newDate)
        } else {
            // Set to January 1st of selected year
            const newDate = new Date(year, 0, 1)
            onChange?.(newDate)
        }
    }

    // Calculate month for DayPicker based on selected year or value
    // This will update the calendar view when year changes
    const calendarMonth = selectedYear !== null
        ? new Date(selectedYear, selectedMonth !== null ? selectedMonth : (value?.getMonth() || 0), 1)
        : value || undefined

    // Handle popover open to set current year
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen && !value && years.length > 0) {
            // Set to current year (first in list) when popover opens
            if (!selectedYear) {
                setSelectedYear(years[0])
            }
        }
    }

    return (
        <div className={cn("space-y-2", className)}>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Input
                            readOnly
                            value={formatDate(value, locale)}
                            placeholder={defaultPlaceholder}
                            className="cursor-pointer"
                        />
                        <Edit className="h-4 w-4 text-muted-foreground" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2">
                        <div className="text-sm font-semibold mb-2">{defaultDialogTitle}</div>
                        {(allowPastOnly || allowFutureOnly) && years.length > 0 && (
                            <div className="mb-3">
                                <Select
                                    value={selectedYear?.toString() || years[0]?.toString() || ""}
                                    onValueChange={(val) => handleYearChange(parseInt(val))}
                                    defaultValue={years[0]?.toString()}
                                    key={`year-select-${open}-${years[0]}`}
                                >
                                    <SelectTrigger className="w-full" size="sm">
                                        <SelectValue placeholder={isArabic ? "اختر السنة" : "Select year"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="[&_.rdp]:scale-90 [&_.rdp]:origin-top-left [&_.rdp-table]:text-xs [&_.rdp-cell]:h-7 [&_.rdp-cell]:w-7 [&_.rdp-day]:text-xs [&_.rdp-caption]:text-sm [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:h-6">
                            <DayPicker
                            mode="single"
                            selected={value || undefined}
                            month={calendarMonth}
                            onMonthChange={(date: Date) => {
                                setSelectedMonth(date.getMonth())
                                setSelectedYear(date.getFullYear())
                            }}
                            onSelect={(date: Date | undefined) => {
                                onChange?.(date || null)
                                if (date) {
                                    setSelectedYear(date.getFullYear())
                                    setSelectedMonth(date.getMonth())
                                }
                                setOpen(false)
                            }}
                            locale={dayPickerLocale}
                            fromYear={fromYear}
                            toYear={toYear}
                            disabled={(date) => {
                                const dateToCheck = new Date(date)
                                dateToCheck.setHours(0, 0, 0, 0)
                                
                                if (allowPastOnly) {
                                    // Disable dates after yesterday (today and future)
                                    if (dateToCheck >= today) {
                                        return true
                                    }
                                    // Disable dates before minAllowedDate
                                    if (minAllowedDate && dateToCheck < minAllowedDate) {
                                        return true
                                    }
                                    return false
                                } else if (allowFutureOnly) {
                                    // Disable dates before tomorrow (today and past)
                                    if (dateToCheck <= today) {
                                        return true
                                    }
                                    // Disable dates after maxAllowedDate (shouldn't happen, but just in case)
                                    if (maxAllowedDate && dateToCheck > maxAllowedDate) {
                                        return true
                                    }
                                    return false
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
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

