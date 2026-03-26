// /**
//  * Extend Booking Content Component
//  * Main component for the extend booking page
//  * Similar to BookingContent but for reservation extensions
//  */

// 'use client';

// import { useStickyHeader } from '@/hooks/useStickyHeader';
// import { useRouter } from '@/i18n/routing';
// import { getReservationDetails, getReservationTotals, type ReservationDetails } from '@/lib/api/reservation-details';
// import { createExtension } from '@/lib/api/reservation-extension';
// import { getBranchWorkingHours, type WorkingHours } from '@/lib/api/services/shared.service';
// import { useClientStore, useSharedStore } from '@/lib/api/stores';
// import { showApiMessage } from '@/lib/api/utils/toast-handler';
// import { getAuthToken } from '@/util/auth';
// import { getCookie, setCookie } from '@/util/cookies';
// import { normalizeImageUrl } from '@/util/image';
// import { useTranslations } from 'next-intl';
// import Image from 'next/image';
// import React, { useEffect, useMemo, useState } from 'react';
// import { toast } from 'sonner';

// // Import reusable components from booking
// import { DatePicker } from '@/app/(components)/ui/date-picker';
// import { TimeSlotSelector } from '@/app/(components)/ui/time-slot-selector';
// import { InsuranceSelector } from '../../../booking/components/insurance';
// import { InvoiceDetails } from '../../../booking/components/invoice';
// import { PaymentMethodSelector, type PaymentMethod } from '../../../booking/components/payment';
// import { PointsSelector } from '../../../booking/components/points';
// import { PromoCodeSelector } from '../../../booking/components/promocode';
// import { WarningDialog } from '../../../cars/[id]/car-details/components/WarningDialog';
// import { ExtendBookingHeader } from './ExtendBookingHeader';
// import { useExtensionPricing } from './useExtensionPricing';

// interface ExtendBookingContentProps {
//     locale: string;
//     reservationId: number;
// }

// const ExtendBookingContent: React.FC<ExtendBookingContentProps> = ({ locale, reservationId }) => {
//     const t = useTranslations('carDetails');
//     const tValidation = useTranslations('validation.AUTH_ERRORS');
//     const { clientData } = useClientStore();
//     const { sharedData } = useSharedStore();
//     const router = useRouter();

//     // State
//     const [reservation, setReservation] = useState<ReservationDetails | null>(null);
//     const [isLoadingReservation, setIsLoadingReservation] = useState(true);
//     const [extensionEndDate, setExtensionEndDate] = useState<string | null>(null);
//     const [extensionTime, setExtensionTime] = useState<string>('09:00');
//     const [selectedExtensionDate, setSelectedExtensionDate] = useState<Date | null>(null);
//     const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
//     const [lastEndTime, setLastEndTime] = useState<string | null>(null);
//     const [lastEndDate, setLastEndDate] = useState<string | null>(null);
//     const [minExtensionDate, setMinExtensionDate] = useState<Date>(() => {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         return today;
//     });

//     // Form state
//     const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);
//     const [selectedPoints, setSelectedPoints] = useState(0);
//     const [promoCode, setPromoCode] = useState<string | null>(null);
//     const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

//     // Extension creation loading state (separate from pricing loading)
//     const [isLoadingExtension, setIsLoadingExtension] = useState(false);

//     // Helper function to format date to YYYY-MM-DD without timezone issues
//     const formatDateToString = (date: Date): string => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     // Use extension pricing hook
//     // Use extensionEndDate directly (already in YYYY-MM-DD format) or convert from selectedExtensionDate
//     const extensionEndDateString = extensionEndDate || (selectedExtensionDate ? formatDateToString(selectedExtensionDate) : null);

//     const {
//         pricingData,
//         isLoadingPricing,
//         setPricingData,
//         warningInfo,
//         isWarningDialogOpen,
//         setIsWarningDialogOpen,
//         handleWarningAccept,
//         handleWarningReject,
//     } = useExtensionPricing({
//         reservation,
//         extensionEndDate: extensionEndDateString,
//         extensionTime,
//         reservationId,
//         isInsuranceSelected,
//         selectedPoints,
//         promoCode,
//         locale,
//         lastEndTime,
//         lastEndDate,
//     });

//     // Use sticky header hook
//     const { showStickyHeader, containerRef, stickyTriggerRef, headerStyle } = useStickyHeader();

