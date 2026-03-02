'use client';

/**
 * Order Page Client - Same as Algazal
 * Completes payment after PayTabs redirect
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/app/(components)/ui/button';
import { PriceIcon } from '@/constants/icons';
import { URL } from '@/constants/api';
import { getAuthToken } from '@/util/auth';
import { toast } from 'sonner';
import { useClientStore } from '@/lib/api/stores';

interface OrderPageClientProps {
  locale: string;
}

export default function OrderPageClient({ locale }: OrderPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchClientData } = useClientStore();
  const paymentProcessed = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const isArabic = locale === 'ar';

  // Get all params from URL (same as Algazal)
  const reservationId = searchParams.get('reservationId');
  const finalAmount = searchParams.get('finalAmount');
  const total = searchParams.get('total');
  const subTotal = searchParams.get('subTotal');
  const paidAmount = searchParams.get('paidAmount');
  const totalDiscount = searchParams.get('totalDiscount');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const carName = searchParams.get('carName');
  const image = searchParams.get('image');
  const typeArabicName = searchParams.get('typeArabicName');
  const typeEnglishName = searchParams.get('typeEnglishName');
  const year = searchParams.get('year');
  const modelEnglishName = searchParams.get('modelEnglishName');
  const modelArabicName = searchParams.get('modelArabicName');
  const brandName = searchParams.get('brandName');
  const brandArabicName = searchParams.get('brandArabicName');
  const pointsUsed = searchParams.get('pointsUsed');
  const lim = searchParams.get('lim') || 'false';

  // Payment data from bank - Support all PayTabs parameter variations
  const tranRef = searchParams.get('tranRef') || 
                  searchParams.get('tran_ref') || 
                  searchParams.get('transaction_ref');
  
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  const responseCode = searchParams.get('responseCode') || 
                       searchParams.get('respCode') || 
                       searchParams.get('resp_code') ||
                       searchParams.get('response_code');
  
  const responseMessage = searchParams.get('responseMessage') || 
                          searchParams.get('respMessage') || 
                          searchParams.get('resp_message') ||
                          searchParams.get('response_message');
  
  const responseStatus = searchParams.get('responseStatus') || 
                         searchParams.get('respStatus') || 
                         searchParams.get('resp_status') ||
                         searchParams.get('response_status');
  
  const transactionTime = searchParams.get('transactionTime') ||
                          searchParams.get('transaction_time') ||
                          searchParams.get('acquirerDate') ||
                          searchParams.get('acquirer_date');

  // Query PayTabs to get payment details (same as Algazal)
  const queryPaymentStatus = async (transactionRef: string) => {
    try {
      console.log('🔍 Querying PayTabs for transaction:', transactionRef);
      
      const queryResponse = await fetch('/api/payment/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tran_ref: transactionRef,
        }),
      });

      if (!queryResponse.ok) {
        throw new Error('Failed to query payment status');
      }

      const queryData = await queryResponse.json();
      console.log('📥 PayTabs Query Response:', JSON.stringify(queryData, null, 2));
      
      setPaymentDetails(queryData);
      
      // Extract payment result from query response
      const paymentResult = queryData.payment_result || {};
      const paymentInfo = queryData.payment_info || {};
      
      return {
        responseCode: paymentResult.response_code || paymentInfo.response_code || 'unknown',
        responseMessage: paymentResult.response_message || paymentInfo.response_message || 'No response',
        responseStatus: paymentResult.response_status || paymentInfo.response_status || 'A',
        transactionTime: paymentResult.transaction_time || paymentInfo.transaction_time || new Date().toISOString(),
        tranRef: transactionRef
      };
    } catch (error) {
      console.error('❌ Error querying payment:', error);
      // Return default values if query fails
      return {
        responseCode: 'unknown',
        responseMessage: 'Payment query failed',
        responseStatus: 'A',
        transactionTime: new Date().toISOString(),
        tranRef: transactionRef
      };
    }
  };

  // Complete payment API call (same as Algazal)
  const completePayment = async (paymentInfo: any) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('AUTH_TOKEN_MISSING');
      }

      const apiUrl = URL('/reservations/complete-payment');

      const paymentPayload = {
        reservationId: parseInt(reservationId || '0'),
        paidAmount: parseFloat(finalAmount || '0'),
        paid: true,
        pointsUsed: parseInt(pointsUsed || '0'),
        transactionReference: paymentInfo.tranRef || null,
        paymentResult: {
          responseCode: paymentInfo.responseCode || 'unknown',
          responseMessage: paymentInfo.responseMessage || 'No response',
          responseStatus: paymentInfo.responseStatus || 'A',
          transactionTime: paymentInfo.transactionTime || new Date().toISOString()
        }
      };

      console.log('📤 Sending to complete-payment API:', paymentPayload);

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
        
        toast.success(isArabic ? 'تم الدفع بنجاح!' : 'Payment completed successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Complete payment failed:', errorText);
        console.error('Response status:', response.status);
        toast.error(isArabic ? 'فشل في تأكيد الدفع' : 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('❌ Error completing payment:', error);
      toast.error(isArabic ? 'حدث خطأ أثناء تأكيد الدفع' : 'Error confirming payment');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const processPayment = async () => {
      // Log all URL parameters from PayTabs
      console.log('🔍 All URL Parameters from PayTabs:');
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
        console.log(`  ${key}: ${value}`);
      });
      console.log('📋 Full params object:', allParams);
      
      // Complete payment only once
      if (reservationId && !paymentProcessed.current) {
        paymentProcessed.current = true;
        
        // If we have tranRef, query PayTabs first
        if (tranRef) {
          setIsLoading(true);
          const paymentInfo = await queryPaymentStatus(tranRef);
          await completePayment(paymentInfo);
        } else {
          // No tranRef - try to complete with URL params only
          console.warn('⚠️ No transaction reference found, using URL params only');
          const paymentInfo = {
            responseCode: searchParams.get('responseCode') || 
                          searchParams.get('respCode') || 
                          'unknown',
            responseMessage: searchParams.get('responseMessage') || 
                            searchParams.get('respMessage') || 
                            'No response',
            responseStatus: searchParams.get('responseStatus') || 
                           searchParams.get('respStatus') || 
                           'A',
            transactionTime: searchParams.get('transactionTime') ||
                            new Date().toISOString(),
            tranRef: null
          };
          await completePayment(paymentInfo);
        }
      } else {
        setIsLoading(false);
      }
    };

    processPayment();
  }, [reservationId, tranRef, searchParams]);

  const formatPrice = (price: string | null) => {
    if (!price) return '0.00';
    return parseFloat(price).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isArabic ? 'جاري تأكيد الدفع...' : 'Confirming payment...'}
          </p>
        </div>
      </div>
    );
  }

  if (!reservationId) {
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

  return (
    <div className="container-custom py-8 min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        {/* Success Section */}
        <div className="bg-white rounded-2xl p-8 text-center mb-6 shadow-sm">
          <div className="flex justify-center items-center gap-2 mb-4 flex-col">
            <div className="relative w-32 h-32">
              <Image 
                src="/profile/referral.png" 
                alt="order-success" 
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary">
              {isArabic ? 'تم إتمام الحجز بنجاح!' : 'Booking Completed Successfully!'}
            </h1>
          </div>

          {/* Reservation Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-start border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  {isArabic ? 'اسم السيارة:' : 'Car Name:'}
                </span>
                <span className="text-gray-900">{carName}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  {isArabic ? 'رقم الحجز:' : 'Order Number:'}
                </span>
                <span className="text-gray-900">#{reservationId}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  {isArabic ? 'تاريخ البداية:' : 'Start Date:'}
                </span>
                <span className="text-gray-900">{startDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  {isArabic ? 'تاريخ النهاية:' : 'End Date:'}
                </span>
                <span className="text-gray-900">{endDate}</span>
              </div>

              <hr className="my-4" />

              {/* Pricing Details */}
              {pointsUsed && parseInt(pointsUsed) > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}
                    </span>
                    <span className="flex items-center gap-1">
                      {formatPrice(subTotal)}
                      <PriceIcon className="w-4 h-4" />
                      <span className="text-xs text-gray-500">
                        ({isArabic ? 'بدون ضريبة' : 'excl. VAT'})
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {isArabic ? 'الإجمالي:' : 'Total:'}
                    </span>
                    <span className="flex items-center gap-1">
                      {formatPrice(total)}
                      <PriceIcon className="w-4 h-4" />
                      <span className="text-xs text-gray-500">
                        ({isArabic ? 'شامل الضريبة' : 'incl. VAT'})
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-semibold">
                      {isArabic ? 'النقاط المستخدمة:' : 'Points Used:'}
                    </span>
                    <span className="font-semibold">- {pointsUsed}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">
                      {isArabic ? 'المبلغ النهائي:' : 'Final Amount:'}
                    </span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      {formatPrice(finalAmount)}
                      <PriceIcon className="w-5 h-5" />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}
                    </span>
                    <span className="flex items-center gap-1">
                      {formatPrice(subTotal)}
                      <PriceIcon className="w-4 h-4" />
                      <span className="text-xs text-gray-500">
                        ({isArabic ? 'بدون ضريبة' : 'excl. VAT'})
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">
                      {isArabic ? 'الإجمالي:' : 'Total Amount:'}
                    </span>
                    <span className="text-lg font-bold flex items-center gap-1">
                      {formatPrice(total)}
                      <PriceIcon className="w-5 h-5" />
                      <span className="text-xs text-gray-500">
                        ({isArabic ? 'شامل الضريبة' : 'incl. VAT'})
                      </span>
                    </span>
                  </div>
                </>
              )}

              {totalDiscount && parseFloat(totalDiscount) > 0 && (
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg mt-4">
                  <span className="text-green-700 font-semibold flex items-center gap-2">
                    🎁 {isArabic ? 'خصم العرض:' : 'Offer Discount:'}
                  </span>
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    {formatPrice(totalDiscount)}
                    <PriceIcon className="w-4 h-4" />
                  </span>
                </div>
              )}

              {/* Payment Details from Bank */}
              {paymentDetails && (
                <>
                  <hr className="my-4" />
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">
                      {isArabic ? 'تفاصيل الدفع من البنك:' : 'Payment Details from Bank:'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {tranRef && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? 'رقم المعاملة:' : 'Transaction Reference:'}
                          </span>
                          <span className="font-mono text-gray-900">{tranRef}</span>
                        </div>
                      )}
                      {paymentDetails.payment_result?.response_status && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? 'حالة الدفع:' : 'Payment Status:'}
                          </span>
                          <span className={`font-semibold ${
                            paymentDetails.payment_result.response_status === 'A' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {paymentDetails.payment_result.response_status === 'A'
                              ? (isArabic ? 'نجح ✓' : 'Success ✓')
                              : (isArabic ? 'فشل ✗' : 'Failed ✗')}
                          </span>
                        </div>
                      )}
                      {paymentDetails.payment_result?.response_message && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? 'رسالة البنك:' : 'Bank Message:'}
                          </span>
                          <span className="text-gray-900">
                            {paymentDetails.payment_result.response_message}
                          </span>
                        </div>
                      )}
                      {paymentDetails.payment_result?.response_code && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? 'كود الاستجابة:' : 'Response Code:'}
                          </span>
                          <span className="font-mono text-gray-900">
                            {paymentDetails.payment_result.response_code}
                          </span>
                        </div>
                      )}
                      {paymentDetails.payment_result?.transaction_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {isArabic ? 'وقت المعاملة:' : 'Transaction Time:'}
                          </span>
                          <span className="text-gray-900">
                            {new Date(paymentDetails.payment_result.transaction_time).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            {isArabic 
              ? 'في حالة وجود أي استفسار، يرجى التواصل على: '
              : 'For any inquiries, please contact: '}
            <span className="text-primary font-semibold">rent@almqam.sa</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/profile/my-bookings')}
              className="min-w-[200px]"
            >
              {isArabic ? 'إدارة الحجوزات' : 'Manage Bookings'}
            </Button>
            
            <Button
              size="lg"
              onClick={() => router.push('/cars')}
              className="min-w-[200px] bg-primary hover:bg-primary-hover"
            >
              {isArabic ? 'حجز سيارة جديدة' : 'Book Another Car'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

