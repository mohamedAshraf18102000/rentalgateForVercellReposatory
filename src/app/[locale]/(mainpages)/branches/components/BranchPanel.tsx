/**
 * BranchPanel Component
 * Individual collapsible panel for a single branch
 */

'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { BranchDetails } from './BranchDetails';
import type { Branch } from '../types/branch.types';

interface BranchPanelProps {
  branch: Branch;
  locale: string;
  isActive: boolean;
  onClick: (branch: Branch) => void;
}

export const BranchPanel: React.FC<BranchPanelProps> = ({
  branch,
  locale,
  isActive,
  onClick
}) => {
  const branchName = locale === 'en' ? branch.branchName : branch.branchArName;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(branch)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(branch);
        }
      }}
      className={`w-full flex flex-col items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-[12px] md:rounded-[16px] cursor-pointer ${isActive ? 'bg-[#ECEEF2]' : 'hover:bg-gray-100'} text-[#1A1A1A] transition-colors`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="font-medium text-xs md:text-sm">{branchName}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'transform rotate-180' : ''
            }`}
        />
      </div>
      {isActive && (
        <div className="mt-3 md:mt-4 w-full border-t border-[#D7DDE8]" onClick={(e) => e.stopPropagation()}>
          <BranchDetails branch={branch} locale={locale} />
        </div>
      )}
    </div>
  );
};

export default BranchPanel;