//     // Track if data was loaded from storage
//     const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

//     // Note: Extension data loading is now handled inside fetchReservation useEffect
//     // to ensure proper order and prevent race conditions

//     // Handle date change
//     const handleDateChange = (date: Date | null) => {
//         setSelectedExtensionDate(date);
//         if (date) {
//             // Store only the date part (YYYY-MM-DD) for extensionEndDate without timezone issues
//             const dateStr = formatDateToString(date);
//             setExtensionEndDate(dateStr);
//             // Update sessionStorage and cookie with full ISO string for DatePicker
//             if (typeof window !== 'undefined') {
//                 const sessionData = sessionStorage.getItem('extensionData');
//                 if (sessionData) {
//                     const data = JSON.parse(sessionData);
//                     data.extensionDate = date.toISOString(); // Full ISO for DatePicker
//                     sessionStorage.setItem('extensionData', JSON.stringify(data));
//                     // Also update cookie
//                     setCookie('extension-data', JSON.stringify(data), 1);
//                 } else {
//                     // Create new extension data if it doesn't exist
//                     const extensionData = {
//                         reservationId,
//                         extensionDate: date.toISOString(),
//                         extensionTime: extensionTime || '09:00',
//                     };
//                     sessionStorage.setItem('extensionData', JSON.stringify(extensionData));
//                     setCookie('extension-data', JSON.stringify(extensionData), 1);
//                 }
//             }
//         }
//     };

//     // Handle time change
//     const handleTimeChange = (slot: any) => {
//         const timeStr = slot.value;
//         setExtensionTime(timeStr);
//         // Update sessionStorage and cookie
//         if (typeof window !== 'undefined') {
//             const sessionData = sessionStorage.getItem('extensionData');
//             if (sessionData) {
//                 const data = JSON.parse(sessionData);
//                 data.extensionTime = timeStr;
//                 sessionStorage.setItem('extensionData', JSON.stringify(data));
//                 // Also update cookie
//                 setCookie('extension-data', JSON.stringify(data), 1);
//             } else {
//                 // Create new extension data if it doesn't exist
//                 const extensionData = {
//                     reservationId,
//                     extensionDate: selectedExtensionDate?.toISOString() || '',
//                     extensionTime: timeStr,
//                 };
//                 sessionStorage.setItem('extensionData', JSON.stringify(extensionData));
//                 setCookie('extension-data', JSON.stringify(extensionData), 1);
//             }
//         }
//     };

//     // Fetch reservation details, totals, and branch working hours
//     // Load extension data first, then fetch reservation
//     useEffect(() => {
//         const fetchReservation = async () => {
//             // First, try to load extension data from storage
//             let loadedFromStorage = false;
//             try {
//                 // Try sessionStorage first
//                 const sessionData = sessionStorage.getItem('extensionData');
//                 if (sessionData) {
//                     const data = JSON.parse(sessionData);
//                     if (data.reservationId === reservationId) {
//                         // Set extension time first
//                         if (data.extensionTime) {
//                             setExtensionTime(data.extensionTime);
//                             console.log('Loaded extensionTime from sessionStorage:', data.extensionTime);
//                         }
//                         // Set selected date for DatePicker
//                         if (data.extensionDate) {
//                             const date = new Date(data.extensionDate);
//                             if (!isNaN(date.getTime())) {
//                                 setSelectedExtensionDate(date);
//                                 // Convert to YYYY-MM-DD format for extensionEndDate without timezone issues
//                                 const dateStr = formatDateToString(date);
//                                 setExtensionEndDate(dateStr);
//                                 setIsLoadedFromStorage(true);
//                                 loadedFromStorage = true;
//                                 console.log('Loaded extensionDate from sessionStorage:', {
//                                     original: data.extensionDate,
//                                     parsed: date.toISOString(),
//                                     formatted: dateStr
//                                 });
//                             }
//                         }
//                     }
//                 }

