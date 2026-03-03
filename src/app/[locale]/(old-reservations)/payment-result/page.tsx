import { Suspense } from 'react';
import PaymentResultContent from './PaymentResultContent';

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">جاري التحقق من حالة الدفع...</p>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentResultContent />
    </Suspense>
  );
}
