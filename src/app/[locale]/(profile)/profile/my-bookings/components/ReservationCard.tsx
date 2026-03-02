'use client';

import Image from 'next/image';
import { Reservation, getStatusLabel, getStatusColor } from '@/lib/api/reservations-list';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button, SeparatorWithContent } from '@/app/(components)';
import { PriceIcon, ActiveIcon, ApprovedIcon, CancelledIcon, FinishedIcon } from '@/constants/icons';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  locale: string;
}

export default function ReservationCard({ reservation, locale }: ReservationCardProps) {
  const isArabic = locale === 'ar';

  // Calculate duration in days
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const startTime = reservation.startTime;
  const endTime = reservation.endTime;
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));


  // Get time - handles both Date objects and time strings (HH:mm format)
  // Converts to 12-hour format with AM/PM (صباحاً/مساءً)
  const getTime = (dateOrTime: Date | string | undefined) => {
    if (!dateOrTime) {
      return '';
    }

    let timeString = '';

    // If it's a string (time format like "HH:mm"), convert it to 12-hour format
    if (typeof dateOrTime === 'string' && dateOrTime.includes(':')) {
      const [hours, minutes] = dateOrTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes || 0, 0, 0);
      timeString = format(date, 'h:mm a', { locale: isArabic ? ar : undefined });
    } else if (dateOrTime instanceof Date) {
      // If it's a Date object, format it to 12-hour format
      timeString = format(dateOrTime, 'h:mm a', { locale: isArabic ? ar : undefined });
    } else {
      return '';
    }

    // Replace AM/PM with Arabic equivalents if needed
    if (isArabic) {
      // Replace English AM/PM
      timeString = timeString.replace('AM', 'صباحاً').replace('PM', 'مساءً');
      timeString = timeString.replace('am', 'صباحاً').replace('pm', 'مساءً');
      // Replace Arabic short forms (ص/م) with full forms
      // Match "ص" or "م" at the end of string or after space
      timeString = timeString.replace(/\s+ص\s*$/, ' صباحاً');
      timeString = timeString.replace(/\s+م\s*$/, ' مساءً');
      // Also handle if ص/م is directly after time without space
      timeString = timeString.replace(/(\d+:\d+)\s*ص\s*$/, '$1 صباحاً');
      timeString = timeString.replace(/(\d+:\d+)\s*م\s*$/, '$1 مساءً');
    }

    return timeString;
  };

  // Get branch names
  const fromBranch = isArabic ? reservation.fromBranchArName : reservation.fromBranchName;
  const toBranch = isArabic ? reservation.toBranchArName : reservation.toBranchName;


  // Status
  const statusLabel = getStatusLabel(reservation.reservationStatus, locale);
  const statusColor = getStatusColor(reservation.reservationStatus);

  // Get center icon based on status
  const getCenterIcon = () => {
    switch (reservation.reservationStatus) {
      case 3: // APPROVED
        return <ApprovedIcon width={22} height={22} className="text-white" />;
      case 4: // ACTIVE
        return <ActiveIcon width={20} height={10} className="text-white" />;
      case 5: // FINISHED
        return <FinishedIcon width={22} height={22} className="text-white" />;
      case 6: // CANCELED
        return <CancelledIcon width={22} height={22} className="text-white" />;
      default: // PAYMENT_PENDING, TEMPORARY, NOT_STARTED, CLAIMED - use default car icon
        return (
          <svg width="20" height="10" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M16.8501 0.181068C18.1027 0.421294 18.6175 0.644361 19.973 1.50231C20.4192 1.77686 21.3114 2.17151 21.9806 2.37742C22.6327 2.56617 23.2847 2.8064 23.3877 2.90935C23.6965 3.13242 23.6622 3.8531 23.2675 5.94649C23.0788 6.94172 22.9244 7.76535 22.9244 7.78251C22.9244 7.81683 22.5812 7.83398 22.1522 7.83398C21.5345 7.83398 21.3801 7.76535 21.3801 7.54228C21.3801 6.89024 20.6765 5.82638 19.9902 5.44888C18.3086 4.50514 16.4211 5.29445 15.9407 7.14762L15.7862 7.74819H11.5136H7.24104L7.12092 7.1991C6.89785 6.10092 6.14286 5.34593 4.9932 5.08854C3.6548 4.77968 2.35072 5.569 1.81879 7.02751C1.59572 7.64524 1.47561 7.74819 1.04663 7.74819C0.566179 7.74819 0.549021 7.73103 0.223 6.1524C-0.188816 4.23059 -0.0687046 3.83594 0.909359 3.54423C1.87026 3.26969 5.3707 2.68628 6.0399 2.68628C6.45172 2.68628 7.10376 2.39458 8.18478 1.74254C10.5184 0.335499 11.3249 0.078114 13.6585 0.00947762C14.8596 -0.0248404 16.1122 0.0437956 16.8501 0.181068ZM15.3229 1.0047C15.6146 2.54901 15.4259 2.4289 17.5708 2.44606C18.6346 2.46322 19.4926 2.44606 19.4926 2.41174C19.4926 2.27447 17.2619 1.05618 16.4897 0.781633C15.2715 0.335499 15.1857 0.352658 15.3229 1.0047ZM10.5699 1.27924C9.95216 1.57095 9.21432 2.03424 8.93978 2.27447L8.42501 2.7206L11.5651 2.63481C13.2982 2.60049 14.7224 2.53185 14.7567 2.49753C14.791 2.46322 14.7395 2.01708 14.6366 1.51947L14.4478 0.592884L13.0579 0.66152C11.9083 0.695838 11.4965 0.815951 10.5699 1.27924Z" fill="white" />
            <path d="M19.6469 5.7236C21.3456 6.56439 21.2255 9.18972 19.4581 9.85892C17.7079 10.5281 15.889 8.91518 16.4038 7.16496C16.8156 5.70644 18.2913 5.0544 19.6469 5.7236ZM17.7765 6.97621C17.073 7.67973 17.6049 8.8637 18.6002 8.8637C19.2007 8.8637 19.6983 8.34893 19.6983 7.74837C19.6983 6.75314 18.48 6.27269 17.7765 6.97621Z" fill="white" />
            <path d="M5.61059 5.82545C7.13775 6.83783 7.08627 8.7768 5.54196 9.72055C4.52958 10.3554 3.15686 9.99509 2.50481 8.94839C1.25221 6.92363 3.65447 4.50421 5.61059 5.82545ZM3.67163 6.92363C3.29413 7.26681 3.27697 8.12476 3.65447 8.55373C4.27219 9.24009 5.59344 8.69101 5.59344 7.74726C5.59344 6.82068 4.37515 6.28875 3.67163 6.92363Z" fill="white" />
          </svg>
        );
    }
  };

  // Status button styles and icons to match design
  const getStatusConfig = (status?: number) => {
    const statusToCheck = status !== undefined ? status : reservation.reservationStatus;

    switch (statusToCheck) {
      case 0: // Reservation_Status_Payment_Pending
        return {
          className: 'bg-[#FFDEC0] text-[#AA4700]',
          label: isArabic ? 'بانتظار الدفع' : 'Payment Pending',
          icon: <ApprovedIcon width={22} height={22} className="text-[#AA4700]" />,
        };
      case 1: // Reservation_Status_Temporary (Cash Payment)
        return {
          className: 'bg-[#FFC0C2] text-[#4E0204]',
          label: isArabic ? ' غير مدفوع ' : 'Cash Payment',
          icon: <ApprovedIcon width={22} height={22} className="text-[#92400E]" />,
        };
      case 2: // Reservation_Status_Not_Started
        return {
          className: 'bg-[#C0FFDD] text-[#024E3B]',
          label: isArabic ? 'مدفوع' : 'Paid',
          icon: <ApprovedIcon width={22} height={22} className="text-[#AA4700]" />,
        };
      case 3: // Reservation_Status_Approved
        return {
          className: 'bg-[#FEF3C7] text-[#92400E]',
          label: isArabic ? 'مؤكد' : 'Confirmed',
          icon: <ApprovedIcon width={22} height={22} className="text-[#024E3B]" />,
        };
      case 4: // Reservation_Status_Active
        return {
          className: 'bg-[#A7F3D0] text-[#064E3B]',
          label: isArabic ? 'نشط الآن' : 'Active  ',
          icon: <ActiveIcon width={24} height={12} className="text-[#064E3B]" />,
        };
      case 5: // Reservation_Status_Finished
        return {
          className: 'bg-[#ECEEF2] text-[#1A1A1A]',
          label: isArabic ? 'انتهت' : 'Finished',
          icon: <FinishedIcon width={22} height={22} className="text-[#1F2937]" />,
        };
      case 6: // Reservation_Status_Canceled
        return {
          className: 'bg-[#FFC0C2] text-[#4E0204]',
          label: isArabic ? 'تم الإلغاء' : 'Canceled',
          icon: <CancelledIcon width={22} height={22} className="text-[#4E0204]" />,
        };
      case 7: // Reservation_Status_Claimed
        return {
          className: 'bg-[#FFC0C2] text-[#4E0204]',
          label: isArabic ? 'تم تأكيد' : 'Confirmed',
          icon: <CancelledIcon width={22} height={22} className="text-[#4E0204]" />,
        };
      default:
        return {
          className: statusColor,
          icon: null,
        };
    }
  };

  // Determine status based on finalAmount condition (like the condition in the image)
  // If finalAmount >= 0, use reservationStatus; otherwise, if status is 1, use 2, else use reservationStatus
  const statusForConfig = reservation.finalAmount >= 0
    ? reservation.reservationStatus
    : (reservation.reservationStatus == 1 ? 2 : reservation.reservationStatus);
  
  const statusConfig = getStatusConfig(statusForConfig);

  return (
    <Link href={`/profile/my-bookings/${reservation.reservationId}`}>
      <div className="bg-white rounded-[16px]  border border-gray-100 p-4 ">
        {/* Header with title on left and car image on the right */}
        <div className="flex items-start gap-3 h-[56px]">
          <div className="relative w-[72px] h-[56px] rounded-xl overflow-hidden bg-[#ECEEF2] shrink-0">
            <Image
              src={reservation.defaultImage || reservation.carImage || '/shared/CarNotFound.png'}
              alt={reservation.carName}
              fill
              className="object-contain "
            />
          </div>
          <div className="flex items-start justify-between gap-2  w-full  h-full " >
            <div className="flex-1 min-h-[32px] flex items-center h-full">
              <h3 className="font-['Zain'] font-bold text-[16px] leading-[150%] tracking-normal text-right line-clamp-2 w-full">
                {isArabic ? reservation.modelArabicName : reservation.modelEnglishName} {" - "} {isArabic ? reservation.brandArabicName : reservation.brandName} {" - "} {reservation.year}
              </h3>
            </div>
            <div className="shrink-0 min-h-[32px] flex items-start">
              <span className="text-[#1A1A1A] text-[12px] font-semibold block bg-[#ECEEF2] rounded-lg px-2 py-1">
                <span className='text-[#595959] pl-[2px]' > {isArabic ? 'رقم الحجز:' : 'Reservation Number:'}</span> {"  "} {reservation.reservationId}
              </span>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gray-200"></div>

        {/* Timeline row */}
        <div className="flex items-center justify-between text-[12px] text-gray-800" dir="rtl">
          {/* End date (right side) */}
          <div className="w-[38%] text-right space-y-1">
            <div className="text-[#595959]">{format(startDate, 'yyyy-MM-dd')}</div>
            <div className="text-[#1A1A1A] truncate text-[12.5px] font-semibold">{fromBranch}</div>
            <div className="text-[#595959]">{getTime(startTime)}</div>
          </div>

          {/* Center icon with connector */}
          <div className={`${isArabic ? 'w-[30%]' : 'w-[25%]'} flex flex-col items-center`}>
            <div className="w-full flex items-center">
              {/* Left circle - outline only */}
              {
                (reservation.reservationStatus == 3 || reservation.reservationStatus == 4 || reservation.reservationStatus == 5) ?
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-900 bg-[#110000] shrink-0"></div> :
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-900 bg-transparent shrink-0"></div>
              }

              {/* Dashed line left */}
              <div className="flex-1 h-px border-t-[1.5px] border-dashed border-gray-900 mx-1"></div>

              {/* Center icon - filled dark gray with shadow */}
              <div className="w-[40px] h-[32px] flex items-center justify-center  bg-gradient-to-t from-[#0D0D0F] to-[#363636] border-2 border-white/10 shadow-[0px_2.78px_8.35px_0px_rgba(0,20,37,0.35)] hover:shadow-[0px_2.78px_8.35px_0px_rgba(0,20,37,0.35)] rounded-[16.7px]  ">
                {getCenterIcon()}
              </div>

              {/* Dashed line right */}
              <div className="flex-1 h-px border-t-[1.5px] border-dashed border-gray-900 mx-1"></div>

              {/* Right circle - outline only */}
              {
                reservation.reservationStatus == 5 ?
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-900 bg-[#110000] shrink-0"></div> :
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-900 bg-transparent shrink-0"></div>
              }
            </div>
          </div>

          {/* Start date (left side) */}
          <div className="w-[38%] text-left space-y-1">
            <div className="text-[#595959]">{format(endDate, 'yyyy-MM-dd')}</div>
            <div className="text-[#1A1A1A]  truncate text-[12.5px] font-semibold">{toBranch}</div>
            <div className="text-[#595959]">{getTime(endTime)}</div>
          </div>
        </div>

        {/* Duration pill with connecting lines */}
        <SeparatorWithContent spacing="mt-2">
          <Button
            variant="ghost"
            className="bg-white border border-gray-200 rounded-lg  py-2 text-[#1A1A1A] font-semibold px-8 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              {isArabic ? `${durationDays} يوم` : `${durationDays} days`}
            </span>
          </Button>
        </SeparatorWithContent>

        {/* Footer with price and status button */}
        <div className="flex items-center justify-between">
          <button
            className={`px-[8PX] py-1 rounded-[6PX] text-xs font-semibold  flex items-center gap-2 ${statusConfig.className}`}
          >
            {statusConfig.label}
          </button>

          <div className=" flex items-center gap-1" dir="ltr">
            <PriceIcon className="w-[17px] h-[17px] -mt-[5px]" />
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(reservation.finalAmount > 0 ? reservation.finalAmount : 0)}
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
} 