//                 // Fallback to cookie if not found in sessionStorage
//                 if (!loadedFromStorage) {
//                     const cookieData = getCookie('extension-data');
//                     if (cookieData) {
//                         const data = JSON.parse(cookieData);
//                         if (data.reservationId === reservationId) {
//                             // Set extension time first
//                             if (data.extensionTime) {
//                                 setExtensionTime(data.extensionTime);
//                                 console.log('Loaded extensionTime from cookie:', data.extensionTime);
//                             }
//                             // Set selected date for DatePicker
//                             if (data.extensionDate) {
//                                 const date = new Date(data.extensionDate);
//                                 if (!isNaN(date.getTime())) {
//                                     setSelectedExtensionDate(date);
//                                     // Convert to YYYY-MM-DD format for extensionEndDate without timezone issues
//                                     const dateStr = formatDateToString(date);
//                                     setExtensionEndDate(dateStr);
//                                     setIsLoadedFromStorage(true);
//                                     loadedFromStorage = true;
//                                     console.log('Loaded extensionDate from cookie:', {
//                                         original: data.extensionDate,
//                                         parsed: date.toISOString(),
//                                         formatted: dateStr
//                                     });
//                                 }
//                             }
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error loading extension data:', error);
//             }

//             try {
//                 const token = getAuthToken();
//                 if (!token) {
//                     toast.error(locale === 'ar' ? 'يرجى تسجيل الدخول' : 'Please login');
//                     router.push('/auth/login');
//                     return;
//                 }

//                 // Fetch reservation totals to get lastEndDate and lastEndTime
//                 const totalsResponse = await getReservationTotals(reservationId, token);
//                 if (totalsResponse.message === 'SUCCESS' && totalsResponse.data) {
//                     const { lastEndDate, lastEndTime: totalsLastEndTime } = totalsResponse.data;

//                     // Store lastEndTime and lastEndDate for use in pricing hook
//                     if (totalsLastEndTime) {
//                         setLastEndTime(totalsLastEndTime);
//                     }
//                     if (lastEndDate) {
//                         setLastEndDate(lastEndDate);
//                     }

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
//                             // Only set if not loaded from sessionStorage/cookie AND no date is already selected
//                             console.log('Checking if should set default date:', {
//                                 loadedFromStorage,
//                                 isLoadedFromStorage,
//                                 selectedExtensionDate: selectedExtensionDate?.toISOString(),
//                                 extensionTime
//                             });
//                             if (!loadedFromStorage && !selectedExtensionDate) {
//                                 setSelectedExtensionDate(new Date(minDate));
//                                 // Convert to YYYY-MM-DD format for extensionEndDate without timezone issues
//                                 const dateStr = formatDateToString(new Date(minDate));
//                                 setExtensionEndDate(dateStr);

//                                 // Parse and set the last end time (format: HH:mm:ss -> HH:mm) - ensure 24-hour format
//                                 // Only if time is still default (not loaded from storage)
//                                 if (totalsLastEndTime && extensionTime === '09:00') {
//                                     const timeParts = totalsLastEndTime.split(':');
//                                     if (timeParts.length >= 2) {
//                                         // Ensure 24-hour format (HH:mm)
//                                         const hours = parseInt(timeParts[0], 10);
//                                         const minutes = parseInt(timeParts[1], 10);
//                                         const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
//                                         setExtensionTime(formattedTime);
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }

//                 const response = await getReservationDetails(reservationId, token);
//                 if (response.message === 'SUCCESS' && response.data) {
//                     setReservation(response.data);

//                     // Fetch branch working hours
//                     const toBranchId = response.data.toBranchId;
//                     if (toBranchId) {
//                         try {
//                             const branchWorkingHours = await getBranchWorkingHours(toBranchId);
//                             setWorkingHours(branchWorkingHours);
//                         } catch (error) {
//                             console.error('Error fetching branch working hours:', error);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching reservation:', error);
//                 toast.error(locale === 'ar' ? 'فشل تحميل بيانات الحجز' : 'Failed to load reservation');
//             } finally {
//                 setIsLoadingReservation(false);
//             }
//         };

//         fetchReservation();
//     }, [reservationId, locale, router]);

//     // Helper function to format date and time for API
//     const formatDateTime = (date: Date | null, time: string): string | null => {
//         if (!date) return null;

//         const [hours, minutes] = time.split(':');
//         const dateTime = new Date(date);
//         dateTime.setHours(parseInt(hours || '0', 10));
//         dateTime.setMinutes(parseInt(minutes || '0', 10));
//         dateTime.setSeconds(0);
//         dateTime.setMilliseconds(0);

