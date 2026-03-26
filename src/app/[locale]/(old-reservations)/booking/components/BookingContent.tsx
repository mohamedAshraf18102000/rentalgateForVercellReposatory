// 'use client';

// /**
//  * Booking Content Component
//  * Main component for the booking page that orchestrates all booking-related features:
//  * - Car information display
//  * - Insurance selection
//  * - Additional services selection
//  * - Extra kilometers packages
//  * - Invoice details
//  * - Payment method selection
//  * - Pricing calculations
//  */

// import { BookingHeader } from '@/app/[locale]/(old-reservations)/cars/[id]/car-details/header/BookingHeader';
// import { CarInfoSection } from '@/app/[locale]/(old-reservations)/cars/[id]/car-details/sections/CarInfoSection';
// import type { PricingData } from '@/constants/api';
// import { useStickyHeader } from '@/hooks/useStickyHeader';
// import { useRouter } from '@/i18n/routing';
// import { getPricingFromCookie, getReservationPricing } from '@/lib/api/pricing';
// import { createReservation } from '@/lib/api/reservation';
// import { useCarDataStore, useClientStore, useFilterStore, useSharedStore, useValidationStore } from '@/lib/api/stores';
// import { showApiMessage } from '@/lib/api/utils/toast-handler';
// import { normalizeImageUrl } from '@/util/image';
// import { useTranslations } from 'next-intl';
// import Image from 'next/image';
// import React, { useEffect, useMemo, useState } from 'react';
// import { toast } from 'sonner';

// // Organized component imports
// import { Checkbox } from '@/app/(components)/ui/checkbox';
// import { InsuranceSelector } from './insurance';
// import { InvoiceDetails } from './invoice';
// import { ExtraKilometers } from './kilometers';
// import { PaymentMethodSelector, type PaymentMethod } from './payment';
// import { PointsSelector } from './points';
// import { PromoCodeSelector } from './promocode';
// import { ReservationForOtherSelector } from './reservation-for-other';
// import { AvailableServices } from './services';

// interface BookingContentProps {
//   locale: string;
// }

// const BookingContent: React.FC<BookingContentProps> = ({ locale }) => {
//   const t = useTranslations('carDetails');
//   const tValidation = useTranslations('validation.AUTH_ERRORS');
//   const { days } = useFilterStore();
//   const { clientData } = useClientStore();
//   const { sharedData } = useSharedStore();
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // Get data from validation store
//   const {
//     pickupDate,
//     dropoffDate,
//     pickupTime,
//     dropoffTime,
//     pickupLocation,
//     fromBranch,
//     toBranch,
//     extraServices,
//     carExtraKmQuota,
//     promoCode,
//     isInsuranceSelected,
//     selectedPoints,
//     reservationForOther,
//     setPickupDate,
//     setDropoffDate,
//     setPickupTime,
//     setDropoffTime,
//     setPickupLocation,
//     setExtraServices,
//     setCarExtraKmQuota,
//     setPromoCode,
//     setIsInsuranceSelected,
//     setSelectedPoints,
//     setReservationForOther,
//   } = useValidationStore();

//   // Get data from car data store
//   const { car, setCar, setCategoryText, setLocale } = useCarDataStore();

//   // Initialize car data from store on mount (persist will handle restoration from cookies)
//   useEffect(() => {
//     // Set locale if not already set
//     if (locale) {
//       setLocale(locale);
//     }
//   }, [locale, setLocale]);

//   // Get category text from car data based on locale
//   const categoryText = useMemo(() => {
//     if (!car) return '';
//     const typeArabic = car.typeArabicName?.trim() || '';
//     const typeEnglish = car.typeEnglishName?.trim() || '';
//     return locale === 'ar'
//       ? (typeArabic || 'نوع غير معروف')
//       : (typeEnglish || 'Unknown type');
//   }, [car, locale]);

//   // Pricing state
//   const [pricingData, setPricingData] = useState<PricingData | null>(null);
//   const [isLoadingPricing, setIsLoadingPricing] = useState(false);

