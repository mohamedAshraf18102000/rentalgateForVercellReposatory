// ============================================================================
// Components - WhatsAppLink
// ============================================================================

import React from 'react';
import { Link } from '@/i18n/routing';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BUTTON_STYLES } from '../constants';
import { cn } from '@/lib/utils';

interface WhatsAppLinkProps {
  url: string;
  label: string;
  className?: string;
}

export const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({ url, label, className }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <div className={cn(
      BUTTON_STYLES.homeLink,
      BUTTON_STYLES.homeLinkInactive,
      "gap-1"
    )}>
      <span className={cn(className || BUTTON_STYLES.navLink)}>
        {label}
      </span>
      <WhatsAppIcon />
    </div>
  </a>
);

