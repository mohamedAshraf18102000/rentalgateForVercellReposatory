/**
 * Status Configuration Utility
 * Returns status label and styling based on reservation status
 */

export interface StatusConfig {
  className: string;
  label: string;
}

export function getStatusConfig(status: number, isArabic: boolean): StatusConfig {
  switch (status) {
    case 0:
      return {
        className: 'bg-[#FFDEC0] text-[#AA4700]',
        label: isArabic ? 'بانتظار الدفع' : 'Payment Pending',
      };
    case 1:
      return {
        className: 'bg-[#FFC0C2] text-[#4E0204]',
        label: isArabic ? ' غير مدفوع ' : 'Cash Payment',
      };
    case 2:
      return {
        className: 'bg-[#C0FFDD] text-[#024E3B]',
        label: isArabic ? 'مدفوع' : 'Paid',
      };
    case 3:
      return {
        className: 'bg-[#FEF3C7] text-[#92400E]',
        label: isArabic ? 'مؤكد' : 'Confirmed',
      };
    case 4:
      return {
        className: 'bg-[#A7F3D0] text-[#064E3B]',
        label: isArabic ? 'نشط الآن' : 'Active  ',
      };
    case 5:
      return {
        className: 'bg-[#ECEEF2] text-[#1A1A1A]',
        label: isArabic ? 'انتهت' : 'Finished',
      };
    case 6:
      return {
        className: 'bg-[#FFC0C2] text-[#4E0204]',
        label: isArabic ? 'تم الإلغاء' : 'Canceled',
      };
    case 7:
      return {
        className: 'bg-[#FFC0C2] text-[#4E0204]',
        label: isArabic ? 'تم تأكيد' : 'Claimed',
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-600',
        label: isArabic ? 'غير معروف' : 'Unknown',
      };
  }
}

