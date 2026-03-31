// 'use client';

// import type { WorkingHours } from '@/lib/api/services/shared.service';
// import { cn } from '@/lib/utils';
// import { addHours, format, getDay, isSameDay, isToday, setHours, setMinutes } from 'date-fns';
// import Image from 'next/image';
// import React, { useEffect, useRef, useState } from 'react';
// import { Button } from './button';
// import { Input } from './input';
// import { Popover, PopoverContent, PopoverTrigger } from './popover';

// interface TimeSlot {
//   value: string; // HH:mm format
//   label: string; // Display format (e.g., "9:00 AM")
//   hour: number;
//   minute: number;
//   isAvailable: boolean;
//   isDuringBreak: boolean; // New property to track if time is during break
// }

// interface TimeSlotSelectorProps {
//   selectedTime?: string | null; // HH:mm format
//   onTimeSelect?: (timeSlot: TimeSlot) => void;
//   selectedDate?: Date | null;
//   startDate?: Date | null;
//   startTime?: string | null; // HH:mm format
//   interval?: number; // minutes interval (default: 30)
//   maxHoursFromNow?: number | null; // Maximum hours from now
//   workingHours?: WorkingHours | null; // Branch working hours
//   isLocation?: boolean; // If true, all times are available (location pickup)
//   locale?: string;
//   title?: string;
//   label?: string; // Label for the trigger button
//   placeholder?: string; // Placeholder text
//   className?: string;
// }

// export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
//   selectedTime,
//   onTimeSelect,
//   selectedDate,
//   startDate,
//   startTime,
//   interval = 30,
//   maxHoursFromNow = null,
//   workingHours = null,
//   isLocation = false,
//   locale = 'ar',
//   title,
//   label,
//   placeholder,
//   className,
// }) => {
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [open, setOpen] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startY, setStartY] = useState(0);
//   const [scrollTop, setScrollTop] = useState(0);

//   // Get display time from selectedTime
//   const getDisplayTime = (): string => {
//     if (!selectedTime) return '';

//     const [hourStr, minuteStr] = selectedTime.split(':');
//     const hour = parseInt(hourStr, 10);
//     const minute = parseInt(minuteStr, 10);

//     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//     const amPm = hour < 12 ? (locale === 'ar' ? 'صباحا' : 'AM') : (locale === 'ar' ? 'مساء' : 'PM');
//     return `${displayHour}:${minuteStr} ${amPm}`;
//   };

//   // Helper function to get day name from date
//   const getDayName = (date: Date): string | null => {
//     const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//     const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
//     return dayNames[dayIndex];
//   };

//   // Helper function to parse time string (HH:mm:ss) to hours and minutes
//   const parseTimeString = (timeString: string | null | undefined): { hour: number; minute: number } | null => {
//     if (!timeString) return null;
//     const parts = timeString.split(':');
//     if (parts.length < 2) return null;
//     const hour = parseInt(parts[0], 10);
//     const minute = parseInt(parts[1], 10);
//     if (isNaN(hour) || isNaN(minute)) return null;
//     return { hour, minute };
//   };

//   // Helper function to check if a day is open (has working hours)
//   const isDayOpen = (dayKey: string, workingHoursData: WorkingHours | null): boolean => {
//     if (!workingHoursData) return false;
//     const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
//     const openTime = workingHoursData[openTimeKey];
//     return openTime !== null && openTime !== undefined;
//   };

//   // Helper function to check if a time is during a break period
//   const isTimeInBreak = (
//     hour: number,
//     minute: number,
//     date: Date,
//     workingHoursData: WorkingHours | null
//   ): boolean => {
//     if (!workingHoursData || !workingHoursData.breaks || workingHoursData.breaks.length === 0) {
//       return false;
//     }

//     // Get day of week from date
//     const dayIndex = getDay(date);
//     const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
//     const currentDayName = dayNames[dayIndex];

//     // Get breaks for current day
//     const dayBreaks = workingHoursData.breaks.filter(
//       (breakItem) => breakItem.dayOfWeek === currentDayName
//     );

//     if (dayBreaks.length === 0) {
//       return false;
//     }

//     // Check if current time falls within any break period
//     const currentTimeInMinutes = hour * 60 + minute;

//     for (const breakItem of dayBreaks) {
//       const breakStart = parseTimeString(breakItem.startTime);
//       const breakEnd = parseTimeString(breakItem.endTime);

