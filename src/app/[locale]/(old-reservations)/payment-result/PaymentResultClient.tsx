'use client';

/**
 * Payment Result Page
 * Handles PayTabs payment callback and displays result
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/(components)/ui/button';
import { toast } from 'sonner';

interface PaymentResultClientProps {
  locale: string;
}

export default function PaymentResultClient({ locale }: PaymentResultClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [reservationId, setReservationId] = useState<string>('');
  const [isExtension, setIsExtension] = useState(false);

  const isArabic = locale === 'ar';

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get params from URL
        const tranRef = searchParams.get('tranRef') || searchParams.get('tran_ref');
        const respStatus = searchParams.get('respStatus') || searchParams.get('resp_status');
        const respMessage = searchParams.get('respMessage') || searchParams.get('resp_message');
        const resId = searchParams.get('reservationId') || '';
        const cartId = searchParams.get('cartId') || searchParams.get('cart_id');
        const extensionId = searchParams.get('extensionId') || '';
        const isExt = searchParams.get('isExtension') === 'true' || !!extensionId;

        console.log('Payment Result Params:', {
          tranRef,
          respStatus,
          respMessage,
          reservationId: resId,
          cartId,
          isExtension: isExt
        });

        setReservationId(resId || cartId || '');
        setIsExtension(isExt);

        if (!tranRef) {
          setPaymentStatus('failed');
          setPaymentMessage(isArabic ? 'لا توجد بيانات دفع' : 'No payment data found');
          setIsLoading(false);
          return;
        }

        // Query PayTabs to verify payment
        const queryResponse = await fetch('/api/payment/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tran_ref: tranRef,
          }),
        });

        if (!queryResponse.ok) {
          throw new Error('Failed to verify payment');
        }

        const queryData = await queryResponse.json();
        console.log('Payment Query Result:', queryData);

        // Check payment status
        const paymentResult = queryData.payment_result || {};
        const responseStatus = paymentResult.response_status || respStatus;

        if (responseStatus === 'A') {
          // Payment successful
          setPaymentStatus('success');
          setPaymentMessage(
            paymentResult.response_message || 
            respMessage || 
            (isArabic ? 'تم الدفع بنجاح' : 'Payment successful')
          );
          toast.success(isArabic ? 'تم الدفع بنجاح!' : 'Payment successful!');
        } else {
          // Payment failed
          setPaymentStatus('failed');
          setPaymentMessage(
            paymentResult.response_message || 
            respMessage || 
            (isArabic ? 'فشل الدفع' : 'Payment failed')
          );
          toast.error(isArabic ? 'فشل الدفع' : 'Payment failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
        setPaymentMessage(isArabic ? 'حدث خطأ أثناء التحقق من الدفع' : 'Error verifying payment');
        toast.error(isArabic ? 'حدث خطأ أثناء التحقق من الدفع' : 'Error verifying payment');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, isArabic]);

  if (isLoading) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isArabic ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        {paymentStatus === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              {isArabic ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
            </h1>
            {reservationId && (
              <p className="text-green-700 text-lg mb-2">
                {isArabic 
                  ? `رقم ${isExtension ? 'التمديد' : 'الحجز'}: ${reservationId}` 
                  : `${isExtension ? 'Extension' : 'Reservation'} ID: ${reservationId}`}
              </p>
            )}
            <p className="text-green-600 text-sm">{paymentMessage}</p>
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 text-sm">
                {isArabic 
                  ? `شكراً لك! تم تأكيد ${isExtension ? 'تمديد حجزك' : 'حجزك'} ودفعك بنجاح. ستصلك رسالة تأكيد قريباً.`
                  : `Thank you! Your ${isExtension ? 'extension' : 'reservation'} and payment have been confirmed. You will receive a confirmation message shortly.`}
              </p>
            </div>
          </div>
        )}

        {/* Failed Message */}
        {paymentStatus === 'failed' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              {isArabic ? 'فشل الدفع' : 'Payment Failed'}
            </h1>
            {reservationId && (
              <p className="text-red-700 text-lg mb-2">
                {isArabic 
                  ? `رقم ${isExtension ? 'التمديد' : 'الحجز'}: ${reservationId}` 
                  : `${isExtension ? 'Extension' : 'Reservation'} ID: ${reservationId}`}
              </p>
            )}
            <p className="text-red-600 text-sm mb-4">{paymentMessage}</p>
            <div className="mt-6 p-4 bg-red-100 rounded-lg">
              <p className="text-red-800 text-sm">
                {isArabic 
                  ? `لم يتم إتمام عملية الدفع. ${isExtension ? 'تمديدك' : 'حجزك'} لا يزال موجوداً ويمكنك الدفع نقداً عند ${isExtension ? 'استلام التمديد' : 'استلام السيارة'}.`
                  : `Payment was not completed. Your ${isExtension ? 'extension' : 'reservation'} still exists and you can pay cash on pickup.`}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/profile/my-bookings')}  
            className="min-w-[200px]"
          >
            {isArabic ? 'عرض حجوزاتي' : 'View My Bookings'}
          </Button>
          
          <Button
            size="lg"
            onClick={() => router.push('/cars')}
            className="min-w-[200px] bg-primary hover:bg-primary-hover"
          >
            {isArabic ? 'حجز سيارة جديدة' : 'Book Another Car'}
          </Button>
        </div>

        {/* Details Card */}
        {reservationId && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              {isArabic ? 'تفاصيل إضافية' : 'Additional Details'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{isArabic ? 'رقم الحجز:' : 'Reservation ID:'}</span>
                <span className="font-semibold text-gray-900">{reservationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{isArabic ? 'حالة الدفع:' : 'Payment Status:'}</span>
                <span className={`font-semibold ${paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {paymentStatus === 'success' 
                    ? (isArabic ? 'مدفوع' : 'Paid') 
                    : (isArabic ? 'غير مدفوع' : 'Unpaid')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Support Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {isArabic 
              ? 'في حالة وجود أي استفسار، يرجى التواصل مع خدمة العملاء'
              : 'For any inquiries, please contact customer service'}
          </p>
        </div>
      </div>
    </div>
  );
}

