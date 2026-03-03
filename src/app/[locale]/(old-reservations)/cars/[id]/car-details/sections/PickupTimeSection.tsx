import React, { useEffect, useState, useRef } from 'react';
import { SeparatorWithContent } from '@/app/(components)/ui/separator-with-content';
import { TimeSlotSelector } from '@/app/(components)/ui/time-slot-selector';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/(components)/ui/popover';
import { DayPicker } from 'react-day-picker';
import { ar } from 'date-fns/locale';
import { Button } from '@/app/(components)/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EditIcon } from '@/constants/icons';
import { useFilterStore } from '@/lib/api/stores/filter.store';
import { useSharedStore } from '@/lib/api/stores/shared.store';
import { useValidationStore } from '@/lib/api/stores/validation.store';
import { getCookie, setCookie } from '@/util/cookies';
import { getBranchWorkingHours, type WorkingHours, type BreakTime } from '@/lib/api/services/shared.service';
import { cn } from '@/lib/utils';
import { isToday, getDay } from 'date-fns';

interface PickupTimeSectionProps {
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
  locale: string;
  setPickupDate: (date: Date | null) => void;
  setDropoffDate: (date: Date | null) => void;
  setPickupTime: (time: string) => void;
  setDropoffTime: (time: string) => void;
  pickupLocation: 'branch' | 'location';
  t: (key: string) => string;
  disabled?: boolean;
}

