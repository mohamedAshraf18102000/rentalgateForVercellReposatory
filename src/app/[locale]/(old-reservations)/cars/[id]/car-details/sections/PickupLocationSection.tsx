'use client';

import { InfoCard } from '@/app/(components)/template/InfoCard';
import { SeparatorWithContent } from '@/app/(components)/ui/separator-with-content';
import { LocationIcon } from '@/constants/icons';
import { useSharedStore } from '@/lib/api/stores/shared.store';
import { useValidationStore } from '@/lib/api/stores/validation.store';
import type { Branch } from '@/lib/api/types/shared.types';
import React, { useState } from 'react';
import { BranchSelectionModal } from '../modals/BranchSelectionModal';

interface PickupLocationSectionProps {
  pickupLocation: 'branch' | 'location';
  setPickupLocation: (location: 'branch' | 'location') => void;
  locale: string;
  t: (key: string) => string;
  carId: number;
}

export const PickupLocationSection: React.FC<PickupLocationSectionProps> = ({
  pickupLocation,
  setPickupLocation,
  locale,
  t,
  carId,
}) => {
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isDropoffModalOpen, setIsDropoffModalOpen] = useState(false);
  const [isSelectingCombined, setIsSelectingCombined] = useState(false);
  const { fromBranch, toBranch, setFromBranch, setToBranch } = useValidationStore();
  const { sharedData } = useSharedStore();

  // Get branch objects from IDs
  const pickupBranch = sharedData?.branch?.find(b => b.branchId === fromBranch) || null;
  const dropoffBranch = sharedData?.branch?.find(b => b.branchId === toBranch) || null;

  // Check if pickup and dropoff are the same branch
  // If no branch is selected (both null), show combined field (default)
  // If both are set and equal, show combined field
  // If different, show separate fields
  const isSameBranch = (fromBranch === null && toBranch === null) ||
    (fromBranch !== null && toBranch !== null && fromBranch === toBranch);

  // Handle combined branch selection (when same branch for pickup and dropoff)
  const handleCombinedBranchClick = () => {
    setPickupLocation('branch');
    setIsSelectingCombined(true);
    setIsPickupModalOpen(true);
  };

  // Handle separate pickup branch selection
  const handlePickupBranchClick = () => {
    setPickupLocation('branch');
    setIsSelectingCombined(false);
    setIsPickupModalOpen(true);
  };

  // Handle separate dropoff branch selection
  const handleDropoffBranchClick = () => {
    setPickupLocation('branch');
    setIsDropoffModalOpen(true);
  };

  // When selecting from combined field, set both to same branch
  const handleSelectCombinedBranch = (branch: Branch) => {
    setPickupLocation('branch');
    setFromBranch(branch.branchId);
    setToBranch(branch.branchId); // Always set to same branch when selecting from combined field
  };

  // When selecting pickup branch separately, only update pickup
  const handleSelectPickupBranch = (branch: Branch) => {
    setPickupLocation('branch');
    setFromBranch(branch.branchId);
    // Don't change toBranch if it's already different
  };

  // When selecting dropoff branch separately, only update dropoff
  const handleSelectDropoffBranch = (branch: Branch) => {
    setToBranch(branch.branchId);
  };

  return (
    <div className="mt-8 mb-8">
      <SeparatorWithContent>
        <h3 className="text-lg font-semibold text-gray-900 bg-white px-4">
          {t('pickupDropoffLocation')}
        </h3>
      </SeparatorWithContent>
      <div className="space-y-4">
        {isSameBranch ? (
          <>
            {/* Combined Pickup and Dropoff Branch */}
            <InfoCard
              title={locale === 'ar' ? (pickupBranch ? 'أستلام و تسليم في:' : 'فروعنا') : (pickupBranch ? 'Pickup and Drop-off at:' : 'Our Branches')}
              description={
                pickupBranch
                  ? locale === 'ar'
                    ? `${pickupBranch.branchArName} - ${sharedData?.city?.find(c => c.cityId === pickupBranch.cityId)?.cityArName || ''}`
                    : `${pickupBranch.branchName} - ${sharedData?.city?.find(c => c.cityId === pickupBranch.cityId)?.cityEnName || ''}`
                  : locale === 'ar'
                    ? 'حدد أقرب فرع مناسب لك'
                    : 'Select the nearest suitable branch for you'
              }
              onClick={handleCombinedBranchClick}
              isSelected={pickupLocation === 'branch' && !!fromBranch}
              locale={locale}
              image="/shared/carBranch.png"
            />

            {/* Change Dropoff Location Link - Only show if branch is selected */}
            {pickupBranch && (
              <button
                onClick={handleDropoffBranchClick}
                className={`flex items-center gap-2 text-[15px] hover:text-gray-600 text-[#1A1A1A] transition-colors underline truncate ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                <span>{locale === 'ar' ? 'تغيير مكان التسليم' : 'Change Drop-off Location'}</span>
                <LocationIcon />
              </button>
            )}
          </>
        ) : (
          <>
            {/* Separate Pickup Branch */}
            <InfoCard
              title={locale === 'ar' ? 'أستلام في:' : 'Pickup at:'}
              description={
                pickupBranch
                  ? locale === 'ar'
                    ? `${pickupBranch.branchArName} - ${sharedData?.city?.find(c => c.cityId === pickupBranch.cityId)?.cityArName || ''}`
                    : `${pickupBranch.branchName} - ${sharedData?.city?.find(c => c.cityId === pickupBranch.cityId)?.cityEnName || ''}`
                  : locale === 'ar'
                    ? 'اختر فرع الاستلام'
                    : 'Select pickup branch'
              }
              onClick={handlePickupBranchClick}
              isSelected={pickupLocation === 'branch' && !!fromBranch}
              locale={locale}
              image="/shared/carBranch.png"
            />

            {/* Separate Dropoff Branch */}
            <InfoCard
              title={locale === 'ar' ? 'تسليم في:' : 'Drop-off at:'}
              description={
                dropoffBranch
                  ? locale === 'ar'
                    ? `${dropoffBranch.branchArName} - ${sharedData?.city?.find(c => c.cityId === dropoffBranch.cityId)?.cityArName || ''}`
                    : `${dropoffBranch.branchName} - ${sharedData?.city?.find(c => c.cityId === dropoffBranch.cityId)?.cityEnName || ''}`
                  : locale === 'ar'
                    ? 'اختر فرع التسليم'
                    : 'Select drop-off branch'
              }
              onClick={handleDropoffBranchClick}
              isSelected={pickupLocation === 'branch' && !!toBranch}
              locale={locale}
              image="/shared/carBranch.png"
            />
          </>
        )}
        {/* TODO: إضافة موقع خاص بالعميل */}
      </div>

      <BranchSelectionModal
        open={isPickupModalOpen}
        onOpenChange={(open) => {
          setIsPickupModalOpen(open);
          if (!open) {
            setIsSelectingCombined(false);
          }
        }}
        selectedBranchId={fromBranch}
        onSelectBranch={isSelectingCombined ? handleSelectCombinedBranch : handleSelectPickupBranch}
        locale={locale}
        t={t}
        carId={carId}
      />

      <BranchSelectionModal
        open={isDropoffModalOpen}
        onOpenChange={setIsDropoffModalOpen}
        selectedBranchId={toBranch}
        onSelectBranch={handleSelectDropoffBranch}
        locale={locale}
        t={t}
        carId={carId}
      />
    </div>
  );
};

