// /**
//  * Extension Dialog Component
//  * Dialog for selecting extension date and time
//  */

// 'use client';

// import { Button } from '@/app/(components)/ui/button';
// import { DatePicker } from '@/app/(components)/ui/date-picker';
// import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
// import { TimeSlotSelector } from '@/app/(components)/ui/time-slot-selector';
// import { useRouter } from '@/i18n/routing';
// import { getReservationDetails, getReservationTotals } from '@/lib/api/reservation-details';
// import { getBranchWorkingHours, type WorkingHours } from '@/lib/api/services/shared.service';
// import { getAuthToken } from '@/util/auth';
// import { setCookie } from '@/util/cookies';
// import { getDay, isToday } from 'date-fns';
// import { useTranslations } from 'next-intl';
// import React, { useCallback, useEffect, useState } from 'react';
// import { toast } from 'sonner';

// interface ExtensionDialogProps {
//     reservationId: number;
//     currentEndDate: string; // Current end date of the reservation
//     locale: string;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export const ExtensionDialog: React.FC<ExtensionDialogProps> = ({
//     reservationId,
//     currentEndDate,
//     locale,
//     open,
//     onOpenChange,
// }) => {
//     const t = useTranslations('profile');
//     const router = useRouter();
//     const isArabic = locale === 'ar';

//     // State for selected date and time
//     const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//     const [selectedTime, setSelectedTime] = useState<string>('09:00');

//     // State for branch working hours
//     const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
//     const [isLoadingWorkingHours, setIsLoadingWorkingHours] = useState(false);

//     // State for loading reservation totals
//     const [isLoadingTotals, setIsLoadingTotals] = useState(false);

//     // State to track if date/time were loaded from API (to prevent auto-update)
//     const [isLoadedFromAPI, setIsLoadedFromAPI] = useState(false);