//       if (breakStart && breakEnd) {
//         const breakStartMinutes = breakStart.hour * 60 + breakStart.minute;
//         const breakEndMinutes = breakEnd.hour * 60 + breakEnd.minute;

//         // Check if current time is within break period (inclusive of both start and end)
//         // من البداية لحد النهاية بما فيها النهاية
//         if (currentTimeInMinutes >= breakStartMinutes && currentTimeInMinutes <= breakEndMinutes) {
//           return true;
//         }
//       }
//     }

//     return false;
//   };

//   // Generate time slots
//   useEffect(() => {
//     const slots: TimeSlot[] = [];
//     const now = new Date();
//     const effectiveDate = selectedDate || now;
//     const isTodayDate = isToday(effectiveDate);
//     const isSameAsStartDate =
//       startDate && selectedDate && isSameDay(selectedDate, startDate);
//     const currentDay = getDayName(effectiveDate);

//     // Generate all time slots (24 hours)
//     for (let hour = 0; hour < 24; hour++) {
//       for (let minute = 0; minute < 60; minute += interval) {
//         if (hour === 23 && minute >= 60) break;

//         const time = setMinutes(setHours(new Date(), hour), minute);
//         const timeValue = format(time, 'HH:mm');

//         // Format display time (12-hour format with AM/PM)
//         const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//         const amPm = hour < 12 ? (locale === 'ar' ? 'ص' : 'AM') : (locale === 'ar' ? 'م' : 'PM');
//         const timeDisplay = `${displayHour}:${minute.toString().padStart(2, '0')} ${amPm}`;

//         // Check if time is after current time (if today)
//         // التحقق إذا كان اليوم (سواء location أو branch)
//         let isAfterCurrentTime = true;
//         if (isTodayDate) {
//           const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
//           const slotTimeInMinutes = hour * 60 + minute;
//           isAfterCurrentTime = slotTimeInMinutes > currentTimeInMinutes;
//         }

//         // Check if time is after start time (if same as start date)
//         // التحقق فقط إذا كان branch (وليس location)
//         let isAfterStartTime = true;
//         if (!isLocation && isSameAsStartDate && startTime) {
//           const startTimeValue = typeof startTime === 'string' ? startTime : (startTime as any)?.value || startTime;
//           const slotTimeInMinutes = hour * 60 + minute;

//           // تحويل وقت البداية إلى دقائق
//           const startTimeParts = startTimeValue.split(':');
//           const startHourValue = parseInt(startTimeParts[0]);
//           const startMinuteValue = parseInt(startTimeParts[1]);
//           const startTimeInMinutes = startHourValue * 60 + startMinuteValue;

//           // يجب أن يكون الوقت بعد وقت البداية
//           isAfterStartTime = slotTimeInMinutes > startTimeInMinutes;
//         }

//         // Check max hours from now
//         let isWithinMaxHours = true;
//         if (maxHoursFromNow && selectedDate) {
//           const maxAllowedDateTime = addHours(now, maxHoursFromNow);
//           const selectedDateTime = setMinutes(
//             setHours(new Date(selectedDate), hour),
//             minute
//           );

//           const isMaxDate = isSameDay(selectedDate, maxAllowedDateTime);
//           if (isMaxDate) {
//             const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
//             const slotTimeInMinutes = hour * 60 + minute;
//             isWithinMaxHours = slotTimeInMinutes <= currentTimeInMinutes;
//           } else {
//             isWithinMaxHours = selectedDateTime < maxAllowedDateTime;
//           }
//         }

//         // Check if time is within working hours
//         // تحديد ما إذا كان الوقت داخل ساعات العمل
//         let isWorkingHours = false;

//         if (isLocation) {
//           // إذا كان location، مفتوح 24 ساعة
//           isWorkingHours = true;
//         } else if (workingHours && currentDay) {
//           // استخدام مواعيد العمل من API
//           const dayKey = currentDay.toLowerCase();
//           const isOpen = isDayOpen(dayKey, workingHours);

//           if (isOpen) {
//             const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
//             const closeTimeKey = `${dayKey}CloseTime` as keyof WorkingHours;
//             const openTime = workingHours[openTimeKey] as string | null | undefined;
//             const closeTime = workingHours[closeTimeKey] as string | null | undefined;

//             const openTimeParsed = parseTimeString(openTime);
//             const closeTimeParsed = parseTimeString(closeTime);

//             // التأكد من وجود قيم صحيحة
//             if (openTimeParsed && closeTimeParsed) {
//               const currentTimeInMinutes = hour * 60 + minute;
//               const openTimeInMinutes = openTimeParsed.hour * 60 + openTimeParsed.minute;
//               const closeTimeInMinutes = closeTimeParsed.hour * 60 + closeTimeParsed.minute;