//   // Payment method state - null means no method selected yet
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

//   // Services loading state
//   const [servicesLoaded, setServicesLoaded] = useState(false);
//   const [kmsLoaded, setKmsLoaded] = useState(false);

//   // Insurance terms agreement state
//   const [insuranceTermsAgreed, setInsuranceTermsAgreed] = useState(false);

//   // Use sticky header hook
//   const { showStickyHeader, containerRef, stickyTriggerRef, headerStyle } = useStickyHeader();

//   // Router hook - must be called before any early returns
//   const router = useRouter();

//   // Helper function to format date and time for API
//   const formatDateTime = (date: Date | null, time: string): string | null => {
//     if (!date) return null;

//     const [hours, minutes] = time.split(':');
//     const dateTime = new Date(date);
//     dateTime.setHours(parseInt(hours || '0', 10));
//     dateTime.setMinutes(parseInt(minutes || '0', 10));
//     dateTime.setSeconds(0);
//     dateTime.setMilliseconds(0);

//     const year = dateTime.getFullYear();
//     const month = String(dateTime.getMonth() + 1).padStart(2, '0');
//     const day = String(dateTime.getDate()).padStart(2, '0');
//     const hour = String(dateTime.getHours()).padStart(2, '0');
//     const minute = String(dateTime.getMinutes()).padStart(2, '0');
//     const second = String(dateTime.getSeconds()).padStart(2, '0');
//     const millisecond = String(dateTime.getMilliseconds()).padStart(3, '0');

//     return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
//   };

//   // Fetch pricing when all required data is available
//   useEffect(() => {
//     const fetchPricing = async () => {
//       if (!car?.carId || !pickupDate || !dropoffDate || !fromBranch) {
//         return;
//       }

//       // Wait for services and kms to load before making the first request
//       if (!servicesLoaded || !kmsLoaded) {
//         return;
//       }

//       const finalToBranch = toBranch || fromBranch;
//       const startDateTime = formatDateTime(pickupDate, pickupTime);
//       const endDateTime = formatDateTime(dropoffDate, dropoffTime);

//       if (!startDateTime || !endDateTime) {
//         return;
//       }

//       setIsLoadingPricing(true);
//       try {
//         const response = await getReservationPricing({
//           carId: car.carId,
//           reservationStartDate: startDateTime,
//           reservationEndDate: endDateTime,
//           fromBranch: fromBranch,
//           toBranch: finalToBranch,
//           extraServices: extraServices.length > 0 ? extraServices : undefined,
//           carExtraKmQuota: carExtraKmQuota !== null ? carExtraKmQuota : undefined,
//           insurance: isInsuranceSelected ? 1 : 0,
//           promoCode: promoCode || undefined,
//           points: selectedPoints > 0 ? selectedPoints : undefined,
//         });

//         if (response?.data) {
//           setPricingData(response.data);
//           if (response.message === 'SUCCESS') {
//             showApiMessage('PRICING_CALCULATED_SUCCESS', tValidation);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching pricing:', error);
//         let apiMessage = '';
//         if (error instanceof Error) {
//           apiMessage = (error as any).apiMessage || error.message;
//         }
//         if (apiMessage) {
//           showApiMessage(apiMessage, tValidation);
//         } else {
//           showApiMessage('CAR_AVAILABILITY_CHECK_FAILED', tValidation);
//         }

//         const cachedPricing = getPricingFromCookie();
//         if (cachedPricing) {
//           setPricingData(cachedPricing);
//         }
//       } finally {
//         setIsLoadingPricing(false);
//       }
//     };

//     fetchPricing();
//   }, [car?.carId, pickupDate, dropoffDate, pickupTime, dropoffTime, fromBranch, toBranch, extraServices, carExtraKmQuota, servicesLoaded, kmsLoaded, isInsuranceSelected, promoCode, selectedPoints, tValidation]);