//     // State for minimum extension date
//     const [minExtensionDate, setMinExtensionDate] = useState<Date>(() => {
//         // Calculate initial minimum extension date from currentEndDate prop
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         try {
//             const currentEnd = new Date(currentEndDate);
//             if (isNaN(currentEnd.getTime())) {
//                 return new Date(today);
//             } else {
//                 currentEnd.setHours(0, 0, 0, 0);
//                 if (currentEnd < today) {
//                     return new Date(today);
//                 } else {
//                     const minDate = new Date(currentEnd);
//                     minDate.setDate(minDate.getDate() + 1);
//                     return minDate;
//                 }
//             }
//         } catch {
//             return new Date(today);
//         }
//     });

//     // Helper function to get day name from date
//     const getDayName = (date: Date): string | null => {
//         const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//         const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
//         return dayNames[dayIndex];
//     };

//     // Helper function to parse time string (HH:mm:ss) to minutes
//     const parseTimeToMinutes = (timeString: string | null | undefined): number | null => {
//         if (!timeString) return null;
//         const parts = timeString.split(':');
//         if (parts.length < 2) return null;
//         const hour = parseInt(parts[0], 10);
//         const minute = parseInt(parts[1], 10);
//         if (isNaN(hour) || isNaN(minute)) return null;
//         return hour * 60 + minute;
//     };

//     // Helper function to check if a day is open
//     const isDayOpen = (dayKey: string, workingHoursData: WorkingHours | null): boolean => {
//         if (!workingHoursData) return false;
//         const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
//         const openTime = workingHoursData[openTimeKey];
//         return openTime !== null && openTime !== undefined;
//     };

//     // Function to find the nearest available time slot
//     const findNearestAvailableTime = useCallback((date: Date | null, workingHoursData: WorkingHours | null): string | null => {
//         if (!date) return null;

//         const now = new Date();
//         const isTodayDate = isToday(date);
//         const currentDay = getDayName(date);
//         const interval = 30; // 30 minutes interval

//         if (!currentDay) return null;

//         // Get working hours for the selected day
//         let openTimeMinutes: number | null = null;
//         let closeTimeMinutes: number | null = null;

//         if (workingHoursData) {
//             const dayKey = currentDay.toLowerCase();
//             const isOpen = isDayOpen(dayKey, workingHoursData);

//             if (isOpen) {
//                 const openTimeKey = `${dayKey}OpenTime` as keyof WorkingHours;
//                 const closeTimeKey = `${dayKey}CloseTime` as keyof WorkingHours;
//                 const openTime = workingHoursData[openTimeKey] as string | null | undefined;
//                 const closeTime = workingHoursData[closeTimeKey] as string | null | undefined;

//                 openTimeMinutes = parseTimeToMinutes(openTime);
//                 closeTimeMinutes = parseTimeToMinutes(closeTime);
//             }
//         }

//         // If no working hours, default to 24 hours
//         if (openTimeMinutes === null || closeTimeMinutes === null) {
//             openTimeMinutes = 0; // 00:00
//             closeTimeMinutes = 24 * 60; // 23:59
//         }

//         // Get current time in minutes (if today)
//         const currentTimeInMinutes = isTodayDate
//             ? now.getHours() * 60 + now.getMinutes()
//             : -1;

//         // Find the first available time slot
//         for (let hour = 0; hour < 24; hour++) {
//             for (let minute = 0; minute < 60; minute += interval) {
//                 if (hour === 23 && minute >= 60) break;

//                 const slotTimeInMinutes = hour * 60 + minute;

//                 // Check if time is within working hours
//                 if (slotTimeInMinutes < openTimeMinutes || slotTimeInMinutes >= closeTimeMinutes) {
//                     continue;
//                 }

//                 // Check if time is after current time (if today)
//                 if (isTodayDate && slotTimeInMinutes <= currentTimeInMinutes) {
//                     continue;
//                 }

//                 // Found available time slot
//                 const formattedHour = hour.toString().padStart(2, '0');
//                 const formattedMinute = minute.toString().padStart(2, '0');
//                 return `${formattedHour}:${formattedMinute}`;
//             }
//         }

//         return null; // No available time found
//     }, []);

//     // Fetch reservation details, totals, and branch working hours when dialog opens
//     useEffect(() => {
//         if (!open) return;

//         const fetchData = async () => {
//             setIsLoadingWorkingHours(true);
//             setIsLoadingTotals(true);
//             try {
//                 const token = getAuthToken();
//                 if (!token) {
//                     console.error('No auth token found');
//                     return;
//                 }

//                 // Fetch reservation totals to get lastEndDate and lastEndTime
//                 const totalsResponse = await getReservationTotals(reservationId, token);
//                 if (totalsResponse.message === 'SUCCESS' && totalsResponse.data) {
//                     const { lastEndDate, lastEndTime } = totalsResponse.data;

//                     // Update minimum extension date based on lastEndDate
//                     if (lastEndDate) {
//                         const parsedDate = new Date(lastEndDate);
//                         if (!isNaN(parsedDate.getTime())) {
//                             const today = new Date();
//                             today.setHours(0, 0, 0, 0);
//                             parsedDate.setHours(0, 0, 0, 0);

//                             // Set minimum date to day after lastEndDate, or today if lastEndDate is in past
//                             let minDate: Date;
//                             if (parsedDate < today) {
//                                 minDate = new Date(today);
//                             } else {
//                                 minDate = new Date(parsedDate);
//                                 minDate.setDate(minDate.getDate() + 1);
//                             }
//                             setMinExtensionDate(minDate);

//                             // Set selected date to the day after lastEndDate (minExtensionDate)
//                             setSelectedDate(new Date(minDate));

//                             // Parse and set the last end time (format: HH:mm:ss -> HH:mm)
//                             if (lastEndTime) {
//                                 const timeParts = lastEndTime.split(':');
//                                 if (timeParts.length >= 2) {
//                                     const formattedTime = `${timeParts[0]}:${timeParts[1]}`;
//                                     setSelectedTime(formattedTime);
//                                 }
//                             }

//                             // Mark as loaded from API
//                             setIsLoadedFromAPI(true);
//                         }
//                     } else {
//                         // If no lastEndDate from API, select the day after minExtensionDate
//                         setSelectedDate(new Date(minExtensionDate));
//                     }
//                 } else {
//                     // If API call failed, select the day after minExtensionDate
//                     setSelectedDate(new Date(minExtensionDate));
//                 }

//                 // Fetch reservation details to get toBranchId
//                 const reservationResponse = await getReservationDetails(reservationId, token);
//                 if (reservationResponse.message === 'SUCCESS' && reservationResponse.data) {
//                     const toBranchId = reservationResponse.data.toBranchId;

//                     // Fetch branch working hours
//                     const branchWorkingHours = await getBranchWorkingHours(toBranchId);
//                     setWorkingHours(branchWorkingHours);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 toast.error(isArabic ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data');
//             } finally {
//                 setIsLoadingWorkingHours(false);
//                 setIsLoadingTotals(false);
//             }
//         };

//         fetchData();
//     }, [open, reservationId, isArabic]);

//     // Auto-select nearest available time when date or working hours change
//     // But only if values weren't loaded from API (to preserve lastEndTime)
//     useEffect(() => {
//         if (selectedDate && workingHours !== null && !isLoadedFromAPI) {
//             const nearestTime = findNearestAvailableTime(selectedDate, workingHours);
//             if (nearestTime) {
//                 setSelectedTime(nearestTime);
//             }
//         }
//     }, [selectedDate, workingHours, findNearestAvailableTime, isLoadedFromAPI]);

//     // Reset isLoadedFromAPI when user manually changes the date
//     const handleDateChange = (date: Date | null) => {
//         setSelectedDate(date);
//         setIsLoadedFromAPI(false); // Allow auto-time update when user changes date
//     };

//     // Reset time when dialog closes
//     useEffect(() => {
//         if (!open) {
//             setSelectedDate(null);
//             setSelectedTime('09:00');
//             setWorkingHours(null);
//             setIsLoadedFromAPI(false);
//         }
//     }, [open]);

//     // Handle confirm
//     const handleConfirm = () => {
//         if (!selectedDate) {
//             toast.error(isArabic ? 'يرجى اختيار تاريخ التمديد' : 'Please select extension date');
//             return;
//         }

//         // Save extension date and time to cookie/sessionStorage
//         const extensionData = {
//             reservationId,
//             extensionDate: selectedDate.toISOString(),
//             extensionTime: selectedTime,
//         };

//         // Save to cookie for persistence
//         setCookie('extension-data', JSON.stringify(extensionData), 1); // 1 day

//         // Also save to sessionStorage for immediate access
//         if (typeof window !== 'undefined') {
//             sessionStorage.setItem('extensionData', JSON.stringify(extensionData));
//         }

//         // Close dialog
//         onOpenChange(false);

//         // Navigate to extension booking page
//         router.push(`/extend-booking/${reservationId}`);
//     };

//     return (
//         <DialogWrapper
//             open={open}
//             onOpenChange={onOpenChange}
//             header={{
//                 mainTitle: t('extendReservation'),
//                 description: isArabic ? 'اختر تاريخ و وقت التسليم الجديد' : 'Select new extension date and time',
//             }}
//             content={
//                 <div className="flex flex-col gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
//                     {/* Date Selection */}
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                             {isArabic ? 'تاريخ التمديد' : 'Extension Date'}
//                             <span className="text-red-500 mr-1">*</span>
//                         </label>
//                         <div className="w-full mt-2">
//                             <DatePicker
//                                 value={selectedDate}
//                                 onChange={handleDateChange}
//                                 locale={locale}
//                                 placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
//                                 label=""
//                                 dialogTitle={isArabic ? 'اختر تاريخ التمديد' : 'Select Extension Date'}
//                                 minDate={minExtensionDate}
//                                 className="w-full"
//                             />
//                         </div>
//                     </div>

//                     {/* Time Selection */}
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                             {isArabic ? 'وقت التسليم' : 'Extension Time'}
//                             <span className="text-red-500 mr-1">*</span>
//                         </label>
//                         <div className="w-full mt-2">
//                             <TimeSlotSelector
//                                 selectedTime={selectedTime}
//                                 onTimeSelect={(slot) => setSelectedTime(slot.value)}
//                                 selectedDate={selectedDate}
//                                 locale={locale}
//                                 isLocation={false}
//                                 workingHours={workingHours}
//                                 placeholder={isArabic ? 'اختر الوقت' : 'Select time'}
//                                 className="w-full h-10"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             }
//             footer={
//                 <div className="grid grid-cols-12 gap-3  w-full mt-4">
//                     <div className="col-span-4">
//                         <Button
//                             variant="outline"
//                             onClick={() => onOpenChange(false)}
//                             className="px-6 w-full"
//                             size="lg"

//                         >
//                             {isArabic ? 'إلغاء' : 'Cancel'}
//                         </Button>
//                     </div>
//                     <div className="col-span-8">
//                         <Button
//                             onClick={handleConfirm}
//                             className=" text-white px-6 w-full"
//                             disabled={!selectedDate}
//                             size="lg"
//                         >
//                             {isArabic ? 'متابعة' : 'Continue'}
//                         </Button>
//                     </div>
//                 </div>
//             }
//         />
//     );
// };

const ExtensionDialog = () => {
  return <div>ExtensionDialog</div>;
};

export default ExtensionDialog;