export const PickupTimeSection: React.FC<PickupTimeSectionProps> = ({
  pickupDate,
  dropoffDate,
  pickupTime,
  dropoffTime,
  locale,
  setPickupDate,
  setDropoffDate,
  setPickupTime,
  setDropoffTime,
  pickupLocation,
  t,
  disabled = false,
}) => {
  const { fromDate, toDate, setFromDate, setToDate } = useFilterStore();
  const { fromBranch, toBranch } = useValidationStore();
  const [pickupWorkingHours, setPickupWorkingHours] = useState<WorkingHours | null>(null);
  const [dropoffWorkingHours, setDropoffWorkingHours] = useState<WorkingHours | null>(null);
  const isInitialLoad = useRef(true);

  // Get shared data from store
  const sharedData = useSharedStore((state) => state.sharedData);
  
  // Get NUM_HOURS_FOR_START_RESERVATION_FROM_BRANCH from settings (default to 0 if not found) and add 1 day
  const numHours = sharedData?.settings?.NUM_HOURS_FOR_START_RESERVATION_FROM_BRANCH;
  const minDaysReservation = numHours
      ? parseInt(String(Number(numHours) / 24), 10) + 2
      : 1;

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const isArabic = locale === 'ar';
    const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = isArabic ? arabicDays[date.getDay()] : englishDays[date.getDay()];
    const dayNum = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} ${dayNum}-${month}-${year}`;
  };

  // Fetch pickup branch working hours
  useEffect(() => {
    const fetchPickupWorkingHours = async () => {
      if (pickupLocation === 'branch' && fromBranch) {
        try {
          const hours = await getBranchWorkingHours(fromBranch);
          setPickupWorkingHours(hours);
        } catch (error) {
          console.error('Error fetching pickup working hours:', error);
          setPickupWorkingHours(null);
        }
      } else {
        setPickupWorkingHours(null);
      }
    };

    fetchPickupWorkingHours();
  }, [fromBranch, pickupLocation]);

  // Fetch dropoff branch working hours
  useEffect(() => {
    const fetchDropoffWorkingHours = async () => {
      if (pickupLocation === 'branch' && toBranch) {
        try {
          const hours = await getBranchWorkingHours(toBranch);
          setDropoffWorkingHours(hours);
        } catch (error) {
          console.error('Error fetching dropoff working hours:', error);
          setDropoffWorkingHours(null);
        }
      } else {
        setDropoffWorkingHours(null);
      }
    };

    fetchDropoffWorkingHours();
  }, [toBranch, pickupLocation]);

  // Sync dates from filter store to validation store (always sync when filter store changes)
  useEffect(() => {
    if (fromDate) {
      // Check if dates are different before updating to avoid unnecessary updates
      const fromDateTime = fromDate.getTime();
      const pickupDateTime = pickupDate?.getTime();
      if (fromDateTime !== pickupDateTime) {
        setPickupDate(fromDate);
      }
    } else if (pickupDate) {
      // If fromDate is null but pickupDate exists, clear pickupDate
      setPickupDate(null);
    }
  }, [fromDate, pickupDate, setPickupDate]);

  useEffect(() => {
    if (toDate) {
      // Check if dates are different before updating to avoid unnecessary updates
      const toDateTime = toDate.getTime();
      const dropoffDateTime = dropoffDate?.getTime();
      if (toDateTime !== dropoffDateTime) {
        setDropoffDate(toDate);
      }
    } else if (dropoffDate) {
      // If toDate is null but dropoffDate exists, clear dropoffDate
      setDropoffDate(null);
    }
  }, [toDate, dropoffDate, setDropoffDate]);

  // Helper function to get current time rounded to nearest 30 minutes
  const getCurrentTimeRounded = (): string => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Round to nearest 30 minutes
    const roundedMinutes = Math.ceil(minutes / 30) * 30;
    if (roundedMinutes >= 60) {
      const finalHours = (hours + 1) % 24;
      const finalMinutes = roundedMinutes % 60;
      return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
  };

  // Helper function to get day name from date
  const getDayName = (date: Date): string | null => {
    const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return dayNames[dayIndex];
  };

  // Helper function to parse time string (HH:mm:ss) to hours and minutes
  const parseTimeString = (timeString: string | null | undefined): { hour: number; minute: number } | null => {
    if (!timeString) return null;
    const parts = timeString.split(':');
    if (parts.length < 2) return null;
    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    if (isNaN(hour) || isNaN(minute)) return null;
    return { hour, minute };
  };

  // Helper function to check if a day is open (has working hours)
  const isDayOpen = (dayKey: string, workingHoursData: WorkingHours | null): boolean => {
    if (!workingHoursData) return false;
    const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
    const openTime = workingHoursData[openTimeKey];
    return openTime !== null && openTime !== undefined;
  };

  // Helper function to check if a time is during a break period
  const isTimeInBreak = (
    timeInMinutes: number,
    date: Date,
    workingHoursData: WorkingHours | null
  ): boolean => {
    if (!workingHoursData || !workingHoursData.breaks || workingHoursData.breaks.length === 0) {
      return false;
    }

    // Get day of week from date
    const dayIndex = getDay(date);
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDayName = dayNames[dayIndex];

    // Get breaks for current day
    const dayBreaks = workingHoursData.breaks.filter(
      (breakItem) => breakItem.dayOfWeek === currentDayName
    );

    if (dayBreaks.length === 0) {
      return false;
    }

    // Check if current time falls within any break period
    for (const breakItem of dayBreaks) {
      const breakStart = parseTimeString(breakItem.startTime);
      const breakEnd = parseTimeString(breakItem.endTime);

      if (breakStart && breakEnd) {
        const breakStartMinutes = breakStart.hour * 60 + breakStart.minute;
        const breakEndMinutes = breakEnd.hour * 60 + breakEnd.minute;

        // Check if current time is within break period (inclusive of both start and end)
        // من البداية لحد النهاية بما فيها النهاية
        if (timeInMinutes >= breakStartMinutes && timeInMinutes <= breakEndMinutes) {
          return true;
        }
      }
    }

    return false;
  };

  // Function to find the nearest available time slot
  const findNearestAvailableTime = (
    startTime: string,
    date: Date | null,
    isLocationPickup: boolean,
    workingHoursData: WorkingHours | null
  ): string => {
    if (!date) return startTime;

    const now = new Date();
    const isTodayDate = isToday(date);
    const currentDay = getDayName(date);
    const interval = 30; // 30 minutes interval

    // Parse start time
    const [startHourStr, startMinuteStr] = startTime.split(':');
    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr, 10);
    const startTimeInMinutes = startHour * 60 + startMinute;

    // Generate time slots and find first available
    for (let hour = startHour; hour < 24; hour++) {
      const startMin = hour === startHour ? startMinute : 0;
      for (let minute = startMin; minute < 60; minute += interval) {
        if (hour === 23 && minute >= 60) break;

        const timeInMinutes = hour * 60 + minute;
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Check if time is after current time (if today)
        let isAfterCurrentTime = true;
        if (isTodayDate) {
          const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
          isAfterCurrentTime = timeInMinutes > currentTimeInMinutes;
        }

        // Check if time is within working hours (for branch only)
        let isWorkingHours = false;
        if (isLocationPickup) {
          // For location pickup, all future times are available
          isWorkingHours = true;
        } else if (workingHoursData && currentDay) {
          const dayKey = currentDay.toLowerCase();
          const isOpen = isDayOpen(dayKey, workingHoursData);

          if (isOpen) {
            const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
            const closeTimeKey = `${dayKey}CloseTime` as keyof WorkingHours;
            const openTime = workingHoursData[openTimeKey] as string | null | undefined;
            const closeTime = workingHoursData[closeTimeKey] as string | null | undefined;

            const openTimeParsed = parseTimeString(openTime);
            const closeTimeParsed = parseTimeString(closeTime);

            if (openTimeParsed && closeTimeParsed) {
              const openTimeInMinutes = openTimeParsed.hour * 60 + openTimeParsed.minute;
              const closeTimeInMinutes = closeTimeParsed.hour * 60 + closeTimeParsed.minute;

              isWorkingHours =
                timeInMinutes >= openTimeInMinutes &&
                timeInMinutes < closeTimeInMinutes;
            }
          }
        } else {
          // Default: assume 24/7 available
          isWorkingHours = true;
        }

        // Check if time is during a break period (only for branches)
        let isDuringBreak = false;
        if (!isLocationPickup && workingHoursData && date) {
          isDuringBreak = isTimeInBreak(timeInMinutes, date, workingHoursData);
        }

        // Check availability (including break times check)
        const isAvailable = isWorkingHours && isAfterCurrentTime && !isDuringBreak;

        if (isAvailable) {
          return timeValue;
        }
      }
    }

    // If no available time found, return start time (fallback)
    return startTime;
  };

  // Load times from cookies if available, otherwise set to current time or nearest available
  useEffect(() => {
    // Only run on initial load
    if (!isInitialLoad.current) return;

    const savedPickupTime = getCookie('pickupTime');
    const savedDropoffTime = getCookie('dropoffTime');

    // Set pickup time: use saved time if available, otherwise find nearest available time
    if (savedPickupTime) {
      if (pickupTime === '09:30' || !pickupTime) {
        // Check if saved time is still available, if not find nearest available
        const timeToCheck = savedPickupTime;
        const nearestAvailable = findNearestAvailableTime(
          timeToCheck,
          pickupDate || new Date(),
          pickupLocation === 'location',
          pickupWorkingHours
        );
        setPickupTime(nearestAvailable);
        if (nearestAvailable !== savedPickupTime) {
          setCookie('pickupTime', nearestAvailable, 30);
        }
      }
    } else if (!pickupTime || pickupTime === '09:30') {
      const currentTime = getCurrentTimeRounded();
      const nearestAvailable = findNearestAvailableTime(
        currentTime,
        pickupDate || new Date(),
        pickupLocation === 'location',
        pickupWorkingHours
      );
      setPickupTime(nearestAvailable);
      setCookie('pickupTime', nearestAvailable, 30);
    }

    // Set dropoff time: use saved time if available, otherwise use current time
    if (savedDropoffTime) {
      if (dropoffTime === '09:30' || !dropoffTime) {
        const currentTime = getCurrentTimeRounded();
        const nearestAvailable = findNearestAvailableTime(
          currentTime,
          dropoffDate || new Date(),
          pickupLocation === 'location',
          dropoffWorkingHours
        );
        setDropoffTime(nearestAvailable);
        if (nearestAvailable !== savedDropoffTime) {
          setCookie('dropoffTime', nearestAvailable, 30);
        }
      }
    } else if (!dropoffTime || dropoffTime === '09:30') {
      const currentTime = getCurrentTimeRounded();
      const nearestAvailable = findNearestAvailableTime(
        currentTime,
        dropoffDate || new Date(),
        pickupLocation === 'location',
        dropoffWorkingHours
      );
      setDropoffTime(nearestAvailable);
      setCookie('dropoffTime', nearestAvailable, 30);
    }

    isInitialLoad.current = false;
  }, [pickupTime, dropoffTime, setPickupTime, setDropoffTime, pickupDate, dropoffDate, pickupLocation, pickupWorkingHours, dropoffWorkingHours]);

  // Get default time for a date (current time if today, or opening time if future date)
  const getDefaultTimeForDate = (date: Date | null, isLocationPickup: boolean, workingHoursData: WorkingHours | null): string => {
    if (!date) return getCurrentTimeRounded();

    const now = new Date();
    const isTodayDate = isToday(date);
    const currentDay = getDayName(date);

    // If today, use current time rounded
    if (isTodayDate) {
      return getCurrentTimeRounded();
    }

    // If future date, use opening time or default time
    if (isLocationPickup) {
      // For location, use 09:00 as default
      return '09:00';
    } else if (workingHoursData && currentDay) {
      const dayKey = currentDay.toLowerCase();
      const isOpen = isDayOpen(dayKey, workingHoursData);

      if (isOpen) {
        const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
        const openTime = workingHoursData[openTimeKey] as string | null | undefined;
        const openTimeParsed = parseTimeString(openTime);

        if (openTimeParsed) {
          return `${openTimeParsed.hour.toString().padStart(2, '0')}:${openTimeParsed.minute.toString().padStart(2, '0')}`;
        }
      }
    }

    // Default fallback
    return '09:00';
  };

  // Update pickup time when date changes (reset to default for new date)
  useEffect(() => {
    // Skip initial load - handled by first useEffect
    if (isInitialLoad.current) return;
    
    if (pickupDate) {
      const defaultTime = getDefaultTimeForDate(
        pickupDate,
        pickupLocation === 'location',
        pickupWorkingHours
      );
      const nearestAvailable = findNearestAvailableTime(
        defaultTime,
        pickupDate,
        pickupLocation === 'location',
        pickupWorkingHours
      );
      setPickupTime(nearestAvailable);
      setCookie('pickupTime', nearestAvailable, 30);
    }
  }, [pickupDate]);

  // Update dropoff time when date changes (reset to default for new date)
  useEffect(() => {
    // Skip initial load - handled by first useEffect
    if (isInitialLoad.current) return;
    
    if (dropoffDate) {
      const defaultTime = getDefaultTimeForDate(
        dropoffDate,
        pickupLocation === 'location',
        dropoffWorkingHours
      );
      const nearestAvailable = findNearestAvailableTime(
        defaultTime,
        dropoffDate,
        pickupLocation === 'location',
        dropoffWorkingHours
      );
      setDropoffTime(nearestAvailable);
      setCookie('dropoffTime', nearestAvailable, 30);
    }
  }, [dropoffDate]);

  // Update pickup time when working hours or location changes (after initial load)
  useEffect(() => {
    // Skip initial load - handled by first useEffect
    if (isInitialLoad.current) return;
    
    if (pickupTime && pickupDate) {
      const nearestAvailable = findNearestAvailableTime(
        pickupTime,
        pickupDate,
        pickupLocation === 'location',
        pickupWorkingHours
      );
      // Only update if the current time is not available
      if (nearestAvailable !== pickupTime) {
        setPickupTime(nearestAvailable);
        setCookie('pickupTime', nearestAvailable, 30);
      }
    }
  }, [pickupWorkingHours, pickupLocation]);

  // Update dropoff time when working hours or location changes (after initial load)
  useEffect(() => {
    // Skip initial load - handled by first useEffect
    if (isInitialLoad.current) return;
    
    if (dropoffTime && dropoffDate) {
      const nearestAvailable = findNearestAvailableTime(
        dropoffTime,
        dropoffDate,
        pickupLocation === 'location',
        dropoffWorkingHours
      );
      // Only update if the current time is not available
      if (nearestAvailable !== dropoffTime) {
        setDropoffTime(nearestAvailable);
        setCookie('dropoffTime', nearestAvailable, 30);
      }
    }
  }, [dropoffWorkingHours, pickupLocation]);

  // Save times to cookies when they change
  useEffect(() => {
    if (pickupTime && pickupTime !== '09:30') {
      setCookie('pickupTime', pickupTime, 30);
    }
  }, [pickupTime]);

  useEffect(() => {
    if (dropoffTime && dropoffTime !== '09:30') {
      setCookie('dropoffTime', dropoffTime, 30);
    }
  }, [dropoffTime]);
  return (
    <div className={cn(disabled && 'opacity-50 pointer-events-none')}>
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {t('confirmPickupDropoffTime')}
        </h3>
      </SeparatorWithContent>
      <div className={`space-y-6 mt-6 relative ${locale === 'ar' ? 'pr-6' : 'pl-6'}`}>
        {/* Connecting Line - Dashed vertical line from "from" to "to" */}
        <div className={`absolute h-16 ${locale === 'ar' ? 'right-2 translate-x-1/2 border-r-2' : 'left-2 border-l-2'} top-3 bottom-2 w-0.5 border-dashed border-gray-300`}></div>
        
        {/* From Row */}
        <div className="flex items-center gap-3 relative">
          {/* Label */}
          <div className={`flex items-center gap-1.5 shrink-0 relative z-10 bg-white w-[50px] ${locale === 'ar' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <span className="text-sm font-medium text-gray-700">{t('from')}</span>
          </div>
          {/* Circle - positioned exactly on the connecting line (centered on the 2px line at 8px from edge) */}
          <div className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' ? '-right-4 translate-x-1/2' : '-left-4 -translate-x-1/2'} w-3 h-3 rounded-full border-2 border-gray-400 bg-white z-10`}></div>

          {/* Date Field */}
          <Popover>
            <PopoverTrigger asChild>
              <div className={cn("flex items-center gap-1 md:gap-2 bg-[#ECEEF2] h-[38px] rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-[250px]", !disabled && "cursor-pointer")}>
                <span className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {pickupDate ? formatDate(pickupDate) : (locale === 'ar' ? 'اختر التاريخ' : 'Select Date')}
                </span>
                {/* <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                  <EditIcon />
                </span> */}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-[16px]">
                <div className="text-[16px] font-semibold mb-2">
                  {locale === 'ar' ? 'حدد يوم أستلام السيارة:' : 'Select pickup date:'}
                </div>
                <hr className="my-4" />
                <DayPicker
                  mode="single"
                  selected={pickupDate || undefined}
                  defaultMonth={pickupDate || undefined}
                  onSelect={(date: Date | undefined) => {
                    const selectedDate = date || null;
                    setPickupDate(selectedDate);
                    // Also update filter store
                    if (selectedDate) {
                      setFromDate(selectedDate);
                    }
                  }}
                  locale={ar}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateToCheck = new Date(date);
                    dateToCheck.setHours(0, 0, 0, 0);
                    // Disable dates before today
                    if (dateToCheck < today) {
                      return true;
                    }
                    // Calculate maximum allowed date based on minDaysReservation
                    const maxAllowedDate = new Date(today);
                    maxAllowedDate.setDate(today.getDate() + minDaysReservation - 1);
                    maxAllowedDate.setHours(23, 59, 59, 999);
                    // Disable dates after maxAllowedDate
                    if (dateToCheck > maxAllowedDate) {
                      return true;
                    }
                    return false;
                  }}
                  components={{
                    Chevron: ({ orientation }) => {
                      if (orientation === "left") {
                        return (
                          <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        );
                      }
                      return (
                        <Button variant="outline" size="icon">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      );
                    },
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Separator */}
          <div className="w-px h-5 bg-[#1A1A1A] shrink-0"></div>

          {/* Time Field */}
          <div className="w-[250px]">
            <TimeSlotSelector
              label=""
              title={locale === 'ar' ? 'اختر وقت الاستلام' : 'Select Pickup Time'}
              placeholder={locale === 'ar' ? 'اختر الوقت' : 'Select Time'}
              selectedTime={pickupTime}
              selectedDate={pickupDate}
              startDate={pickupDate}
              startTime={null}
              workingHours={pickupWorkingHours}
              isLocation={pickupLocation === 'location'}
              locale={locale}
              onTimeSelect={(slot) => {
                if (!disabled) {
                  setPickupTime(slot.value);
                  setCookie('pickupTime', slot.value, 30);
                }
              }}
            />
          </div>
        </div>

        {/* To Row */}
        <div className="flex items-center gap-3 relative">
          {/* Label */}
          <div className={`flex items-center gap-1.5 shrink-0 relative z-10 bg-white w-[50px] ${locale === 'ar' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <span className="text-sm font-medium text-gray-700">{t('to')}</span>
          </div>
          {/* Circle - positioned exactly on the connecting line (centered on the 2px line at 8px from edge) */}
          <div className={`absolute top-1/2 -translate-y-1/2 ${locale === 'ar' ? '-right-4 translate-x-1/2' : '-left-4 -translate-x-1/2'} w-3 h-3 rounded-full bg-gray-900 z-10`}></div>

          {/* Date Field */}
          <Popover>
            <PopoverTrigger asChild>
              <div className={cn("flex items-center gap-1 md:gap-2 bg-[#ECEEF2] h-[38px] rounded-lg px-1.5 md:px-2 py-1 md:py-1.5 w-[250px]", !disabled && "cursor-pointer")}>
                <span className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {dropoffDate ? formatDate(dropoffDate) : (locale === 'ar' ? 'اختر التاريخ' : 'Select Date')}
                </span>
            {/* <span className="shrink-0 w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                  <EditIcon />
                </span> */}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-[16px]">
                <div className="text-[16px] font-semibold mb-2">
                  {locale === 'ar' ? 'حدد يوم تسليم السيارة:' : 'Select drop-off date:'}
                </div>
                <hr className="my-4" />
                <DayPicker
                  mode="range"
                  selected={pickupDate && dropoffDate ? { from: pickupDate, to: dropoffDate } : pickupDate ? { from: pickupDate } : undefined}
                  defaultMonth={dropoffDate || pickupDate || undefined}
                  onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                    if (range?.from && range?.to) {
                      const selectedDate = range.to;
                      setDropoffDate(selectedDate);
                      // Also update filter store
                      setToDate(selectedDate);
                    } else if (range?.from && !range.to) {
                      // Still selecting range
                      const selectedDate = range.from;
                      setDropoffDate(selectedDate);
                      // Also update filter store
                      setToDate(selectedDate);
                    }
                  }}
                  locale={ar}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateToCheck = new Date(date);
                    dateToCheck.setHours(0, 0, 0, 0);
                    // Disable dates before today
                    if (dateToCheck < today) {
                      return true;
                    }
                    // For dropoff date, don't limit the maximum date (open to infinity)
                    // Only check if date is before pickupDate
                    if (pickupDate) {
                      const pickupDateCheck = new Date(pickupDate);
                      pickupDateCheck.setHours(0, 0, 0, 0);
                      return dateToCheck < pickupDateCheck;
                    }
                    return false;
                  }}
                  components={{
                    Chevron: ({ orientation }) => {
                      if (orientation === "left") {
                        return (
                          <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        );
                      }
                      return (
                        <Button variant="outline" size="icon">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      );
                    },
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>

          {/* Separator */}
          <div className="w-px h-5 bg-[#1A1A1A] shrink-0"></div>

          {/* Time Field */}
          <div className="w-[250px]">
            <TimeSlotSelector
              label=""
              title={locale === 'ar' ? 'اختر وقت التسليم' : 'Select Drop-off Time'}
              placeholder={locale === 'ar' ? 'اختر الوقت' : 'Select Time'}
              selectedTime={dropoffTime}
              selectedDate={dropoffDate}
              startDate={pickupDate}
              startTime={pickupTime}
              workingHours={dropoffWorkingHours}
              isLocation={pickupLocation === 'location'}
              locale={locale}
              onTimeSelect={(slot) => {
                if (!disabled) {
                  setDropoffTime(slot.value);
                  setCookie('dropoffTime', slot.value, 30);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