//   // Handle service selection
//   const handleServiceToggle = (serviceId: number) => {
//     const currentServices = extraServices || [];
//     if (currentServices.includes(serviceId)) {
//       setExtraServices(currentServices.filter((id) => id !== serviceId));
//     } else {
//       setExtraServices([...currentServices, serviceId]);
//     }
//   };

//   // Get saved pricing from cookie
//   const savedPricing = getPricingFromCookie();
//   const finalTotalPrice = savedPricing?.finalTotalPrice || 0;
//   const finalPriceBeforeDiscount = savedPricing?.finalPriceBeforeDiscount || 0;

//   // Auto-set payment method to 'cash' when price is zero or less
//   // This hook must be called before any early returns
//   useEffect(() => {
//     if (finalTotalPrice <= 0) {
//       setPaymentMethod('cash');
//     }
//   }, [finalTotalPrice]);

//   // Guard clause if car is not loaded
//   if (!car) {
//     return (
//       <div className="container-custom py-4 md:py-8">
//         <div className="text-center py-12">
//           <p className="text-gray-600">{locale === 'ar' ? 'لا توجد بيانات سيارة' : 'No car data available'}</p>
//         </div>
//       </div>
//     );
//   }

//   // Get all images and normalize their URLs
//   const allImages: string[] = [];
//   // إضافة الصورة الرئيسية أولاً
//   if (car.image) {
//     const normalizedImage = normalizeImageUrl(car.image);
//     allImages.push(normalizedImage);
//   }
//   if (car.defaultImage && !allImages.includes(normalizeImageUrl(car.defaultImage))) {
//     allImages.push(normalizeImageUrl(car.defaultImage));
//   }
//   // إضافة باقي الصور
//   if (car.images && car.images.length > 0) {
//     car.images.forEach((img) => {
//       const normalizedImage = normalizeImageUrl(img);
//       if (img && !allImages.includes(normalizedImage)) {
//         allImages.push(normalizedImage);
//       }
//     });
//   }
//   const displayImage = allImages[selectedImageIndex] || allImages[0] || '/shared/CarNotFound.png';

//   // Calculate pricing
//   const hasOffer = car.offer && car.offerDailyPrice > 0 && car.offerDailyPrice < car.dailyPrice;
//   const currentPrice = hasOffer ? car.offerDailyPrice : car.dailyPrice;
//   const originalPrice = hasOffer ? car.dailyPrice : car.dailyPrice;
//   const discountPercentage = hasOffer && originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

//   // Format price helper
//   const formatPrice = (price: number) => {
//     return price.toFixed(2);
//   };

//   // Points calculations - Same as Algazal
//   // استخدام pointsCalculation (النقاط القابلة للاستخدام) بدلاً من totalPoints
//   const availablePoints = parseFloat(clientData?.pointsCalculation || '0') || clientData?.totalPoints || 0;
//   const pointsSpentPerSAR = parseFloat(sharedData?.settings?.POINTS_SPENT_PER_SAR || '50');
//   const maxPointsPerUse = parseFloat(sharedData?.settings?.MAX_POINTS_PER_USE || '20000');
//   // الحد الأقصى = الأقل بين حد النظام ونقاط المستخدم المتاحة (نفس الغزال)
//   const maxPointsUsable = Math.min(maxPointsPerUse, availablePoints);

//   // Handle booking submission
//   const handleBookNow = async () => {
//     // Validation checks
//     if (!car?.carId) {
//       toast.error(locale === 'ar' ? 'لا توجد بيانات سيارة' : 'No car data available');
//       return;
//     }

//     if (!pickupDate || !dropoffDate || !fromBranch) {
//       toast.error(locale === 'ar' ? 'يرجى إكمال جميع البيانات المطلوبة' : 'Please complete all required data');
//       return;
//     }

//     if (!insuranceTermsAgreed) {
//       toast.error(t('pleaseAgreeToInsuranceTerms'));
//       return;
//     }

//     // If price is zero or less, automatically use 'cash' payment method
//     const effectivePaymentMethod = finalTotalPrice <= 0 ? 'cash' : paymentMethod;

