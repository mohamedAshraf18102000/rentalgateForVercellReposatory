'use client';

/**
 * Timeline Section Component
 * Displays pickup and dropoff schedule with timeline visualization
 */

import React from 'react';
import { SeparatorWithContent, Button } from '@/app/(components)';
import { FormattedDateTime } from '../utils/formatters';

interface TimelineSectionProps {
  startDateTime: FormattedDateTime;
  endDateTime: FormattedDateTime;
  fromBranch: string;
  toBranch: string;
  days: number;
  locale: string;
}

export default function TimelineSection({
  startDateTime,
  endDateTime,
  fromBranch,
  toBranch,
  days,
  locale,
}: TimelineSectionProps) {
  const isArabic = locale === 'ar';

  return (
    <div className="mb-6">
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {isArabic ? 'ميعاد الاستلام و التسليم' : 'Pickup & Dropoff Schedule'}
        </h3>
      </SeparatorWithContent>

      <div className="flex items-center justify-between text-sm" dir="rtl">
        {/* Start Date */}
        <div className="w-[38%] text-right space-y-1">
          <div className="text-gray-600">{startDateTime.date}</div>
          <div className="font-semibold text-gray-900">{fromBranch}</div>
          <div className="text-gray-600">{startDateTime.time}</div>
        </div>

        {/* Center Icon */}
        <div className="w-[30%] flex flex-col items-center">
          <div className="w-full flex items-center">
            <div className="w-2 h-2 rounded-full border-2 border-gray-900 bg-transparent shrink-0"></div>
            <div className="flex-1 h-px border-t-2 border-dashed border-gray-900 mx-1"></div>
            <div className="w-10 h-8 flex items-center justify-center bg-linear-to-t from-[#0D0D0F] to-[#363636] border-2 border-white/10 shadow-md rounded-2xl">
              <svg width="20" height="10" viewBox="0 0 24 12" fill="none" className="text-white">
                <path d="M16.8501 0.181068C18.1027 0.421294 18.6175 0.644361 19.973 1.50231C20.4192 1.77686 21.3114 2.17151 21.9806 2.37742C22.6327 2.56617 23.2847 2.8064 23.3877 2.90935C23.6965 3.13242 23.6622 3.8531 23.2675 5.94649C23.0788 6.94172 22.9244 7.76535 22.9244 7.78251C22.9244 7.81683 22.5812 7.83398 22.1522 7.83398C21.5345 7.83398 21.3801 7.76535 21.3801 7.54228C21.3801 6.89024 20.6765 5.82638 19.9902 5.44888C18.3086 4.50514 16.4211 5.29445 15.9407 7.14762L15.7862 7.74819H11.5136H7.24104L7.12092 7.1991C6.89785 6.10092 6.14286 5.34593 4.9932 5.08854C3.6548 4.77968 2.35072 5.569 1.81879 7.02751C1.59572 7.64524 1.47561 7.74819 1.04663 7.74819C0.566179 7.74819 0.549021 7.73103 0.223 6.1524C-0.188816 4.23059 -0.0687046 3.83594 0.909359 3.54423C1.87026 3.26969 5.3707 2.68628 6.0399 2.68628C6.45172 2.68628 7.10376 2.39458 8.18478 1.74254C10.5184 0.335499 11.3249 0.078114 13.6585 0.00947762C14.8596 -0.0248404 16.1122 0.0437956 16.8501 0.181068Z" fill="white" />
                <path d="M19.6469 5.7236C21.3456 6.56439 21.2255 9.18972 19.4581 9.85892C17.7079 10.5281 15.889 8.91518 16.4038 7.16496C16.8156 5.70644 18.2913 5.0544 19.6469 5.7236Z" fill="white" />
                <path d="M5.61059 5.82545C7.13775 6.83783 7.08627 8.7768 5.54196 9.72055C4.52958 10.3554 3.15686 9.99509 2.50481 8.94839C1.25221 6.92363 3.65447 4.50421 5.61059 5.82545Z" fill="white" />
              </svg>
            </div>
            <div className="flex-1 h-px border-t-2 border-dashed border-gray-900 mx-1"></div>
            <div className="w-2 h-2 rounded-full border-2 border-gray-900 bg-transparent shrink-0"></div>
          </div>
        </div>

        {/* End Date */}
        <div className="w-[38%] text-left space-y-1">
          <div className="text-gray-600">{endDateTime.date}</div>
          <div className="font-semibold text-gray-900">{toBranch}</div>
          <div className="text-gray-600">{endDateTime.time}</div>
        </div>
      </div>

      {/* Duration */}
      <SeparatorWithContent spacing="mt-4">
        <Button variant="ghost" className="bg-white border border-gray-200 rounded-lg py-2 text-gray-900 font-semibold px-8">
          <span className="flex items-center gap-2">
            {isArabic ? `${days} يوم` : `${days} days`}
          </span>
        </Button>
      </SeparatorWithContent>
    </div>
  );
}

