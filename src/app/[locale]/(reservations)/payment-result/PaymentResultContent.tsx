'use client';

/**
 * Payment Result Content - Same as Algazal
 * Checks payment status and redirects to checkout after 10 seconds if successful
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SuccessIcon } from '@/constants/icons';

export default function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get URL param
  const get = (key: string) => searchParams.get(key) || '';

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get tran_ref from URL (support multiple parameter names)
        const tranRefFromBank = get('tranRef') || 
                                get('tran_ref') || 
                                get('payment_reference') ||
                                get('transaction_ref');

        // Get reservation ID
        const reservationId = get('reservationId');

        // Read payment data from localStorage (if exists)
        let storedPaymentData = null;
        try {
          const stored = localStorage.getItem('paymentData');
          if (stored) {
            storedPaymentData = JSON.parse(stored);
          }
        } catch (e) {
          console.error('Error reading localStorage:', e);
        }

        // Use tran_ref from URL or localStorage
        const tranRef = tranRefFromBank || storedPaymentData?.tran_ref;

        if (!tranRef) {
          setError('لا توجد بيانات دفع');
          setLoading(false);
          return;
        }

        // Query PayTabs to get payment status
        const response = await fetch('/api/payment/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tran_ref: tranRef }),
        });

        if (!response.ok) {
          throw new Error('Failed to query payment status');
        }

        const data = await response.json();
        console.log('📥 PayTabs Query Response:', JSON.stringify(data, null, 2));

        // Extract payment result
        const paymentResult = data.payment_result || {};
        const responseCode = paymentResult?.response_code || data.response_code || '';
        const responseMessage = paymentResult?.response_message || data.response_message || '';
        const responseStatus = paymentResult?.response_status || '';

        // Determine payment status
        let paymentStatus = 'failed';
        let statusMessage = 'فشل الدفع';
        let statusNote = 'لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى.';

        // Check payment success - response_status "A" means success
        if (responseStatus === 'A') {
          paymentStatus = 'success';
          statusMessage = 'تم الدفع بنجاح!';
          statusNote = 'شكراً لك! تم تأكيد الدفع بنجاح. سيتم تحويلك إلى صفحة الحجز...';
        } else if (responseCode === '0' || responseCode === 0) {
          // Success (old code format)
          paymentStatus = 'success';
          statusMessage = 'تم الدفع بنجاح!';
          statusNote = 'شكراً لك! تم تأكيد الدفع بنجاح. سيتم تحويلك إلى صفحة الحجز...';
        } else if (responseCode >= '600' && responseCode <= '601') {
          // Pending
          paymentStatus = 'pending';
          statusMessage = 'في الانتظار';
          statusNote = 'عملية الدفع قيد المعالجة. يرجى الانتظار...';
        } else if (responseCode >= '200' && responseCode <= '400') {
          // System error
          paymentStatus = 'error';
          statusMessage = 'خطأ في النظام';
          statusNote = responseMessage || 'حدث خطأ أثناء معالجة الدفع';
        } else if (responseCode >= '300' && responseCode <= '500') {
          // Declined
          paymentStatus = 'declined';
          statusMessage = 'تم رفض الدفع';
          statusNote = responseMessage || 'تم رفض عملية الدفع من البنك';
        } else {
          // General failure
          paymentStatus = 'failed';
          statusMessage = 'فشل الدفع';
          statusNote = responseMessage || 'لم يتم إتمام عملية الدفع';
        }

        setPaymentData({
          status: paymentStatus,
          tranRef: data.tran_ref || tranRef,
          cartId: String(data.cart_id) || reservationId || storedPaymentData?.cart_id,
          amount: data.cart_amount || storedPaymentData?.amount,
          currency: data.cart_currency || storedPaymentData?.currency || 'SAR',
          customerName: data.customer_details?.name || storedPaymentData?.customer?.name,
          customerEmail: data.customer_details?.email || storedPaymentData?.customer?.email,
          message: statusMessage,
          note: statusNote,
          responseCode: responseCode,
          responseMessage: responseMessage,
          responseStatus: responseStatus,
          acquirerMessage: paymentResult?.acquirer_message,
          transactionTime: paymentResult?.transaction_time,
        });

        // Clear localStorage after use
        localStorage.removeItem('paymentData');
      } catch (err) {
        console.error('❌ Error checking payment status:', err);
        setError('حدث خطأ أثناء التحقق من حالة الدفع');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  // Redirect to checkout after 10 seconds if payment successful
  useEffect(() => {
    if (paymentData && paymentData.status === 'success') {
      const timer = setTimeout(() => {
        // Get reservation ID from URL or payment data
        const reservationId = get('reservationId') || paymentData.cartId;
        
        if (reservationId) {
          router.push(`/checkout?reservationId=${reservationId}`);
        } else {
          router.push('/checkout');
        }
      }, 3000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentData, router, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">جاري التحقق من حالة الدفع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-[50px]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Status */}
        {paymentData?.status === 'success' && (
          <>
            <div className="flex items-center justify-center mx-auto mb-4">
              <SuccessIcon width={64} height={64} />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-4">{paymentData.message}</h1>
          </>
        )}

        {/* Pending Status */}
        {paymentData?.status === 'pending' && (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-600 mb-4">{paymentData.message}</h1>
          </>
        )}

        {/* Failed/Error/Declined Status */}
        {(paymentData?.status === 'failed' || 
          paymentData?.status === 'error' || 
          paymentData?.status === 'declined') && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{paymentData.message}</h1>
          </>
        )}

        {/* Payment Details */}
        {paymentData && (
          <div className="text-right mb-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم المعاملة:</span>
                <span className="text-gray-500 text-sm font-mono">{paymentData.tranRef}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">رقم الحجز:</span>
                <span className="text-gray-500 text-sm">{paymentData.cartId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ:</span>
                <span className={`font-bold ${
                  paymentData.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {paymentData.amount} {paymentData.currency}
                </span>
              </div>

              {paymentData.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">اسم العميل:</span>
                  <span className="text-gray-500 text-sm">{paymentData.customerName}</span>
                </div>
              )}

              {paymentData.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="text-gray-500 text-sm">{paymentData.customerEmail}</span>
                </div>
              )}

              {paymentData.responseCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">كود الاستجابة:</span>
                  <span className="text-gray-500 text-sm font-mono">{paymentData.responseCode}</span>
                </div>
              )}

              {paymentData.responseMessage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رسالة البنك:</span>
                  <span className="text-gray-500 text-sm">{paymentData.responseMessage}</span>
                </div>
              )}

              {paymentData.acquirerMessage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رسالة البنك المستفيد:</span>
                  <span className="text-gray-500 text-sm">{paymentData.acquirerMessage}</span>
                </div>
              )}

              {paymentData.transactionTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت المعاملة:</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(paymentData.transactionTime).toLocaleString('ar-SA')}
                  </span>
                </div>
              )}
            </div>

            {/* Status Note */}
            {paymentData.note && (
              <div className={`mt-4 p-3 rounded-lg ${
                paymentData.status === 'success' ? 'bg-blue-50' : 'bg-yellow-50'
              }`}>
                <p className={`text-sm ${
                  paymentData.status === 'success' ? 'text-blue-800' : 'text-yellow-800'
                }`}>
                  {paymentData.note}
                </p>
              </div>
            )}

            {/* Redirecting Message (Success only) */}
            {paymentData.status === 'success' && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-800 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  سيتم تحويلك إلى صفحة الحجز خلال 3 ثواني...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {paymentData && paymentData.status !== 'pending' && (
            <button
              onClick={() => window.print()}
              className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              طباعة التقرير
            </button>
          )}

          {paymentData?.status === 'pending' && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              تحديث الحالة
            </button>
          )}

          {/* <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            العودة للرئيسية
          </button> */}
        </div>
      </div>
    </div>
  );
}