//     if (!effectivePaymentMethod) {
//       toast.error(locale === 'ar' ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method');
//       return;
//     }

//     setIsLoadingPricing(true);

//     try {
//       const finalToBranch = toBranch || fromBranch;
//       const startDateTime = formatDateTime(pickupDate, pickupTime);
//       const endDateTime = formatDateTime(dropoffDate, dropoffTime);

//       if (!startDateTime || !endDateTime) {
//         toast.error(locale === 'ar' ? 'خطأ في التواريخ' : 'Invalid dates');
//         return;
//       }

//       // Create reservation
//       const response = await createReservation({
//         carId: car.carId,
//         reservationStartDate: startDateTime,
//         reservationEndDate: endDateTime,
//         reservationType: 1,
//         fromBranch: fromBranch,
//         toBranch: finalToBranch,
//         carExtraKmQuota: carExtraKmQuota !== null ? carExtraKmQuota : undefined,
//         extraServices: extraServices.length > 0 ? extraServices : undefined,
//         insurance: isInsuranceSelected ? 1 : 0,
//         os: 1,
//         paymentMethod: effectivePaymentMethod,
//         promoCode: promoCode || undefined,
//         points: selectedPoints > 0 ? selectedPoints : undefined,
//         reservationForOther: reservationForOther || undefined,
//       });

//       // Show success message
//       toast.success(locale === 'ar' ? 'تم إنشاء الحجز بنجاح!' : 'Reservation created successfully!');

//       // Save reservation data to sessionStorage for checkout page
//       if (typeof window !== 'undefined') {
//         sessionStorage.setItem('reservationData', JSON.stringify(response.data));
//       }

//       // If price is zero or less, always redirect to checkout (cash flow)
//       // Otherwise, check payment method: if card, initiate PayTabs payment; if cash, redirect to checkout
//       if (finalTotalPrice <= 0) {
//         // For zero or negative price, always treat as cash payment and redirect to checkout
//         router.push('/checkout');
//       } else if (effectivePaymentMethod === 'card') {
//         await handlePayTabsPayment(response.data);
//       } else {
//         // For cash payment, redirect to checkout page
//         router.push('/checkout');
//       }
//     } catch (error) {
//       console.error('Error creating reservation:', error);

//       // Show error message
//       let errorMessage = '';
//       if (error instanceof Error) {
//         errorMessage = (error as any).apiMessage || error.message;
//       }

//       if (errorMessage) {
//         showApiMessage(errorMessage, tValidation);
//       } else {
//         toast.error(locale === 'ar' ? 'فشل إنشاء الحجز' : 'Failed to create reservation');
//       }
//     } finally {
//       setIsLoadingPricing(false);
//     }
//   };

//   // Handle PayTabs payment - Same as Algazal
//   const handlePayTabsPayment = async (reservationData: any) => {
//     try {
//       // Use finalTotalPrice directly without subtracting points (points are handled by API)
//       const finalAmount = finalTotalPrice || reservationData.total || 0;
//       const reservationId = reservationData.reservationId;

//       // Prepare customer data
//       const customerData = {
//         name: `${clientData?.firstName || ''} ${clientData?.lastName || ''}`.trim() || 'Guest',
//         email: clientData?.email || 'guest@example.com',
//         phone: clientData?.mobile || '',
//         street1: "Riyadh Street",
//         city: "Riyadh",
//         state: "R",
//         country: "SA",
//         zip: "11564",
//         address: "Riyadh Street",
//         address2: "Riyadh Street",
//       };

//       // Create return params with reservation ID only (payment-result will query PayTabs)
//       const returnParams = new URLSearchParams({
//         reservationId: String(reservationId),
//         // Include basic data for payment-result page
//         total: String(finalTotalPrice || reservationData.total || 0),
//         finalAmount: String(finalAmount),
//         pointsUsed: String(selectedPoints || 0),
//         locale: locale,
//         lim: 'false' // Always false for car rentals (not limousine)
//       }).toString();

