'use client';

/**
 * Checkout Page
 * Displays reservation details after successful booking
 * Uses the same layout and design as ExtendCheckoutPageClient
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/app/(components)/ui/button';
import { URL } from '@/constants/api';
import { getAuthToken } from '@/util/auth';
import { toast } from 'sonner';
import { getReservationDetails } from '@/lib/api/reservation-details';
import type { ReservationData } from './types';
import { CarInfoSection } from '@/app/[locale]/(old-reservations)/cars/[id]/car-details/sections/CarInfoSection';
import { normalizeImageUrl } from '@/util/image';
import { InvoiceDetails } from '@/app/[locale]/(old-reservations)/booking/components/invoice';
import { SuccessIcon, PriceIcon } from '@/constants/icons';
import type { ReservationDetails } from '@/lib/api/reservation-details';
import { useStickyHeader } from '@/hooks/useStickyHeader';
import { clearAllCookies } from '@/util/cookies';
import { useClientStore } from '@/lib/api/stores';

interface CheckoutPageClientProps {
  locale: string;
}

export default function CheckoutPageClient({ locale }: CheckoutPageClientProps) {
  const router = useRouter();
  const t = useTranslations('carDetails');
  const { fetchClientData } = useClientStore();
  const paymentProcessed = useRef(false);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReservationDetails, setIsLoadingReservationDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string>('');

  const isArabic = locale === 'ar';

  // Use sticky header hook
  const { showStickyHeader, containerRef, stickyTriggerRef, headerStyle } = useStickyHeader();

  // Complete payment API call
  const completePayment = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found');
        return;
      }

      // Get data from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId') || reservationData?.reservationId;
      const finalAmount = urlParams.get('finalAmount') || reservationData?.total?.toString();
      const pointsUsed = urlParams.get('pointsUsed') || '0';

      // Get payment data from URL, localStorage, or sessionStorage
      let tranRef = urlParams.get('tranRef') ||
        urlParams.get('tran_ref') ||
        urlParams.get('transaction_ref');

      // If not in URL, try to get from localStorage (saved before redirect to PayTabs)
      if (!tranRef && typeof window !== 'undefined') {
        try {
          const paymentDataStr = localStorage.getItem('paymentData');
          if (paymentDataStr) {
            const paymentData = JSON.parse(paymentDataStr);
            tranRef = paymentData.tran_ref || paymentData.tranRef || null;
          }
        } catch (error) {
          console.error('Error reading paymentData from localStorage:', error);
        }

        // Also check sessionStorage
        if (!tranRef) {
          const paymentRef = sessionStorage.getItem('paymentRef');
          if (paymentRef) {
            tranRef = paymentRef;
          }
        }
      }

      const responseCode = urlParams.get('responseCode') ||
        urlParams.get('respCode') ||
        'unknown';

      const responseMessage = urlParams.get('responseMessage') ||
        urlParams.get('respMessage') ||
        'No response';

      const responseStatus = urlParams.get('responseStatus') ||
        urlParams.get('respStatus') ||
        'A';

      const transactionTime = urlParams.get('transactionTime') ||
        new Date().toISOString();

      if (!reservationId) {
        console.warn('No reservation ID found');
        return;
      }

      // Query PayTabs first to get accurate payment data
      let paymentResultData = {
        responseCode: responseCode,
        responseMessage: responseMessage,
        responseStatus: responseStatus,
        transactionTime: transactionTime
      };

      if (tranRef) {
        try {
          const queryResponse = await fetch('/api/payment/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tran_ref: tranRef,
            }),
          });

          if (queryResponse.ok) {
            const queryData = await queryResponse.json();
            console.log('📥 PayTabs Query Response:', queryData);

            const paymentResult = queryData.payment_result || {};
            paymentResultData = {
              responseCode: paymentResult.response_code || responseCode,
              responseMessage: paymentResult.response_message || responseMessage,
              responseStatus: paymentResult.response_status || responseStatus,
              transactionTime: paymentResult.transaction_time || transactionTime
            };

            // Update payment status based on query
            if (paymentResultData.responseStatus === 'A') {
              setPaymentStatus('success');
              setPaymentMessage(isArabic ? 'تم الدفع بنجاح' : 'Payment successful');
            } else {
              setPaymentStatus('failed');
              setPaymentMessage(
                paymentResultData.responseMessage ||
                (isArabic ? 'فشل الدفع' : 'Payment failed')
              );
            }
          }
        } catch (error) {
          console.error('Error querying payment:', error);
        }
      }

      // Use regular reservation complete-payment API
      const apiUrl = URL('/reservations/complete-payment');

      // Ensure transactionReference is a string or null (not undefined)
      const transactionReference = tranRef || null;

      const paymentPayload = {
        reservationId: parseInt(String(reservationId)),
        paidAmount: parseFloat(finalAmount || '0'),
        paid: true,
        pointsUsed: parseInt(pointsUsed || '0'),
        transactionReference: transactionReference,
        paymentResult: paymentResultData
      };

      console.log('📤 Calling complete-payment API:', paymentPayload);
      console.log('🔑 Transaction Reference:', transactionReference);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentPayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Payment completed successfully:', result);

        // Refresh user data (points)
        await fetchClientData();

        if (paymentResultData.responseStatus === 'A') {
          toast.success(isArabic ? 'تم تأكيد الدفع بنجاح!' : 'Payment confirmed successfully!');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Complete payment failed:', errorText);
        console.error('Response status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error completing payment:', error);
    } finally {
      // Call reservations/show API after complete-payment (success or failure)
      const token = getAuthToken();
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId') || reservationData?.reservationId;
      
      if (reservationId && token) {
        setIsLoadingReservationDetails(true);
        try {
          const showResponse = await getReservationDetails(parseInt(String(reservationId)), token);
          console.log('✅ Reservation details fetched:', showResponse);
          if (showResponse.message === 'SUCCESS' && showResponse.data) {
            setReservationDetails(showResponse.data);
          }
        } catch (showError) {
          console.error('❌ Error fetching reservation details:', showError);
        } finally {
          setIsLoadingReservationDetails(false);
        }
      }
    }

  };

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        let parsedData = null;
        // Get reservation data from sessionStorage (only regular reservations)
        const data = sessionStorage.getItem('reservationData');

        if (data) {
          try {
            parsedData = JSON.parse(data);
            console.log('parsedData', parsedData);
            setReservationData(parsedData);
          } catch (error) {
            console.error('Error parsing reservation data:', error);
          }
        }

        // Check if reservationId exists in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reservationIdInUrl = urlParams.get('reservationId');
        const reservationId = reservationIdInUrl || parsedData?.reservationId;

        // If reservationId exists in URL, call complete-payment
        if (reservationIdInUrl) {
          // Complete payment only once (for card payments with reservationId in URL)
          if (!paymentProcessed.current) {
            paymentProcessed.current = true;
            await completePayment();
          }
        } else {
          // If no reservationId in URL (cash payment), fetch reservation details directly
          if (reservationId) {
            const token = getAuthToken();
            if (token) {
              setIsLoadingReservationDetails(true);
              try {
                const showResponse = await getReservationDetails(parseInt(String(reservationId)), token);
                console.log('✅ Reservation details fetched (cash payment):', showResponse);
                if (showResponse.message === 'SUCCESS' && showResponse.data) {
                  setReservationDetails(showResponse.data);
                }
              } catch (showError) {
                console.error('❌ Error fetching reservation details:', showError);
              } finally {
                setIsLoadingReservationDetails(false);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing checkout:', error);
      }

      setIsLoading(false);
    };

    initializeCheckout();
  }, [isArabic]);

  // Clear all cookies and state management when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function: clear all cookies and state management when component unmounts
      // clearAllCookies() will also reset all Zustand stores
      clearAllCookies();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isArabic ? 'لا توجد بيانات حجز' : 'No reservation data found'}
          </h2>
          <Button onClick={() => router.push('/cars')}>
            {isArabic ? 'تصفح السيارات' : 'Browse Cars'}
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return price.toFixed(2);
  };

  // Get category text
  const categoryText = reservationData
    ? (isArabic ? reservationData.typeArabicName : reservationData.typeEnglishName)
    : '';

  // Get car image
  const displayImage = reservationData.defaultImage
    ? normalizeImageUrl(reservationData.defaultImage)
    : '/shared/CarNotFound.png';

  // Calculate discount percentage
  const hasOffer = reservationData.totalDiscount > 0;
  const currentPrice = reservationData.total;
  const originalPrice = reservationData.subTotal + reservationData.totalDiscount;
  const discountPercentage = hasOffer && originalPrice > 0
    ? Math.round((reservationData.totalDiscount / originalPrice) * 100)
    : 0;

  // Calculate pricing for InvoiceDetails from reservationDetails if available
  const pricingDataForInvoice = reservationDetails ? {
    datingType: reservationDetails.reservationType || 1,
    numOfDays: reservationDetails.days || 0,
    extraHoursCostWithVat: reservationDetails.extraHoursCostWithVat || 0,
    originalDailyPrice: reservationDetails.basePrice || 0,
    originalDailyPriceWithoutVat: reservationDetails.basePrice || 0,
    dailyPriceAfterDiscount: reservationDetails.basePrice || 0,
    dailyPriceAfterDiscountWithoutVat: reservationDetails.basePrice || 0,
    basePrice: reservationDetails.basePrice || 0,
    insurance: reservationDetails.insuranceValue || 0,
    anotherBranchPrice: reservationDetails.anotherBranchCost || 0,
    pickupFee: reservationDetails.pickupCost || 0,
    deliveryFee: reservationDetails.deliveryCost || 0,
    totalDeliveryFee: (reservationDetails.pickupCost || 0) + (reservationDetails.deliveryCost || 0),
    membershipDiscount: reservationDetails.memberShipDiscount || 0,
    membershipLuxuryCarDiscount: 0,
    carOfferDiscount: 0,
    finalPriceWithExtraHoursCost: reservationDetails.subtotal || 0,
    finalPriceBeforeDiscount: reservationDetails.subtotal || 0,
    finalTotalPrice: reservationDetails.total || 0,
    totalPoints: 0, // Will be calculated from pointsDiscount
    totalPromoValue: reservationDetails.promoDiscount || 0,
    tax: reservationDetails.tax || 0,
    extraServicesCost: reservationDetails.servicesCost || 0,
    extraKmCost: reservationDetails.extraKmCost || 0,
    extraNewDayHours: 0,
    refCodeValid: !!reservationDetails.promoDiscount,
    unfreeHours: 0,
  } : null;

  return (
    <div className='custom-bg'>
      <div className="container-custom py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Car Image Section - Same layout as ExtendCheckoutPageClient */}
          {reservationData && (
            <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
              <div className="relative w-full h-full">
                <div className="relative bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full h-[300px] md:w-full md:h-[400px] border-3 border-white">
                  <Image
                    src={displayImage}
                    alt={reservationData.carName}
                    fill
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reservation Details Section - Same layout as ExtendCheckoutPageClient */}
          <div ref={containerRef} className="md:col-span-7 w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
            {/* Success/Failed Message Banner */}
            {paymentStatus === 'success' && (
              <div className="bg-white border border-[#ECEEF2] rounded-lg p-4 mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-4">
                  <SuccessIcon width={40} height={40} className="shrink-0" />
                  <div>
                    <h1 className="text-lg font-bold text-[#177E64]">
                      {isArabic ? 'تم انشاء الحجز بنجاح' : 'Booking created successfully'}
                    </h1>
                    <div className="flex gap-2 justify-between">
                      {reservationData.reservationId && (
                        <p className="text-gray-700 text-sm mt-1">
                          {isArabic ? `رقم الحجز: ${reservationData.reservationId}` : `Booking number: ${reservationData.reservationId}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-red-900">
                      {isArabic ? 'فشل الدفع' : 'Payment Failed'}
                    </h1>
                    <p className="text-red-700 text-sm md:text-base">
                      {isArabic ? `رقم الحجز: ${reservationData.reservationId}` : `Reservation ID: ${reservationData.reservationId}`}
                    </p>
                    <p className="text-red-600 text-sm mt-1">{paymentMessage}</p>
                    <p className="text-red-500 text-xs mt-2">
                      {isArabic ? 'يمكنك الدفع نقداً عند الاستلام' : 'You can pay cash on pickup'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!paymentStatus && (
              <div className="bg-white border border-[#ECEEF2] rounded-lg p-4 md:p-6 mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-4">
                  <SuccessIcon width={40} height={40} className="shrink-0" />
                  <div>
                    <h1 className="text-lg font-bold text-[#177E64]">
                      {isArabic ? 'تم انشاء الحجز بنجاح' : 'Booking created successfully'}
                    </h1>
                    {reservationData.reservationId && (
                      <p className="text-gray-700 text-sm mt-1">
                        {isArabic ? `رقم الحجز: ${reservationData.reservationId}` : `Booking number: ${reservationData.reservationId}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Original Header - hidden when sticky header is shown */}
              {!showStickyHeader && (
                <div className="sticky top-0 z-20 bg-white">
                  <CheckoutHeader
                    reservationId={reservationData.reservationId}
                    total={currentPrice > 0 ? currentPrice : 0}
                    onViewBookings={() => router.push('/profile/my-bookings')}
                    onBookAnother={() => router.push('/cars')}
                    locale={locale}
                    formatPrice={formatPrice}
                  />
                </div>
              )}

              <div className="px-2 py-4 md:py-[18px] relative">
                <div className="flex flex-col gap-4 md:gap-6 px-2 md:px-[18px]">
                  <div dir={isArabic ? 'rtl' : 'ltr'}>
                    {/* Car Info Section */}
                    {reservationData && (
                      <CarInfoSection
                        carName={reservationData.carName}
                        categoryText={categoryText}
                        numberOfPassengers={5} // Default value, can be updated if available
                        discountPercentage={discountPercentage}
                        currentPrice={currentPrice > 0 ? currentPrice : 0}
                        originalPrice={originalPrice > 0 ? originalPrice : 0}
                        t={t}
                        modelArabicName={reservationData.modelArabicName}
                        modelEnglishName={reservationData.modelEnglishName}
                        brandArabicName={reservationData.brandArabicName}
                        brandName={reservationData.brandName}
                        year={reservationData.year}
                        locale={locale}
                      />
                    )}

                    {/* Reservation Info */}
                    {reservationData && (
                      <div className="bg-[#ECEEF2] p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          {isArabic ? 'معلومات الحجز' : 'Reservation Information'}
                        </h3>
                        <div className="space-y-2 text-sm">
                          {reservationData.startDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'تاريخ البداية:' : 'Start Date:'}
                              </span>
                              <span className="font-medium">
                                {new Date(reservationData.startDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                          {reservationData.endDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'تاريخ النهاية:' : 'End Date:'}
                              </span>
                              <span className="font-medium">
                                {new Date(reservationData.endDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                          {(reservationData.fromBranchName || reservationData.fromBranchArName) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'فرع الاستلام:' : 'Pickup Branch:'}
                              </span>
                              <span className="font-medium">
                                {isArabic ? (reservationData.fromBranchArName || '') : (reservationData.fromBranchName || '')}
                              </span>
                            </div>
                          )}
                          {(reservationData.toBranchName || reservationData.toBranchArName) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'فرع التسليم:' : 'Return Branch:'}
                              </span>
                              <span className="font-medium">
                                {isArabic ? (reservationData.toBranchArName || '') : (reservationData.toBranchName || '')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Invoice Details */}
                    {isLoadingReservationDetails ? (
                      <div className="bg-white rounded-lg p-6 space-y-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ) : (
                      pricingDataForInvoice && (
                        <InvoiceDetails
                          pricingData={pricingDataForInvoice}
                          locale={locale}
                          formatPrice={formatPrice}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div ref={stickyTriggerRef} className="h-1 w-full" aria-hidden="true" />

              {/* Sticky Header */}
              {showStickyHeader && (
                <div
                  className="z-50 bg-white shadow-lg border-t-2 border-[#ECEEF2] mt-4"
                  style={headerStyle}
                >
                  <CheckoutHeader
                    reservationId={reservationData.reservationId}
                    total={currentPrice > 0 ? currentPrice : 0}
                    onViewBookings={() => router.push('/profile/my-bookings')}
                    onBookAnother={() => router.push('/cars')}
                    locale={locale}
                    formatPrice={formatPrice}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout Header Component
interface CheckoutHeaderProps {
  reservationId: number;
  total: number;
  onViewBookings: () => void;
  onBookAnother: () => void;
  locale: string;
  formatPrice: (price: number) => string;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  reservationId,
  total,
  onViewBookings,
  onBookAnother,
  locale,
  formatPrice,
}) => {
  const isArabic = locale === 'ar';

  return (
    <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-white py-3 px-4 sm:py-[15px] sm:px-[18px] border-b-2 border-[#ECEEF2]">
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <p className="flex gap-2 items-center flex-wrap">
          <span className="text-[#1A1A1A] font-normal text-[12px] sm:text-[14px]">
            {isArabic ? 'رقم الحجز:' : 'Reservation ID:'}
          </span>
          <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
            #{reservationId}
          </span>
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1">
            {formatPrice(total)}
            <PriceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onViewBookings}
          className=" rounded-lg  "
          size="lg"
        >
          {isArabic ? 'عرض حجوزاتي' : 'View My Bookings'}
        </Button>
        <Button
          className="bg-primary hover:bg-primary-hover text-white rounded-lg px-3"
          size="lg"
          onClick={onBookAnother}
        >
          {isArabic ? 'حجز سيارة جديدة' : 'Book Another Car'}
        </Button>
      </div>
    </div>
  );
};