//               // Include the close time itself (use <= instead of <)
//               // Also account for interval: if closeTime is 17:00, include slots up to 17:00
//               // For 30-minute interval, this means including 16:30 and 17:00
//               isWorkingHours =
//                 currentTimeInMinutes >= openTimeInMinutes &&
//                 currentTimeInMinutes <= closeTimeInMinutes;
//             }
//           }
//           // إذا لم يكن اليوم مفتوح، يبقى isWorkingHours = false
//         } else {
//           // إذا كان branch و workingHours === null، الوقت غير متاح
//           isWorkingHours = false;
//         }

//         // Check if time is during a break period (only for branches)
//         // التحقق من أوقات البريك (فقط للفروع)
//         let isDuringBreak = false;
//         if (!isLocation && workingHours) {
//           isDuringBreak = isTimeInBreak(hour, minute, effectiveDate, workingHours);
//         }

//         // Determine availability
//         // تحديد ما إذا كان الوقت متاح
//         // إذا كان location:
//         //   - كل الأوقات متاحة باستثناء الأوقات السابقة للوقت الحالي في حالة اليوم
//         //   - مع تطبيق validation الحد الأقصى للساعات (maxHoursFromNow)
//         // إذا كان branch:
//         //   - التحقق من ساعات العمل، الوقت الحالي، وقت البداية، والحد الأقصى للساعات
//         //   - أوقات البريك تظهر كـ disabled (لا يتم حذفها)
//         let isAvailable: boolean;
//         if (isLocation) {
//           // إذا كان location، الأوقات متاحة باستثناء الأوقات السابقة للوقت الحالي في اليوم
//           // مع التحقق من الحد الأقصى للساعات
//           isAvailable = isAfterCurrentTime && isWithinMaxHours;
//         } else {
//           // إذا كان branch، التحقق من ساعات العمل والشروط الأخرى
//           // لكن لا نحذف أوقات البريك، فقط نعطلها (سيتم التحقق منها في الـ render)
//           isAvailable =
//             isWorkingHours &&
//             isAfterCurrentTime &&
//             isAfterStartTime &&
//             isWithinMaxHours;
//         }

//         slots.push({
//           value: timeValue,
//           label: timeDisplay,
//           hour,
//           minute,
//           isAvailable,
//           isDuringBreak, // إضافة معلومة البريك
//         });
//       }
//     }

//     setTimeSlots(slots);
//   }, [
//     selectedDate,
//     startDate,
//     startTime,
//     interval,
//     maxHoursFromNow,
//     workingHours,
//     isLocation,
//     locale,
//   ]);

//   // Scroll to selected time slot or first available
//   useEffect(() => {
//     if (scrollContainerRef.current && timeSlots.length > 0) {
//       // Filter available and non-break slots for display
//       const displayableSlots = timeSlots.filter((slot) => slot.isAvailable || slot.isDuringBreak);

//       // Find index of selected time in displayable slots, or use 0 (first available non-break)
//       const targetIndex = selectedTime
//         ? displayableSlots.findIndex((slot) => slot.value === selectedTime)
//         : displayableSlots.findIndex((slot) => slot.isAvailable && !slot.isDuringBreak);

//       const indexToScroll = targetIndex !== -1 ? targetIndex : 0;

//       if (indexToScroll >= 0 && indexToScroll < displayableSlots.length) {
//         const columns = 4; // 4 columns grid
//         const rowsBeforeTarget = Math.floor(indexToScroll / columns);
//         const buttonHeight = 36;
//         const gap = 8;
//         const rowHeight = buttonHeight + gap;
//         const scrollTop = rowsBeforeTarget * rowHeight;

//         setTimeout(() => {
//           if (scrollContainerRef.current) {
//             scrollContainerRef.current.scrollTop = scrollTop;
//           }
//         }, 100);
//       }
//     }
//   }, [timeSlots, selectedTime]);

//   const handleTimeSelect = (slot: TimeSlot) => {
//     // Only allow selection if available and not during break
//     if (slot.isAvailable && !slot.isDuringBreak && onTimeSelect) {
//       onTimeSelect(slot);
//       setOpen(false); // Close popover after selection
//     }
//   };