//       // Call PayTabs create payment API
//       const paymentResponse = await fetch('/api/payment/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: finalAmount,
//           currency: 'SAR',
//           cart_id: String(reservationId),
//           description: `حجز سيارة - ${car.carName}`,
//           customer: customerData,
//           return_params: returnParams,
//           paypage_lang: locale,
//         }),
//       });

//       const paymentData = await paymentResponse.json();

//       if (paymentData.redirect_url) {
//         // Save payment info in localStorage (same as Algazal)
//         if (typeof window !== 'undefined') {
//           const paymentInfo = {
//             tran_ref: paymentData.tran_ref,
//             cart_id: String(reservationId),
//             reservationId: reservationId,
//             amount: finalAmount,
//             currency: 'SAR',
//             customer: customerData,
//             reservationData: reservationData,
//             timestamp: new Date().toISOString()
//           };
//           localStorage.setItem('paymentData', JSON.stringify(paymentInfo));
//           sessionStorage.setItem('paymentRef', paymentData.tran_ref);
//         }

//         // Show loading message
//         toast.loading(locale === 'ar' ? 'جاري تحويلك لصفحة الدفع...' : 'Redirecting to payment page...');

//         // Redirect to PayTabs payment page
//         setTimeout(() => {
//           window.location.href = paymentData.redirect_url;
//         }, 1000);
//       } else {
//         throw new Error(paymentData.error || 'فشل في إنشاء صفحة الدفع');
//       }
//     } catch (error) {
//       console.error('Error initiating PayTabs payment:', error);
//       toast.error(locale === 'ar' ? 'فشل في إنشاء صفحة الدفع' : 'Failed to create payment page');
//       // Redirect to checkout page anyway
//       router.push('/checkout');
//     }
//   };

//   return (
//     <div className='custom-bg'>
//       <div className="container-custom py-4 md:py-8">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
//           {/* Car Image - Mobile first, then Desktop right (for Arabic) */}
//           <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
//             <div className="relative w-full h-full">
//               <div className="relative bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full h-[300px] md:w-full md:h-[400px] border-3 border-white">
//                 <Image
//                   src={displayImage}
//                   alt={car.carName}
//                   fill
//                   className="object-contain w-full h-full"
//                   priority
//                 />
//               </div>
//               {/* Points Selector */}
//               {availablePoints > 0 && (
//                 <PointsSelector
//                   totalPoints={availablePoints}
//                   pointsSpentPerSAR={pointsSpentPerSAR}
//                   maxPointsPerUse={maxPointsPerUse}
//                   maxPointsUsable={maxPointsUsable}
//                   selectedPoints={selectedPoints}
//                   onPointsChange={setSelectedPoints}
//                   locale={locale}
//                 />
//               )}

//             </div>
//           </div>

//           {/* Booking Section - Mobile first, then Desktop left */}
//           <div ref={containerRef} className="md:col-span-7 w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
//             <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
//               {/* Original Header - hidden when sticky header is shown */}
//               {!showStickyHeader && (
//                 <div className="sticky top-0 z-20 bg-white">
//                   <BookingHeader
//                     days={days}
//                     currentPrice={finalTotalPrice > 0 ? finalTotalPrice : 0}
//                     originalPrice={finalPriceBeforeDiscount > 0 ? finalPriceBeforeDiscount : 0}
//                     hasOffer={hasOffer}
//                     formatPrice={formatPrice}
//                     onBookNow={handleBookNow}
//                     isLoading={isLoadingPricing}
//                     isFormValid={(!!paymentMethod || finalTotalPrice <= 0) && insuranceTermsAgreed}
//                   />
//                 </div>
//               )}
//               <div className="px-2 py-4 md:py-[18px] relative">
//                 <div className="flex flex-col gap-4 md:gap-6 px-2 md:px-[18px]">
//                   <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//                     <CarInfoSection
//                       carName={car.carName}
//                       categoryText={categoryText}
//                       numberOfPassengers={car.numberOfPassengers}
//                       discountPercentage={discountPercentage}
//                       currentPrice={currentPrice > 0 ? currentPrice : 0}
//                       originalPrice={originalPrice > 0 ? originalPrice : 0}
//                       t={t}
//                       modelArabicName={car.modelArabicName}
//                       modelEnglishName={car.modelEnglishName}
//                       brandArabicName={car.brandArabicName}
//                       brandName={car.brandName}
//                       year={car.carYear}
//                       locale={locale}
//                     />

