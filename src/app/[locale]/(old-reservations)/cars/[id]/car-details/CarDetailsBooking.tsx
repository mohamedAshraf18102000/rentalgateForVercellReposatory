// 'use client';

// /**
//  * CarDetailsBooking Component
//  * Main booking component that orchestrates all booking-related functionality
//  *
//  * Features:
//  * - Booking form with validation
//  * - Pricing calculations
//  * - Warning dialogs for extra charges
//  * - Better price offers
//  */

// import { useState, useEffect } from 'react';
// import { useTranslations } from 'next-intl';
// import { useFilterStore } from '@/lib/api/stores';
// import { useCarDataStore, useValidationStore } from '@/lib/api/stores';
// import { BookingHeader } from './header/BookingHeader';
// import { BookingContent } from './components/BookingContent';
// import { WarningDialog } from './components/WarningDialog';
// import { BetterPriceDialog } from './components/BetterPriceDialog';
// import { useCarPricing, useFormValidation, usePricing, useBetterPrice } from './hooks';
// import { getReservationPricing } from '@/lib/api/pricing';
// import { formatDateTime } from './utils/formatters';
// import { showApiMessage } from '@/lib/api/utils/toast-handler';

// type CarDetailsBookingProps = {
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// export const CarDetailsBooking = ({ searchParams }: CarDetailsBookingProps) => {
//   const t = useTranslations('carDetails');
//   const tValidation = useTranslations('validation.AUTH_ERRORS');
//   const { days } = useFilterStore();
//   const { car, locale } = useCarDataStore();
//   const {
//     pickupDate,
//     dropoffDate,
//     pickupTime,
//     dropoffTime,
//     fromBranch,
//     toBranch,
//   } = useValidationStore();

//   // Custom hooks for managing state and logic
//   const {
//     hasOffer,
//     formatPrice,
//   } = useCarPricing();

//   const isFormValid = useFormValidation();

//   const {
//     warningInfo,
//     isWarningDialogOpen,
//     setIsWarningDialogOpen,
//     handleWarningAccept,
//     handleWarningReject,
//     savedPricing,
//   } = usePricing();

//   const {
//     betterPriceData,
//     isBetterPriceDialogOpen,
//     isCheckingBetterPrice,
//     checkBetterPrice,
//     handleAcceptBetterPrice,
//     handleRejectBetterPrice,
//     setIsBetterPriceDialogOpen,
//   } = useBetterPrice();

//   // State to control header visibility
//   // Must be called before any conditional returns to maintain hook order
//   const [showStickyHeader, setShowStickyHeader] = useState(false);
//   const [isValidatingPricing, setIsValidatingPricing] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       // Show sticky header when scrolled down more than 100px
//       if (currentScrollY > 100) {
//         setShowStickyHeader(true);
//       } else {
//         setShowStickyHeader(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Handle book now with pricing validation
//   const handleBookNowWithValidation = async () => {
//     // Check if all required data is available
//     if (!car?.carId || !pickupDate || !dropoffDate || !fromBranch) {
//       return;
//     }

//     const finalToBranch = toBranch || fromBranch;
//     const startDateTime = formatDateTime(pickupDate, pickupTime);
//     const endDateTime = formatDateTime(dropoffDate, dropoffTime);

//     if (!startDateTime || !endDateTime) {
//       return;
//     }

//     setIsValidatingPricing(true);
//     try {
//       // Validate pricing before proceeding
//       const response = await getReservationPricing({
//         carId: car.carId,
//         reservationStartDate: startDateTime,
//         reservationEndDate: endDateTime,
//         fromBranch: fromBranch,
//         toBranch: finalToBranch,
//       });

//       // Only proceed if message is SUCCESS
//       if (response.message === 'SUCCESS') {
//         // Proceed with checkBetterPrice
//         await checkBetterPrice();
//       } else {
//         // Show error message from API
//         showApiMessage(response.message, tValidation);
//       }
//     } catch (error) {
//       console.error('Error validating pricing:', error);

//       // Extract API message from error
//       let apiMessage = '';
//       if (error instanceof Error) {
//         apiMessage = (error as any).apiMessage || error.message;
//       }

//       // Show error message in toast
//       if (apiMessage) {
//         showApiMessage(apiMessage, tValidation);
//       } else {
//         showApiMessage('CAR_AVAILABILITY_CHECK_FAILED', tValidation);
//       }
//     } finally {
//       setIsValidatingPricing(false);
//     }
//   };

//   // Guard clause if car is not loaded (after all hooks)
//   if (!car) {
//     return null;
//   }

//   // Get final pricing from saved pricing or default to 0
//   const finalTotalPrice = savedPricing?.finalTotalPrice || 0;
//   const finalPriceBeforeDiscount = savedPricing?.finalPriceBeforeDiscount || 0;

//   return (
//     <>
//       {/* Main Content */}
//       <div className="md:col-span-7  w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
//         <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
//           {/* Original Header - hidden when sticky header is shown */}
//           {!showStickyHeader && (
//             <BookingHeader
//               days={days}
//               currentPrice={finalTotalPrice > 0 ? finalTotalPrice : 0}
//               originalPrice={finalPriceBeforeDiscount > 0 ? finalPriceBeforeDiscount : 0}
//               hasOffer={hasOffer}
//               formatPrice={formatPrice}
//               onBookNow={handleBookNowWithValidation}
//               isLoading={isCheckingBetterPrice || isValidatingPricing}
//               isFormValid={isFormValid}
//             />
//           )}
//           <BookingContent
//             t={t}
//             days={days}
//             finalTotalPrice={finalTotalPrice}
//             finalPriceBeforeDiscount={finalPriceBeforeDiscount}
//             hasOffer={hasOffer}
//             formatPriceFunc={formatPrice}
//             onBookNow={handleBookNowWithValidation}
//             isLoading={isCheckingBetterPrice || isValidatingPricing}
//             isFormValid={isFormValid}
//             showStickyHeader={showStickyHeader}
//           />
//         </div>
//       </div>

//       {/* Warning Dialog */}
//       <WarningDialog
//         warningInfo={warningInfo}
//         isOpen={isWarningDialogOpen}
//         onOpenChange={setIsWarningDialogOpen}
//         onAccept={handleWarningAccept}
//         onReject={handleWarningReject}
//         t={t}
//       />

//       {/* Better Price Dialog */}
//       {/* <BetterPriceDialog
//         betterPriceData={betterPriceData}
//         isOpen={isBetterPriceDialogOpen}
//         onOpenChange={setIsBetterPriceDialogOpen}
//         onAccept={handleAcceptBetterPrice}
//         onReject={handleRejectBetterPrice}
//         isLoading={isCheckingBetterPrice}
//         t={t}
//       /> */}
//     </>
//   );
// };

const CarDetailsBooking = () => {
  return <div>CarDetailsBooking</div>;
};

export default CarDetailsBooking;
