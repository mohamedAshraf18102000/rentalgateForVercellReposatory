// /**
//  * BookingContent Component
//  * Displays all booking form sections (Car Info, Specifications, Kilometers, Pickup Location, Pickup Time)
//  */

// import { useStickyHeader } from '@/hooks/useStickyHeader';
// import { useCarDataStore, useValidationStore } from '@/lib/api/stores';
// import { useTranslations } from 'next-intl';
// import { useMemo } from 'react';
// import { BookingHeader } from '../header/BookingHeader';
// import { CarInfoSection, KilometersSection, PickupLocationSection, SpecificationsSection } from '../sections';
// import { formatPrice } from '../utils/formatters';

// type BookingContentProps = {
//   t: ReturnType<typeof useTranslations<'carDetails'>>;
//   days: number;
//   finalTotalPrice: number;
//   finalPriceBeforeDiscount: number;
//   hasOffer: boolean;
//   formatPriceFunc: (price: number) => string;
//   onBookNow?: () => void;
//   isLoading?: boolean;
//   isFormValid?: boolean;
//   showStickyHeader?: boolean;
// };

// export const BookingContent = ({
//   t,
//   days,
//   finalTotalPrice,
//   finalPriceBeforeDiscount,
//   hasOffer,
//   formatPriceFunc,
//   onBookNow,
//   isLoading = false,
//   isFormValid = false,
//   showStickyHeader: showStickyHeaderProp,
// }: BookingContentProps) => {
//   const { car, locale } = useCarDataStore();
//   const {
//     pickupLocation,
//     fromBranch,
//     setPickupLocation,
//     pickupDate,
//     dropoffDate,
//     pickupTime,
//     dropoffTime,
//     setPickupDate,
//     setDropoffDate,
//     setPickupTime,
//     setDropoffTime,
//   } = useValidationStore();

//   // Use sticky header hook - use prop if provided, otherwise use hook's internal state
//   const hookResult = useStickyHeader();
//   const showStickyHeader = showStickyHeaderProp !== undefined ? showStickyHeaderProp : hookResult.showStickyHeader;
//   const { containerRef, stickyTriggerRef, headerStyle } = hookResult;

//   // Get category text from car data based on locale
//   const categoryText = useMemo(() => {
//     if (!car) return '';
//     const typeArabic = car.typeArabicName?.trim() || '';
//     const typeEnglish = car.typeEnglishName?.trim() || '';
//     return locale === 'ar'
//       ? (typeArabic || 'نوع غير معروف')
//       : (typeEnglish || 'Unknown type');
//   }, [car, locale]);

//   if (!car) return null;

//   // Calculate pricing for CarInfoSection (using car data directly)
//   const hasCarOffer = car.offer && car.offerDailyPrice > 0 && car.offerDailyPrice < car.dailyPrice;
//   const currentPrice = hasCarOffer ? car.offerDailyPrice : car.dailyPrice;
//   const originalPrice = hasCarOffer ? car.dailyPrice : car.dailyPrice;
//   const discountPercentage = hasCarOffer && originalPrice > 0
//     ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
//     : 0;

//   return (
//     <div ref={containerRef} className="px-2 py-4 md:py-[18px] relative">
//       <div className="flex flex-col gap-4 md:gap-6 px-2 md:px-[18px]">
//         <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
//           <CarInfoSection
//             carName={car.carName}
//             categoryText={categoryText}
//             numberOfPassengers={car.numberOfPassengers}
//             discountPercentage={discountPercentage}
//             currentPrice={currentPrice > 0 ? currentPrice : 0}
//             originalPrice={originalPrice > 0 ? originalPrice : 0}
//             t={t}
//             modelArabicName={car.modelArabicName}
//             modelEnglishName={car.modelEnglishName}
//             brandArabicName={car.brandArabicName}
//             brandName={car.brandName}
//             year={car.carYear}
//             locale={locale}
//           />

//           <SpecificationsSection
//             numberOfDoors={car.numberOfDoors}
//             numberOfPassengers={car.numberOfPassengers}
//             detailsArabic={car.detailsArabic}
//             detailsEnglish={car.detailsEnglish}
//             locale={locale}
//             t={t}
//           />

//           <KilometersSection
//             maxKm={car.maxKm}
//             kmPrice={car.kmPrice}
//             locale={locale}
//             formatPrice={formatPrice}
//             t={t}
//           />

//           <PickupLocationSection
//             pickupLocation={pickupLocation}
//             setPickupLocation={setPickupLocation}
//             locale={locale}
//             t={t}
//             carId={car.carId}
//           />

//           <PickupTimeSection
//             pickupDate={pickupDate}
//             dropoffDate={dropoffDate}
//             pickupTime={pickupTime}
//             dropoffTime={dropoffTime}
//             locale={locale}
//             setPickupDate={setPickupDate}
//             setDropoffDate={setDropoffDate}
//             setPickupTime={setPickupTime}
//             setDropoffTime={setDropoffTime}
//             pickupLocation={pickupLocation}
//             t={t}
//             disabled={pickupLocation === 'branch' && !fromBranch}
//           />
//         </div>

//         {/* Invisible trigger div to detect when to switch to sticky */}
//       </div>
//       <div ref={stickyTriggerRef} className="h-1 w-full" aria-hidden="true" />

//       {/* Header at Bottom - shows when original header is hidden */}
//       {showStickyHeader && (
//         <div
//           className="z-50 bg-white  border-t-2 border-[#ECEEF2] mt-4"
//           style={headerStyle}
//         >
//           <BookingHeader
//             days={days}
//             currentPrice={finalTotalPrice > 0 ? finalTotalPrice : 0}
//             originalPrice={finalPriceBeforeDiscount > 0 ? finalPriceBeforeDiscount : 0}
//             hasOffer={hasOffer}
//             formatPrice={formatPriceFunc}
//             onBookNow={onBookNow}
//             isLoading={isLoading}
//             isFormValid={isFormValid}
//           />
//         </div>
//       )}
//     </div>
//   );
// };



const BookingContent = () => {
  return (
    <div>BookingContent</div>
  )
}

export default BookingContent