//         const year = dateTime.getFullYear();
//         const month = String(dateTime.getMonth() + 1).padStart(2, '0');
//         const day = String(dateTime.getDate()).padStart(2, '0');
//         const hour = String(dateTime.getHours()).padStart(2, '0');
//         const minute = String(dateTime.getMinutes()).padStart(2, '0');
//         const second = String(dateTime.getSeconds()).padStart(2, '0');
//         const millisecond = String(dateTime.getMilliseconds()).padStart(3, '0');

//         return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
//     };

//     // Pricing is now handled by useExtensionPricing hook

//     // Handle extension booking
//     const handleExtendNow = async () => {
//         if (!selectedExtensionDate || !reservation) {
//             toast.error(locale === 'ar' ? 'بيانات غير مكتملة' : 'Incomplete data');
//             return;
//         }

//         // If price is zero or less, automatically use 'cash' payment method
//         const effectivePaymentMethod = finalTotalPrice <= 0 ? 'cash' : paymentMethod;

//         if (!effectivePaymentMethod) {
//             toast.error(locale === 'ar' ? 'يرجى اختيار طريقة الدفع' : 'Please select payment method');
//             return;
//         }

//         setIsLoadingExtension(true);

//         try {
//             const formattedEndDate = formatDateTime(selectedExtensionDate, extensionTime);

//             if (!formattedEndDate) {
//                 toast.error(locale === 'ar' ? 'خطأ في التاريخ' : 'Invalid date');
//                 return;
//             }

//             // Create extension
//             // For card payment, don't send paymentMethod (will be handled via PayTabs)
//             // For cash payment, send paymentMethod: 'cash'
//             const response = await createExtension({
//                 reservationId,
//                 reservationEndDate: formattedEndDate,
//                 insurance: isInsuranceSelected ? 1 : 0,
//                 points: selectedPoints > 0 ? selectedPoints : undefined,
//                 promoCode: promoCode || undefined,
//                 os: 1,
//                 ...(effectivePaymentMethod === 'cash' && { paymentMethod: 'cash' }),
//             });

//             toast.success(locale === 'ar' ? 'تم إنشاء التمديد بنجاح!' : 'Extension created successfully!');

//             // Save extension data to sessionStorage for checkout
//             if (typeof window !== 'undefined') {
//                 sessionStorage.setItem('extensionData', JSON.stringify(response.data));
//             }

//             // If price is zero or less, always redirect to extend-checkout (cash flow)
//             // Otherwise, check payment method: if card, initiate PayTabs payment; if cash, redirect to extend-checkout
//             if (finalTotalPrice <= 0) {
//                 // For zero or negative price, always treat as cash payment and redirect to extend-checkout
//                 router.push(`/extend-checkout?reservationId=${reservationId}&extensionId=${response.data.reservationExtensionId}`);
//             } else if (effectivePaymentMethod === 'card') {
//                 await handlePayTabsPayment(response.data);
//             } else {
//                 // For cash payment, redirect to extend-checkout
//                 router.push(`/extend-checkout?reservationId=${reservationId}&extensionId=${response.data.reservationExtensionId}`);
//             }
//         } catch (error) {
//             console.error('Error creating extension:', error);

//             let errorMessage = '';
//             if (error instanceof Error) {
//                 errorMessage = (error as any).apiMessage || error.message;
//             }

//             if (errorMessage) {
//                 showApiMessage(errorMessage, tValidation);
//             } else {
//                 toast.error(locale === 'ar' ? 'فشل إنشاء التمديد' : 'Failed to create extension');
//             }
//         } finally {
//             setIsLoadingExtension(false);
//         }
//     };

//     // Handle PayTabs payment for extension
//     const handlePayTabsPayment = async (extensionData: any) => {
//         try {
//             // Use finalTotalPrice directly without subtracting points (points are handled by API)
//             const finalAmount = finalTotalPrice || extensionData.finalAmount || extensionData.amount || 0;
//             const extensionId = extensionData.reservationExtensionId;

//             const customerData = {
//                 name: `${clientData?.firstName || ''} ${clientData?.lastName || ''}`.trim() || 'Guest',
//                 email: clientData?.email || 'guest@example.com',
//                 phone: clientData?.mobile || '',
//                 street1: "Riyadh Street",
//                 city: "Riyadh",
//                 state: "R",
//                 country: "SA",
//                 zip: "11564",
//                 address: "Riyadh Street",
//                 address2: "Riyadh Street",
//             };

