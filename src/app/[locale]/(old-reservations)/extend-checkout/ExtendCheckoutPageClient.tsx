'use client';

/**
 * Extend Checkout Page Client
 * Handles checkout for reservation extensions only
 * Uses the same layout and design as BookingContent
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/app/(components)/ui/button';
import { getAuthToken } from '@/util/auth';
import { toast } from 'sonner';
import { useClientStore } from '@/lib/api/stores';
import { getReservationDetails } from '@/lib/api/reservation-details';
import { completeExtensionPayment } from '@/lib/api/reservation-extension';
import type { ReservationDetails } from '@/lib/api/reservation-details';
import { CarInfoSection } from '@/app/[locale]/(reservations)/cars/[id]/car-details/sections/CarInfoSection';
import { normalizeImageUrl } from '@/util/image';
import { InvoiceDetails } from '@/app/[locale]/(reservations)/booking/components/invoice';
import { SuccessIcon, PriceIcon } from '@/constants/icons';
import { useStickyHeader } from '@/hooks/useStickyHeader';
import { clearAllCookies } from '@/util/cookies';

interface ExtendCheckoutPageClientProps {
  locale: string;
}

export default function ExtendCheckoutPageClient({ locale }: ExtendCheckoutPageClientProps) {
  const router = useRouter();
  const t = useTranslations('carDetails');
  const { fetchClientData } = useClientStore();
  const paymentProcessed = useRef(false);
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [extensionData, setExtensionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReservationDetails, setIsLoadingReservationDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string>('');

  const isArabic = locale === 'ar';

  // Use sticky header hook
  const { showStickyHeader, containerRef, stickyTriggerRef, headerStyle } = useStickyHeader();

  // Complete extension payment API call
  const completePayment = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found');
        return;
      }

      // Get extension data from sessionStorage (read directly, not from state)
      let extensionDataFromStorage: any = null;
      if (typeof window !== 'undefined') {
        const extensionDataStr = sessionStorage.getItem('extensionData');
        if (extensionDataStr) {
          try {
            extensionDataFromStorage = JSON.parse(extensionDataStr);
            console.log('📦 Extension data from sessionStorage:', extensionDataFromStorage);
          } catch (error) {
            console.error('Error parsing extension data from storage:', error);
          }
        }
      }

      // Get data from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId');
      const extensionId = urlParams.get('extensionId');
      const finalAmount = urlParams.get('finalAmount');
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

      // Use extensionId from URL or extensionDataFromStorage
      // Priority: URL extensionId > extensionDataFromStorage.reservationExtensionId > reservationId (fallback)
      let reservationExtensionId: number | null = null;

      if (extensionId) {
        reservationExtensionId = parseInt(extensionId);
      } else if (extensionDataFromStorage?.reservationExtensionId) {
        reservationExtensionId = extensionDataFromStorage.reservationExtensionId;
      } else if (reservationId) {
        // Fallback: use reservationId if extensionId not found (should not happen)
        console.warn('⚠️ Using reservationId as fallback - extensionId not found');
        reservationExtensionId = parseInt(String(reservationId));
      }

      console.log('🔍 Extension ID Resolution:', {
        extensionIdFromURL: extensionId,
        extensionDataFromStorage: extensionDataFromStorage,
        reservationExtensionIdFromStorage: extensionDataFromStorage?.reservationExtensionId,
        reservationIdFromURL: reservationId,
        finalReservationExtensionId: reservationExtensionId
      });

      if (!reservationExtensionId || isNaN(reservationExtensionId)) {
        console.error('❌ No valid extension ID found', {
          extensionId,
          extensionDataFromStorage,
          reservationId
        });
        toast.error(isArabic ? 'خطأ: لم يتم العثور على رقم التمديد' : 'Error: Extension ID not found');
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

      // Call extension complete-payment API
      // IMPORTANT: reservationId in payload should be reservationExtensionId
      const paymentPayload = {
        reservationId: reservationExtensionId, // This is actually reservationExtensionId from API response
        paidAmount: parseFloat(finalAmount || extensionDataFromStorage?.finalAmount || '0'),
        paid: true,
        pointsUsed: parseInt(pointsUsed || '0'),
        transactionReference: tranRef || '',
        paymentResult: paymentResultData
      };

      console.log('📤 Calling extension complete-payment API:', paymentPayload);
      console.log('🆔 Using reservationExtensionId as reservationId:', reservationExtensionId);

      const response = await completeExtensionPayment(paymentPayload);

      if (response.message === 'SUCCESS') {
        console.log('✅ Extension payment completed successfully:', response);

        // Refresh user data (points)
        await fetchClientData();

        if (paymentResultData.responseStatus === 'A') {
          toast.success(isArabic ? 'تم تأكيد الدفع بنجاح!' : 'Payment confirmed successfully!');
        }
      } else {
        console.error('❌ Complete payment failed:', response);
      }
    } catch (error) {
      console.error('❌ Error completing payment:', error);
      if (error instanceof Error) {
        const apiMessage = (error as any).apiMessage;
        if (apiMessage) {
          toast.error(isArabic ? 'فشل تأكيد الدفع' : 'Failed to confirm payment');
        }
      }
    } finally {
      // Call reservations/show API after complete-payment (success or failure)
      const token = getAuthToken();
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get('reservationId');
      
      if (reservationId && token) {
        setIsLoadingReservationDetails(true);
        try {
          const showResponse = await getReservationDetails(parseInt(String(reservationId)), token);
          console.log('✅ Reservation details fetched:', showResponse);
          if (showResponse.message === 'SUCCESS' && showResponse.data) {
            setReservation(showResponse.data);
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
        let parsedExtensionData = null;
        // Get extension data from sessionStorage
        const extensionDataStr = sessionStorage.getItem('extensionData');
        if (extensionDataStr) {
          try {
            parsedExtensionData = JSON.parse(extensionDataStr);
            setExtensionData(parsedExtensionData);
          } catch (error) {
            console.error('Error parsing extension data:', error);
          }
        }

        // Check if reservationId exists in URL
        const urlParams = new URLSearchParams(window.location.search);
        const reservationIdInUrl = urlParams.get('reservationId');
        const reservationId = reservationIdInUrl || parsedExtensionData?.reservationId;

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
                const reservationResponse = await getReservationDetails(parseInt(String(reservationId)), token);
                console.log('✅ Reservation details fetched (cash payment):', reservationResponse);
                if (reservationResponse.message === 'SUCCESS' && reservationResponse.data) {
                  setReservation(reservationResponse.data);
                }
              } catch (error) {
                console.error('❌ Error fetching reservation details:', error);
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

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return price.toFixed(2);
  };

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

  if (!extensionData && !reservation) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isArabic ? 'لا توجد بيانات تمديد' : 'No extension data found'}
          </h2>
          <Button onClick={() => router.push('/profile/my-bookings')}>
            {isArabic ? 'عرض حجوزاتي' : 'View My Bookings'}
          </Button>
        </div>
      </div>
    );
  }

  const reservationId = extensionData?.reservationId || reservation?.reservationId;
  const extensionId = extensionData?.reservationExtensionId;
  const total = extensionData?.finalAmount || extensionData?.amount || 0;
  const subTotal = extensionData?.amount || extensionData?.basePrice || 0;
  const discount = extensionData?.discount || 0;
  const paidAmount = extensionData?.paidAmount || 0;

  // Calculate days for extension
  const extensionDays = extensionData?.days || 0;

  // Get category text
  const categoryText = reservation
    ? (isArabic ? reservation.typeArabicName : reservation.typeEnglishName)
    : '';

  // Calculate pricing for InvoiceDetails
  const pricingDataForInvoice = extensionData ? {
    datingType: 1,
    numOfDays: extensionData.days || 0,
    extraHoursCostWithVat: extensionData.extraHoursValue || 0,
    originalDailyPrice: extensionData.basePrice || 0,
    originalDailyPriceWithoutVat: extensionData.basePrice || 0,
    dailyPriceAfterDiscount: extensionData.basePrice || 0,
    dailyPriceAfterDiscountWithoutVat: extensionData.basePrice || 0,
    basePrice: extensionData.basePrice || 0,
    insurance: extensionData.insuranceValue || 0,
    anotherBranchPrice: 0,
    pickupFee: 0,
    deliveryFee: 0,
    totalDeliveryFee: 0,
    membershipDiscount: 0,
    membershipLuxuryCarDiscount: 0,
    carOfferDiscount: 0,
    finalPriceWithExtraHoursCost: extensionData.amount || 0,
    finalPriceBeforeDiscount: extensionData.amount || 0,
    finalTotalPrice: extensionData.finalAmount || 0,
    totalPoints: extensionData.points || 0,
    totalPromoValue: extensionData.promoValue || 0,
    tax: extensionData.tax || 0,
    extraServicesCost: extensionData.servicesCost || 0,
    extraKmCost: 0,
    extraNewDayHours: 0,
    refCodeValid: !!extensionData.promoCode,
    unfreeHours: 0,
  } : null;

  // Get car image
  const displayImage = reservation?.carImage
    ? normalizeImageUrl(reservation.carImage)
    : '/shared/CarNotFound.png';

  // Calculate discount percentage
  const hasOffer = discount > 0;
  const currentPrice = total;
  const originalPrice = subTotal + discount;
  const discountPercentage = hasOffer && originalPrice > 0
    ? Math.round((discount / originalPrice) * 100)
    : 0;

  return (
    <div className='custom-bg'>
      <div className="container-custom py-4 md:py-8">


        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Car Image Section - Same layout as BookingContent */}
          {reservation && (
            <div className="md:col-span-5 xl:col-span-4 md:sticky md:top-[100px] md:self-start md:z-10 order-1 md:order-3">
              <div className="relative w-full h-full">
                <div className="relative bg-[#ECEEF2] rounded-[20px] overflow-hidden mx-auto w-full h-[300px] md:w-full md:h-[400px] border-3 border-white">
                  <Image
                    src={displayImage}
                    alt={reservation.carName}
                    fill
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* Extension Details Section - Same layout as BookingContent */}
          <div ref={containerRef} className="md:col-span-7 w-full md:sticky md:top-[100px] md:self-start md:z-10 order-2 md:order-2 xl:col-span-6 xl:col-start-2">
            {/* Success/Failed Message Banner */}
            {paymentStatus === 'success' && (
              <div className="bg-white border border-[#ECEEF2] rounded-lg p-4  mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-4">
                  <SuccessIcon width={40} height={40} className="shrink-0" />
                  <div>
                    <h1 className="text-lg font-bold text-[#177E64]">
                      {isArabic ? 'تم انشاء الحجز بنجاح' : 'Booking created successfully'}
                    </h1>
                    <div className="flex gap-2 justify-between ">
                      {reservationId && (
                        <p className="text-gray-700 text-sm mt-1">
                          {isArabic ? `رقم الحجز: ${reservationId}` : `Booking number: ${reservationId}`}
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
                    {extensionId && (
                      <p className="text-red-700 text-sm md:text-base">
                        {isArabic ? `رقم التمديد: ${extensionId}` : `Extension ID: ${extensionId}`}
                      </p>
                    )}
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
                    <h1 className="text-lg font-bold text-green-600">
                      {isArabic ? 'تم انشاء الحجز بنجاح' : 'Booking created successfully'}
                    </h1>
                    {reservationId && (
                      <p className="text-gray-700 text-sm mt-1">
                        {isArabic ? `رقم الحجز: ${reservationId}` : `Booking number: ${reservationId}`}
                      </p>
                    )}
                    {extensionId && (
                      <p className="text-gray-700 text-sm mt-1">
                        {isArabic ? `رقم التمديد: ${extensionId}` : `Extension ID: ${extensionId}`}
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
                  <ExtendCheckoutHeader
                    extensionId={extensionId}
                    reservationId={reservationId}
                    total={currentPrice > 0 ? currentPrice : 0}
                    extensionDays={extensionDays}
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

                    {reservation && (
                      <CarInfoSection
                        carName={reservation.carName}
                        categoryText={categoryText}
                        numberOfPassengers={reservation.numberOfPassengers || 5}
                        discountPercentage={discountPercentage}
                        currentPrice={currentPrice > 0 ? currentPrice : 0}      
                        originalPrice={originalPrice}
                        t={t}
                      />
                    )}
                    {extensionId && (
                      <div className="bg-[#ECEEF2] py-1.5 px-3 rounded-lg mt-4 mb-4 w-fit">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-600 text-sm font-medium">
                            {isArabic ? 'رقم التمديد:' : 'Extension ID:'}
                          </span>
                          <span className="text-gray-900 text-sm font-bold">
                            #{extensionId} 
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Extension Info */}
                    {extensionData && (
                      <div className="bg-[#ECEEF2] p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">
                          {isArabic ? 'معلومات التمديد' : 'Extension Information'}
                        </h3>
                        <div className="space-y-2 text-sm">
                          {extensionData.endDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'تاريخ الانتهاء الجديد:' : 'New End Date:'}
                              </span>
                              <span className="font-medium">
                                {new Date(extensionData.endDate).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                          {extensionDays > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {isArabic ? 'عدد أيام التمديد:' : 'Extension Days:'}
                              </span>
                              <span className="font-bold text-primary">
                                {extensionDays} {isArabic ? 'يوم' : 'days'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Invoice Details */}
                    {pricingDataForInvoice && (
                      <InvoiceDetails
                        pricingData={pricingDataForInvoice}
                        locale={locale}
                        formatPrice={formatPrice}
                      />
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
                  <ExtendCheckoutHeader
                    extensionId={extensionId}
                    reservationId={reservationId}
                    total={currentPrice > 0 ? currentPrice : 0}
                    extensionDays={extensionDays}
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

// Extend Checkout Header Component
interface ExtendCheckoutHeaderProps {
  extensionId?: number;
  reservationId?: number;
  total: number;
  extensionDays: number;
  onViewBookings: () => void;
  onBookAnother: () => void;
  locale: string;
  formatPrice: (price: number) => string;
}

const ExtendCheckoutHeader: React.FC<ExtendCheckoutHeaderProps> = ({
  extensionId,
  reservationId,
  total,
  extensionDays,
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
          {extensionId && (
            <>
              <span className="text-[#1A1A1A] font-normal text-[12px] sm:text-[14px]">
                {isArabic ? 'رقم التمديد:' : 'Extension ID:'}
              </span>
              <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
                #{extensionId}
              </span>
            </>
          )}
          {extensionDays > 0 && (
            <>
              <span className="text-[#1A1A1A] font-normal text-[12px] sm:text-[14px]">
                {isArabic ? 'عدد الأيام:' : 'Days:'}
              </span>
              <span className="font-semibold text-gray-900 text-[12px] sm:text-[14px] bg-[#ECEEF2] px-2 py-1 rounded-md">
                {extensionDays} {isArabic ? 'يوم' : 'days'}
              </span>
            </>
          )}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1">
            {formatPrice(total > 0 ? total : 0)}
            <PriceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onViewBookings}
          className="  rounded-lg  "
          size="lg"
        >
          {isArabic ? 'عرض حجوزاتي' : 'View My Bookings'}
        </Button>
        <Button
          className="bg-primary hover:bg-primary-hover text-white px-4  rounded-lg  "
          size="lg"
          onClick={onBookAnother}
        >
          {isArabic ? 'حجز سيارة جديدة' : 'Book Another Car'}
        </Button>
      </div>
    </div>
  );
};
