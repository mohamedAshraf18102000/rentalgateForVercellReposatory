/**
 * CityPanel Component
 * Collapsible panel for city with nested branch panels
 */

'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { BranchPanel } from './BranchPanel';
import type { Branch } from '../types/branch.types';
import type { City } from '@/lib/api/types/shared.types';
import Image from 'next/image';

interface CityPanelProps {
  city: City;
  branches: Branch[];
  locale: string;
  isOpen: boolean;
  activeBranchId: number | null;
  onCityClick: (cityId: number) => void;
  onBranchClick: (branch: Branch) => void;
}

export const CityPanel: React.FC<CityPanelProps> = ({
  city,
  branches,
  locale,
  isOpen,
  activeBranchId,
  onCityClick,
  onBranchClick,
}) => {
  const cityName = locale === 'en' ? city.cityEnName : city.cityArName;

  return (
    <div className=" rounded-[16px] overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => onCityClick(city.cityId)}
        className={`w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-[#1A1A1A] hover:bg-gray-100 transition-colors   ${!isOpen ? 'bg-white' : 'bg-gray-100'}`}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <Image src="/shared/carBranch.png" alt={cityName} width={32} height={32} className="md:w-10 md:h-10" />
          <span className="font-semibold text-sm md:text-base">
            {locale === 'en' ? `Branches ${cityName}` : `فروع ${cityName}`}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
            }`}
        />
      </button>

      {isOpen && (
        <div className="bg-white px-3 md:px-4">
          {branches.length === 0 ? (
            <div className="px-3 md:px-4 py-4 md:py-6 text-center text-gray-400 text-xs md:text-sm">
              {locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          ) : (
            branches.map((branch, index) => (
              <div
                key={branch.branchId}
                className={`${index === branches.length - 1 ? 'pb-3 md:pb-4' : 'py-1'}`}
              >
                <BranchPanel
                  key={branch.branchId}
                  branch={branch}
                  locale={locale}
                  isActive={activeBranchId === branch.branchId}
                  onClick={onBranchClick}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CityPanel;