//             const returnParams = new URLSearchParams({
//                 reservationId: String(reservationId),
//                 extensionId: String(extensionId),
//                 total: String(finalTotalPrice || extensionData.finalAmount || 0),
//                 finalAmount: String(finalAmount),
//                 pointsUsed: String(selectedPoints || 0),
//                 locale: locale,
//                 lim: 'false',
//             }).toString();

//             // Build return URL for extension checkout
//             const returnUrl = typeof window !== 'undefined'
//                 ? `${window.location.origin}/${locale}/extend-checkout`
//                 : (process.env.NEXT_PUBLIC_RETURN_URL
//                     ? `${process.env.NEXT_PUBLIC_RETURN_URL.replace(/\/$/, '')}/${locale}/extend-checkout`
//                     : `/${locale}/extend-checkout`);

//             const paymentResponse = await fetch('/api/payment/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     amount: finalAmount,
//                     currency: 'SAR',
//                     cart_id: String(extensionId),
//                     description: `تمديد حجز - ${reservation?.carName || 'Car Rental Extension'}`,
//                     customer: customerData,
//                     return_params: returnParams,
//                     return_url: returnUrl, // Custom return URL for extension
//                     paypage_lang: locale,
//                 }),
//             });

//             const paymentData = await paymentResponse.json();

//             if (paymentData.redirect_url) {
//                 if (typeof window !== 'undefined') {
//                     const paymentInfo = {
//                         tran_ref: paymentData.tran_ref,
//                         cart_id: String(extensionId),
//                         reservationId: reservationId,
//                         extensionId: extensionId,
//                         amount: finalAmount,
//                         currency: 'SAR',
//                         customer: customerData,
//                         extensionData: extensionData,
//                         timestamp: new Date().toISOString(),
//                         isExtension: true,
//                     };
//                     localStorage.setItem('paymentData', JSON.stringify(paymentInfo));
//                     sessionStorage.setItem('paymentRef', paymentData.tran_ref);
//                 }

//                 toast.loading(locale === 'ar' ? 'جاري تحويلك لصفحة الدفع...' : 'Redirecting to payment page...');

//                 setTimeout(() => {
//                     window.location.href = paymentData.redirect_url;
//                 }, 1000);
//             } else {
//                 throw new Error(paymentData.error || 'فشل في إنشاء صفحة الدفع');
//             }
//         } catch (error) {
//             console.error('Error initiating PayTabs payment:', error);
//             toast.error(locale === 'ar' ? 'فشل في إنشاء صفحة الدفع' : 'Failed to create payment page');
//             router.push('/checkout');
//         }
//     };

//     // Calculate days between current end and extension end
//     const extensionDays = useMemo(() => {
//         if (!reservation?.endDate || !extensionEndDate) return 0;

//         const currentEnd = new Date(reservation.endDate);
//         const newEnd = new Date(extensionEndDate);
//         const diffTime = Math.abs(newEnd.getTime() - currentEnd.getTime());
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//         return diffDays;
//     }, [reservation?.endDate, extensionEndDate]);

//     // Points calculations
//     const availablePoints = parseFloat(clientData?.pointsCalculation || '0') || clientData?.totalPoints || 0;
//     const pointsSpentPerSAR = parseFloat(sharedData?.settings?.POINTS_SPENT_PER_SAR || '50');
//     const maxPointsPerUse = parseFloat(sharedData?.settings?.MAX_POINTS_PER_USE || '20000');
//     const maxPointsUsable = Math.min(maxPointsPerUse, availablePoints);

//     // Format price helper
//     const formatPrice = (price: number) => {
//         return price.toFixed(2);
//     };

//     const finalTotalPrice = pricingData?.finalTotalPrice || 0;
//     const finalPriceBeforeDiscount = pricingData?.finalPriceBeforeDiscount || 0;

//     // Auto-set payment method to 'cash' when price is zero or less
//     useEffect(() => {
//         if (finalTotalPrice <= 0) {
//             setPaymentMethod('cash');
//         }
//     }, [finalTotalPrice]);