//   const availableSlotsCount = timeSlots.filter((slot) => slot.isAvailable && !slot.isDuringBreak).length;
//   const displayValue = availableSlotsCount === 0
//     ? (locale === 'ar' ? 'مغلق' : 'Closed')
//     : getDisplayTime();
//   const defaultPlaceholder = placeholder || (locale === 'ar' ? 'اختر الوقت' : 'Select time');

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <div className={cn('w-full', className)}>
//           <Input
//             readOnly
//             value={displayValue}
//             placeholder={defaultPlaceholder}
//             className="cursor-pointer"
//           />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="min-w-[200px] p-0" align="center">
//         <div className="px-2 py-4">
//           {title && (
//             <>
//               <div className="text-[14px] font-semibold mb-2">{title}</div>
//               <hr className="my-2" />
//             </>
//           )}
//           <div
//             ref={scrollContainerRef}
//             className="h-40 overflow-y-auto border border-gray-100 rounded-sm bg-gray-50 time-slot-scrollbar cursor-grab active:cursor-grabbing"
//             onWheel={(e) => {
//               // Allow scrolling with mouse wheel
//               e.stopPropagation();
//               if (scrollContainerRef.current) {
//                 scrollContainerRef.current.scrollTop += e.deltaY;
//               }
//             }}
//             onMouseDown={(e) => {
//               if (scrollContainerRef.current) {
//                 setIsDragging(true);
//                 setStartY(e.pageY - scrollContainerRef.current.offsetTop);
//                 setScrollTop(scrollContainerRef.current.scrollTop);
//               }
//             }}
//             onMouseLeave={() => {
//               setIsDragging(false);
//             }}
//             onMouseUp={() => {
//               setIsDragging(false);
//             }}
//             onMouseMove={(e) => {
//               if (!isDragging || !scrollContainerRef.current) return;
//               e.preventDefault();
//               const y = e.pageY - scrollContainerRef.current.offsetTop;
//               const walk = (y - startY) * 2; // Scroll speed multiplier
//               scrollContainerRef.current.scrollTop = scrollTop - walk;
//             }}
//             onTouchStart={(e) => {
//               if (scrollContainerRef.current) {
//                 setIsDragging(true);
//                 setStartY(e.touches[0].pageY - scrollContainerRef.current.offsetTop);
//                 setScrollTop(scrollContainerRef.current.scrollTop);
//               }
//             }}
//             onTouchMove={(e) => {
//               if (!isDragging || !scrollContainerRef.current) return;
//               e.preventDefault();
//               const y = e.touches[0].pageY - scrollContainerRef.current.offsetTop;
//               const walk = (y - startY) * 2;
//               scrollContainerRef.current.scrollTop = scrollTop - walk;
//             }}
//             onTouchEnd={() => {
//               setIsDragging(false);
//             }}
//             style={{
//               overscrollBehavior: 'contain',
//               WebkitOverflowScrolling: 'touch',
//               userSelect: 'none'
//             }}
//           >
//             {availableSlotsCount === 0 ? (
//               <div className="flex items-center justify-center flex-col h-full w-full px-3">
//                 <Image src="/notfound.png" alt="closed" width={100} height={100} />
//                 <p className="text-xs text-gray-500 text-center w-full">
//                   {locale === 'ar' ? 'الفرع مغلق الآن' : 'Branch is closed now'}
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-4 gap-2 px-3">
//                 {timeSlots
//                   .filter((slot) => slot.isAvailable || slot.isDuringBreak)
//                   .map((slot) => {
//                     const isSelected = selectedTime === slot.value;
//                     const isDisabled = slot.isDuringBreak || !slot.isAvailable;
//                     return (
//                       <Button
//                         key={slot.value}
//                         onClick={() => handleTimeSelect(slot)}
//                         variant="outline"
//                         disabled={isDisabled}
//                         className={cn(
//                           'w-full h-[36px] text-xs font-medium transition-all duration-200 rounded',
//                           isDisabled
//                             ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
//                             : isSelected
//                             ? 'font-bold text-[#1A1A1A] border-primary border-solid bg-primary/3'
//                             : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
//                         )}
//                       >
//                         <div className="flex flex-col items-center">
//                           <span>{slot.label}</span>
//                           {slot.isDuringBreak && (
//                             <span className="text-[8px] text-gray-400">
//                               {locale === 'ar' ? 'بريك' : 'Break'}
//                             </span>
//                           )}
//                         </div>
//                       </Button>
//                     );
//                   })}
//               </div>
//             )}
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

const TimeSlotSelector = () => {
  return <div>time-slot-selector</div>;
};

export default TimeSlotSelector;