//                     {/* Insurance Selection */}
//                     {car?.insurancePrice && (
//                       <InsuranceSelector
//                         locale={locale}
//                         insurancePrice={car.insurancePrice}
//                         isSelected={isInsuranceSelected}
//                         onSelectionChange={setIsInsuranceSelected}
//                       />
//                     )}

//                     {/* Available Services Selection */}
//                     <AvailableServices
//                       locale={locale}
//                       selectedServices={extraServices}
//                       onServiceToggle={handleServiceToggle}
//                       onServicesLoaded={setServicesLoaded}
//                     />

//                     {/* Extra Kilometers Packages */}
//                     <ExtraKilometers
//                       locale={locale}
//                       carId={car?.carId}
//                       selectedKmId={carExtraKmQuota}
//                       onKmChange={setCarExtraKmQuota}
//                       onKmsLoaded={setKmsLoaded}
//                     />

//                     {/* Promo Code Selection */}
//                     <PromoCodeSelector
//                       locale={locale}
//                       promoCode={promoCode}
//                       onPromoCodeChange={setPromoCode}
//                     />

//                     {/* Reservation For Other Person */}
//                     <ReservationForOtherSelector
//                       locale={locale}
//                       reservationForOther={reservationForOther}
//                       onReservationForOtherChange={setReservationForOther}
//                     />

//                     {(pricingData || savedPricing) && (
//                       <InvoiceDetails
//                         pricingData={pricingData || savedPricing!}
//                         locale={locale}
//                         formatPrice={formatPrice}
//                       />
//                     )}

//                     {/* Payment Method Selection - Hide when price is zero or less */}
//                     {finalTotalPrice > 0 && (
//                       <PaymentMethodSelector
//                         selectedMethod={paymentMethod}
//                         onMethodChange={setPaymentMethod}
//                         locale={locale}
//                       />
//                     )}

//                     {/* Insurance Terms Agreement */}
//                     <div className="flex items-start gap-3 p-4 bg-[#F8F8F8] rounded-lg border border-[#ECEEF2] mt-2">
//                       <Checkbox
//                         id="insurance-terms"
//                         checked={insuranceTermsAgreed}
//                         onCheckedChange={(checked) => setInsuranceTermsAgreed(checked === true)}
//                         className="mt-1"
//                       />
//                       <label
//                         htmlFor="insurance-terms"
//                         className="text-sm text-[#595959] cursor-pointer leading-relaxed"
//                       >
//                         {t('insuranceTermsAgreement')}
//                       </label>
//                     </div>
//                   </div>

//                   {/* Invisible trigger div to detect when to switch to sticky */}
//                 </div>
//               </div>
//               <div ref={stickyTriggerRef} className="h-1 w-full" aria-hidden="true" />

//               {/* Header at Bottom - shows when original header is hidden */}
//               {showStickyHeader && (
//                 <div
//                   className="z-50 bg-white shadow-lg border-t-2 border-[#ECEEF2] mt-4"
//                   style={headerStyle}
//                 >
//                   <BookingHeader
//                     days={days}
//                     currentPrice={finalTotalPrice > 0 ? finalTotalPrice : 0}
//                     originalPrice={finalPriceBeforeDiscount > 0 ? finalPriceBeforeDiscount : 0}
//                     hasOffer={hasOffer}
//                     formatPrice={formatPrice}
//                     onBookNow={handleBookNow}
//                     isLoading={isLoadingPricing}
//                     isFormValid={(!!paymentMethod || finalTotalPrice <= 0) && insuranceTermsAgreed}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default BookingContent;

const BookingContent = () => {
  return <div>BookingContent</div>;
};

export default BookingContent;
