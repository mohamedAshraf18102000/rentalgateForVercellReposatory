/**
 * BetterPriceDialog Component
 * Displays dialog for better price offers
 */

import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Button } from '@/app/(components)/ui/button';
import type { BetterPriceData } from '../types';
import { formatNumber } from '../utils/formatters';

type BetterPriceDialogProps = {
  betterPriceData: BetterPriceData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
  isLoading: boolean;
  t: ReturnType<typeof import('next-intl').useTranslations<'carDetails'>>;
};

export const BetterPriceDialog = ({
  betterPriceData,
  isOpen,
  onOpenChange,
  onAccept,
  onReject,
  isLoading,
  t,
}: BetterPriceDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onReject();
    }
    onOpenChange(open);
  };

  return (
    <DialogWrapper
      open={isOpen}
      onOpenChange={handleOpenChange}
      size="sm"
      closeOnOutsideClick={false}
      content={
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onReject}
            disabled={isLoading}
            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center py-4">
            {/* Gift Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
                <div className="text-5xl">🎁</div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('special_offer_title')}
            </h2>

            {betterPriceData ? (
              <>
                {/* Main Message */}
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                  {betterPriceData.remainingAmount === 0
                    ? t('extend_booking_days_free', {
                      days: betterPriceData.remainingDaysToGetBetterPrice
                    })
                    : betterPriceData.remainingAmount < 0
                      ? t('extend_booking_days_save', {
                        days: betterPriceData.remainingDaysToGetBetterPrice,
                        amount: formatNumber(Math.abs(betterPriceData.remainingAmount))
                      })
                      : t('extend_booking_days', {
                        days: betterPriceData.remainingDaysToGetBetterPrice,
                        amount: formatNumber(betterPriceData.remainingAmount)
                      })
                  }
                </p>

                {/* Secondary Message */}
                <p className="text-xs text-gray-600 mb-6">
                  {t('enjoy_biggest_discount')}
                </p>

                {/* Accept Button */}
                <Button
                  onClick={onAccept}
                  variant="default"
                  className="w-full h-[40px] shadow-none hover:shadow-md transition-all duration-200 mb-4"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('accept_immediately')}
                </Button>

                {/* Reject Link */}
                <button
                  onClick={onReject}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors duration-200"
                >
                  {t('no_thanks')}
                </button>
              </>
            ) : (
              <>
                {/* Loading State */}
                <p className="text-lg text-gray-700 mb-2">
                  {t('searching_best_offers')}
                </p>
                <p className="text-base text-gray-600 mb-6">
                  {t('wait_for_special_offer')}
                </p>
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      }
      footer={null}
    />
  );
};