//     // Loading state
//     if (isLoadingReservation) {
//         return (
//             <div className="container-custom py-8">
//                 <div className="text-center">
//                     <p className="text-gray-600">
//                         {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (!reservation) {
//         return (
//             <div className="container-custom py-8">
//                 <div className="text-center">
//                     <p className="text-gray-600">
//                         {locale === 'ar' ? 'لم يتم العثور على الحجز' : 'Reservation not found'}
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Check if extension date is set
//     if (!selectedExtensionDate) {
//         return (
//             <div className="container-custom py-8">
//                 <div className="text-center">
//                     <p className="text-gray-600">
//                         {locale === 'ar' ? 'لم يتم تحديد تاريخ التمديد' : 'Extension date not set'}
//                     </p>
//                     <button
//                         onClick={() => router.push(`/profile/my-bookings/${reservationId}`)}
//                         className="mt-4 text-primary underline"
//                     >
//                         {locale === 'ar' ? 'العودة للحجز' : 'Back to reservation'}
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const displayImage = normalizeImageUrl(reservation.carImage) || '/shared/CarNotFound.png';

//     return (
//         <>
//             <div className='custom-bg'>
//                 <div className="container-custom py-4 md:py-8">
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
//                         {/* Car Image Section */}
//                         <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
//                             <div className="relative w-full h-full">
//                                 <div className="relative bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full h-[300px] md:w-full md:h-[400px] border-3 border-white">
//                                     <Image
//                                         src={displayImage}
//                                         alt={reservation.carName}
//                                         fill
//                                         className="object-contain w-full h-full"
//                                         priority
//                                     />
//                                 </div>

//                                 {/* Points Selector */}
//                                 {availablePoints > 0 && (
//                                     <PointsSelector
//                                         totalPoints={availablePoints}
//                                         pointsSpentPerSAR={pointsSpentPerSAR}
//                                         maxPointsPerUse={maxPointsPerUse}
//                                         maxPointsUsable={maxPointsUsable}
//                                         selectedPoints={selectedPoints}
//                                         onPointsChange={setSelectedPoints}
//                                         locale={locale}
//                                     />
//                                 )}
//                             </div>
//                         </div>

//                         {/* Extension Details Section */}
//                         <div ref={containerRef} className="md:col-span-7 w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
//                             <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
//                                 {/* Header */}
//                                 {!showStickyHeader && (
//                                     <div className="sticky top-0 z-20 bg-white">
//                                         <ExtendBookingHeader
//                                             days={extensionDays}
//                                             currentPrice={finalTotalPrice}
//                                             originalPrice={finalPriceBeforeDiscount}
//                                             formatPrice={formatPrice}
//                                             onExtendNow={handleExtendNow}
//                                             isLoading={isLoadingPricing || isLoadingExtension}
//                                             isFormValid={!!paymentMethod || finalTotalPrice <= 0}
//                                         />
//                                     </div>
//                                 )}

//                                 <div className="px-2 py-4 md:py-[18px] relative">
//                                     <div className="flex flex-col gap-4 md:gap-6 px-2 md:px-[18px]">
//                                         <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//                                             {/* Car Info */}
//                                             <div className="mb-6">
//                                                 <h2 className="text-xl font-bold text-gray-800 mb-2">
//                                                     {reservation.carName}
//                                                 </h2>
//                                                 <p className="text-sm text-gray-600">
//                                                     {locale === 'ar' ? reservation.typeArabicName : reservation.typeEnglishName}
//                                                 </p>
//                                             </div>

//                                             {/* Extension Info */}
//                                             <div className="bg-[#ECEEF2] p-4 rounded-lg mb-6">
//                                                 <h3 className="font-semibold text-gray-800 mb-3">
//                                                     {locale === 'ar' ? 'معلومات التمديد' : 'Extension Information'}
//                                                 </h3>

//                                                 {/* Current End Date Info */}
//                                                 <div className="space-y-2 text-sm mb-4">
//                                                     <div className="flex justify-between">
//                                                         <span className="text-gray-600">
//                                                             {locale === 'ar' ? 'تاريخ الانتهاء الاساسي:' : 'Basic End Date:'}
//                                                         </span>
//                                                         <span className="font-medium">
//                                                             {new Date(reservation.endDate).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex justify-between">
//                                                         <span className="text-gray-600">
//                                                             {locale === 'ar' ? 'عدد أيام التمديد:' : 'Extension Days:'}
//                                                         </span>
//                                                         <span className="font-bold text-primary">
//                                                             {extensionDays} {locale === 'ar' ? 'يوم' : 'days'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="border border-[#ECEEF2] rounded-lg p-4 bg-white">

