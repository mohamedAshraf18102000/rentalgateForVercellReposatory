// /**
//  * BranchDetails Component
//  * Displays detailed information for a single branch
//  */

// 'use client';

// import React, { useState } from 'react';
// import { Phone, MessageCircle, Mail } from 'lucide-react';
// import { ClockIcon } from '@/constants/icons';
// import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
// import { getBranchWorkingHours, type WorkingHours } from '@/lib/api/services/shared.service';
// import type { Branch } from '../types/branch.types';

// const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
// const DAY_LABELS_AR: Record<string, string> = {
//   sun: 'الأحد',
//   mon: 'الإثنين',
//   tue: 'الثلاثاء',
//   wed: 'الأربعاء',
//   thu: 'الخميس',
//   fri: 'الجمعة',
//   sat: 'السبت',
// };
// const DAY_LABELS_EN: Record<string, string> = {
//   sun: 'Sunday',
//   mon: 'Monday',
//   tue: 'Tuesday',
//   wed: 'Wednesday',
//   thu: 'Thursday',
//   fri: 'Friday',
//   sat: 'Saturday',
// };

// /** تنسيق الوقت بصيغة 12 ساعة مع صباحاً/مساءً أو AM/PM */
// function formatTimeWithPeriod(
//   str: string | null | undefined,
//   locale: string
// ): string {
//   if (!str) return '--';
//   const [h, m] = str.slice(0, 5).split(':').map(Number);
//   if (isNaN(h)) return '--';
//   const isMorning = h < 12;
//   const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
//   const time12 = `${hour12}:${String(m || 0).padStart(2, '0')}`;
//   if (locale === 'ar') {
//     const period = isMorning ? 'صباحاً' : 'مساءً';
//     return `${time12} ${period}`;
//   }
//   const period = isMorning ? 'AM' : 'PM';
//   return `${time12} ${period}`;
// }

// interface BranchDetailsProps {
//   branch: Branch;
//   locale: string;
// }

// export const BranchDetails: React.FC<BranchDetailsProps> = ({ branch, locale }) => {
//   const [workingHoursOpen, setWorkingHoursOpen] = useState(false);
//   const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
//   const [loadingHours, setLoadingHours] = useState(false);

//   const branchName = locale === 'en' ? branch.branchName : branch.branchArName;
//   const address = locale === 'en' ? branch.addressEnglish : branch.addressArabic;
//   const dayLabels = locale === 'ar' ? DAY_LABELS_AR : DAY_LABELS_EN;

//   const handleShowWorkingHours = async () => {
//     setWorkingHoursOpen(true);
//     setLoadingHours(true);
//     setWorkingHours(null);
//     try {
//       const data = await getBranchWorkingHours(branch.branchId);
//       setWorkingHours(data);
//     } catch {
//       setWorkingHours(null);
//     } finally {
//       setLoadingHours(false);
//     }
//   };

//   const rowClass = 'flex items-center justify-between gap-2 py-[4px] text-black text-xs md:text-sm';
//   const iconClass = 'w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-[#141B34]';
//   const labelClass = 'text-[#1A1A1A] font-normal';

//   return (
//     <div className="flex flex-col gap-3 mt-1 md:mt-[7px]">
//       {branch.phone1 && (
//         <div className={rowClass}>
//           <div className="flex items-center gap-2">
//             <Phone strokeWidth={1.5} className={iconClass} />
//             <span className={labelClass}>{locale === 'en' ? 'Hotline:' : 'الخط الساخن:'}</span>
//           </div>
//           <span className="text-xs md:text-sm break-all">{branch.phone1}</span>
//         </div>
//       )}

//       {branch.mobile && (
//         <div
//           className={`${rowClass} cursor-pointer hover:text-gray-700 transition-colors`}
//           onClick={() => window.open(`https://wa.me/${branch.mobile.replace('+', '')}`, '_blank')}
//         >
//           <div className="flex items-center gap-2">
//             <MessageCircle strokeWidth={1.5} className={iconClass} />
//             <span className={labelClass}>{locale === 'en' ? 'WhatsApp:' : 'واتساب:'}</span>
//           </div>
//           <span className="text-xs md:text-sm break-all">{branch.mobile.replace('+', '')}</span>
//         </div>
//       )}

//       {branch.email && (
//         <div
//           className={`${rowClass} cursor-pointer hover:text-gray-700 transition-colors`}
//           onClick={() => window.open(`mailto:${branch.email}`, '_blank')}
//         >
//           <div className="flex items-center gap-2">
//             <Mail strokeWidth={1.5} className={iconClass} />
//             <span className={labelClass}>{locale === 'en' ? 'Email:' : 'البريد الإلكتروني:'}</span>
//           </div>
//           <span className="text-xs md:text-sm break-all">{branch.email}</span>
//         </div>
//       )}

//       <div className={rowClass}>
//         <div className="flex items-center gap-2">
//           <ClockIcon className={iconClass} />
//           <span className={labelClass}>{locale === 'en' ? 'Work Hours:' : 'ساعات العمل:'}</span>
//         </div>
//         <button
//           type="button"
//           onClick={(e) => {
//             e.stopPropagation();
//             e.preventDefault();
//             handleShowWorkingHours();
//           }}
//           className="text-xs text-primary font-medium hover:underline"
//         >
//           {locale === 'ar' ? 'عرض' : 'Show'}
//         </button>
//       </div>

//       <DialogWrapper
//         open={workingHoursOpen}
//         onOpenChange={setWorkingHoursOpen}
//         size="md"
//         header={{
//           mainTitle: locale === 'ar' ? 'ساعات العمل' : 'Working Hours',
//         }}
//         content={
//           loadingHours ? (
//             <div className="py-8 text-center text-gray-500 text-sm">
//               {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
//             </div>
//           ) : !workingHours ? (
//             <div className="py-8 text-center text-gray-500 text-sm">
//               {locale === 'ar' ? 'لا توجد أوقات عمل مسجلة لهذا الفرع' : 'No working hours found for this branch'}
//             </div>
//           ) : (
//             <div className="bg-[#ECEEF2] px-4 rounded-lg overflow-hidden">
//               {DAY_KEYS.map((day, index) => {
//                 const openKey = `${day}OpenTime` as keyof WorkingHours;
//                 const closeKey = `${day}CloseTime` as keyof WorkingHours;
//                 const openVal = workingHours[openKey] as string | null | undefined;
//                 const closeVal = workingHours[closeKey] as string | null | undefined;
//                 const label = dayLabels[day] ?? day;
//                 const openStr = formatTimeWithPeriod(openVal, locale);
//                 const closeStr = formatTimeWithPeriod(closeVal, locale);
//                 const isLast = index === DAY_KEYS.length - 1;
//                 return (
//                   <div
//                     key={day}
//                     className={`flex items-center justify-between py-4 transition-colors ${!isLast ? 'border-b border-[#D7DDE8]' : ''}`}
//                   >
//                     <div className="flex-1">
//                       <span className="text-sm text-[#1A1A1A]  font-semibold">
//                         {label}
//                       </span>
//                     </div>
//                     <div className="text-[13px] font-medium text-[#686A79]">
//                       {openStr} – {closeStr}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )
//         }
//       />
//     </div>
//   );
// };

// export default BranchDetails;



const BranchDetails = () => {
  return (
    <div>BranchDetails</div>
  )
}

export default BranchDetails