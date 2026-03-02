'use client';

/**
 * Welcome Points Dialog Component
 * Displays welcome points popup for new users or first-time login
 * Uses DialogWrapper structure for consistency
 */

import React from 'react';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Button } from '@/app/(components)/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface WelcomePointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  points: number;
  locale: string;
}

// Hook للكشف عن الموبايل
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint في Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function WelcomePointsDialog({
  open,
  onOpenChange,
  points,
  locale,
}: WelcomePointsDialogProps) {
  const isArabic = locale === 'ar';
  const t = useTranslations('common');
  const isMobile = useIsMobile();

  const handleGetPoints = () => {
    onOpenChange(false);
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      forceDialog={true}
      className="bg-[#1A1A1A] border-none max-w-[90%] md:max-w-[500px] [&_*]:text-white [&_*]:border-white/20 [&_header]:text-white [&_header_*]:text-white [&_header_*]:border-white/20 [&_div]:text-white [&_div]:border-white/20 [&_div.border-b]:border-white/20"
      contentClassName="b] text-white"
      closeOnOutsideClick={true}
      header={{
        mainTitle: (
          <div className="flex items-center justify-between w-full">
            <span className="text-white  flex-1 text-center">
              {isArabic ? 'نقاط ترحيبية' : 'Welcome Points'}
            </span>
          </div>
        ),
      }}
      content={
        <div className="text-center" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Graphic */}
          <div className="flex justify-center items-center mb-6 mt-4 S">
            <div className="w-[148px] h-[147px] "> 
              <Image src="/points.png" alt="Welcome Points" width={100} height={100} className="w-full h-full  mx-auto" />
            </div>
          </div>

          {/* Points Message */}
          <div className="mb-6">
            <p className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
              {isArabic
                ? `لقد حصلت على ${points.toLocaleString()} نقطة`
                : `You have received ${points.toLocaleString()} points`}
            </p>
            <p className="text-xs text-gray-300 leading-relaxed px-2 text-center">
              {isArabic
                ? 'استخدم نقاطك في الحجوزات القادمة واحصل على خصومات حصرية. كل نقطة تساوي قيمة حقيقية في رحلتك معنا'
                : 'Use your points in upcoming bookings and get exclusive discounts. Every point has real value in your journey with us'}
            </p>
          </div>
        </div>
      }
      footer={
        <Button
          onClick={handleGetPoints}
          size="lg"
          className="w-full   text-white  py-3 border-none"
        >
          {isArabic ? 'الحصول على النقاط' : 'Get Points'}
        </Button>
      }
    />
  );
}
