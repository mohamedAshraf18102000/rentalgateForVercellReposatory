import React, { useState } from 'react';
import { Button } from '@/app/(components)/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CarDoorIcon, CarSeatIcon, AirConditioningIcon } from '@/icons';
import { SeparatorWithContent } from '@/app/(components)/ui/separator-with-content';

interface SpecificationsSectionProps {
  numberOfDoors: number;
  numberOfPassengers: number;
  detailsArabic: string;
  detailsEnglish: string;
  locale: string;
  t: (key: string) => string;
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
  numberOfDoors,
  numberOfPassengers,
  detailsArabic,
  detailsEnglish,
  locale,
  t,
}) => {
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);

  return (
    <div>
      <p className="text-base sm:text-[18px] text-gray-700 my-4  font-bold">
        {t('specifications')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:flex sm:justify-between sm:items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <CarDoorIcon className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
          <span className="text-sm sm:text-[17px] text-gray-700">
            {numberOfDoors} {t('doors')}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <CarSeatIcon className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
          <span className="text-sm sm:text-[17px] text-gray-700">
            {numberOfPassengers} {t('seats')}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <AirConditioningIcon className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0" />
          <span className="text-sm sm:text-[17px] text-gray-700">
            {t('airConditioned')}
          </span>
        </div>
      </div>
      <div
        className={`mt-4 sm:mt-6 grid transition-all duration-500 ease-in-out ${
          showMoreSpecs
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="text-xs sm:text-sm text-gray-700 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{
              __html:
                locale === 'ar' ? detailsArabic || '' : detailsEnglish || '',
            }}
          />
        </div>
      </div>
      <SeparatorWithContent spacing="mt-4 sm:mt-6">
        <Button
          variant="ghost"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A1A1A] hover:bg-gray-50"
          onClick={() => setShowMoreSpecs(!showMoreSpecs)}
        >
          {showMoreSpecs ? (
            <span className="flex items-center gap-2">
              {locale !== 'ar' && <ChevronUp className="w-4 h-4" />}
              {t('showLess')}
              {locale === 'ar' && <ChevronUp className="w-4 h-4" />}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {locale !== 'ar' && <ChevronDown className="w-4 h-4" />}
              {t('showMore')}
              {locale === 'ar' && <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </Button>
      </SeparatorWithContent>
    </div>
  );
};