//                                                     {/* Date Selection */}
//                                                     <div className="space-y-2">
//                                                         <label className="text-sm font-medium text-gray-700">
//                                                             {locale === 'ar' ? 'تاريخ التمديد الجديد' : 'New Extension Date'}
//                                                             <span className="text-red-500 mr-1">*</span>
//                                                         </label>
//                                                         <div className="w-full mt-2">
//                                                             <DatePicker
//                                                                 value={selectedExtensionDate}
//                                                                 onChange={handleDateChange}
//                                                                 locale={locale}
//                                                                 placeholder={locale === 'ar' ? 'اختر التاريخ' : 'Select date'}
//                                                                 label=""
//                                                                 dialogTitle={locale === 'ar' ? 'اختر تاريخ التمديد' : 'Select Extension Date'}
//                                                                 minDate={minExtensionDate}
//                                                                 className="w-full"
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     {/* Time Selection */}
//                                                     <div className="space-y-2">
//                                                         <label className="text-sm font-medium text-gray-700">
//                                                             {locale === 'ar' ? 'وقت التسليم' : 'Extension Time'}
//                                                             <span className="text-red-500 mr-1">*</span>
//                                                         </label>
//                                                         <div className="w-full mt-2">
//                                                             <TimeSlotSelector
//                                                                 selectedTime={extensionTime}
//                                                                 onTimeSelect={handleTimeChange}
//                                                                 selectedDate={selectedExtensionDate}
//                                                                 locale={locale}
//                                                                 isLocation={false}
//                                                                 workingHours={workingHours}
//                                                                 placeholder={locale === 'ar' ? 'اختر الوقت' : 'Select time'}
//                                                                 className="w-full h-10"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Insurance Selection */}
//                                             {reservation.insuranceValue > 0 && (
//                                                 <InsuranceSelector
//                                                     locale={locale}
//                                                     // insurancePrice={reservation.insuranceValue}
//                                                     insurancePrice={0}
//                                                     isSelected={isInsuranceSelected}
//                                                     onSelectionChange={setIsInsuranceSelected}
//                                                 />
//                                             )}

//                                             {/* Promo Code Selection */}
//                                             <PromoCodeSelector
//                                                 locale={locale}
//                                                 promoCode={promoCode}
//                                                 onPromoCodeChange={setPromoCode}
//                                             />

//                                             {/* Invoice Details */}
//                                             {pricingData && (
//                                                 <InvoiceDetails
//                                                     pricingData={{
//                                                         ...pricingData,
//                                                         refCodeValid: !!promoCode,
//                                                         unfreeHours: 0,
//                                                     }}
//                                                     locale={locale}
//                                                     formatPrice={formatPrice}
//                                                 />
//                                             )}

//                                             {/* Payment Method Selection - Hide when price is zero or less */}
//                                             {finalTotalPrice > 0 && (
//                                                 <PaymentMethodSelector
//                                                     selectedMethod={paymentMethod}
//                                                     onMethodChange={setPaymentMethod}
//                                                     locale={locale}
//                                                 />
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div ref={stickyTriggerRef} className="h-1 w-full" aria-hidden="true" />

//                                 {/* Sticky Header */}
//                                 {showStickyHeader && (
//                                     <div
//                                         className="z-50 bg-white shadow-lg border-t-2 border-[#ECEEF2] mt-4"
//                                         style={headerStyle}
//                                     >
//                                         <ExtendBookingHeader
//                                             days={extensionDays}
//                                             currentPrice={finalTotalPrice > 0 ? finalTotalPrice : 0}
//                                             originalPrice={finalPriceBeforeDiscount > 0 ? finalPriceBeforeDiscount : 0}
//                                             formatPrice={formatPrice}
//                                             onExtendNow={handleExtendNow}
//                                             isLoading={isLoadingPricing || isLoadingExtension}
//                                             isFormValid={!!paymentMethod || finalTotalPrice <= 0}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Warning Dialog */}
//             <WarningDialog
//                 warningInfo={warningInfo}
//                 isOpen={isWarningDialogOpen}
//                 onOpenChange={setIsWarningDialogOpen}
//                 onAccept={handleWarningAccept}
//                 onReject={handleWarningReject}
//                 t={t}
//             />
//         </>
//     );
// };

// export default ExtendBookingContent;

const ExtendBookingContent = () => {
  return <div>ExtendBookingContent</div>;
};

export default ExtendBookingContent;
