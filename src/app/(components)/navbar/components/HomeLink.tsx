// ============================================================================
// Components - HomeLink
// ============================================================================

import React from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { BUTTON_STYLES } from '../constants';

interface HomeLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  className?: string;
}

export const HomeLink: React.FC<HomeLinkProps> = ({ href, label, isActive, className }) => (
  <Link href={href}>
    <div
      className={cn(
        BUTTON_STYLES.homeLink,
        isActive ? BUTTON_STYLES.homeLinkActive : BUTTON_STYLES.homeLinkInactive
      )}
    >
      <span className={cn(className || BUTTON_STYLES.navLink, isActive && 'text-gray-800')}>
        {label}
      </span>
    </div>
  </Link>
);

