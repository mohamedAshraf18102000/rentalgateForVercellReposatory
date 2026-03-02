import React from 'react';
import { FreeKilometersIcon, ExtraKilometerCostIcon, PriceIcon } from '@/icons';

interface KilometersSectionProps {
  maxKm: number;
  kmPrice: number;
  locale: string;
  formatPrice: (price: number) => string;
  t: (key: string) => string;
}

export const KilometersSection: React.FC<KilometersSectionProps> = ({
  maxKm,
  kmPrice,
  locale,
  formatPrice,
  t,
}) => {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
        {t('kilometers')}
      </h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <FreeKilometersIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-700">
            {t('freeKilometers')}:{' '}
            <span className="font-bold">
              {maxKm} {t('perDay')}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ExtraKilometerCostIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-700 flex items-center gap-1 flex-wrap">
            {t('extraKilometerCost')}:{' '}
            <span className="font-bold">{formatPrice(kmPrice)}</span>
            <PriceIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold">
              {locale === 'ar' ? ' / يوم' : ' / day'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

