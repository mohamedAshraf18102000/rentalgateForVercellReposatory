'use client';

/**
 * Pickup and Dropoff Location Section Component
 * Displays pickup and dropoff branch locations
 */

import React from 'react';
import { SeparatorWithContent } from '@/app/(components)';
import { InfoCard } from '@/app/(components)/template/InfoCard';

interface PickupDropoffLocationSectionProps {
  fromBranch: string;
  toBranch: string;
  locale: string;
}

export default function PickupDropoffLocationSection({
  fromBranch,
  toBranch,
  locale,
}: PickupDropoffLocationSectionProps) {
  const isArabic = locale === 'ar';
  const isSameBranch = fromBranch === toBranch;

  return (
    <div className="mb-6 space-y-4">
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {isArabic ? 'مكان الاستلام و التسليم' : 'Pickup & Dropoff Location'}
        </h3>
      </SeparatorWithContent>

      {isSameBranch ? (
        <InfoCard
          title={isArabic ? 'أستلام و تسليم في:' : 'Pickup and Drop-off at:'}
          description={fromBranch}
          locale={locale}
          image="/shared/carBranch.png"
        />
      ) : (
        <>
          <InfoCard
            title={isArabic ? 'أستلام في:' : 'Pickup at:'}
            description={fromBranch}
            locale={locale}
            image="/shared/carBranch.png"
          />
          <InfoCard
            title={isArabic ? 'تسليم في:' : 'Drop-off at:'}
            description={toBranch}
            locale={locale}
            image="/shared/carBranch.png"
          />
        </>
      )}
    </div>
  );
}

