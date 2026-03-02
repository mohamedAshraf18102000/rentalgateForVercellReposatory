// ============================================================================
// Components - UserMenu
// ============================================================================

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { LogOut, User, ChevronDown, Car } from 'lucide-react';
import { BUTTON_STYLES } from '../constants';
import type { ClientData } from '@/lib/api/types';
import { getUserDisplayName } from '../utils';
import { useLocale } from 'next-intl';

interface UserMenuProps {
  userData: ClientData | null;
  isLoading?: boolean;
  onLogout: () => void;
  onProfileClick: () => void;
  onBookingsClick: () => void;
  translations: {
    profile: string;
    myBookings: string;
    logout: string;
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({
  userData,
  isLoading = false,
  onLogout,
  onProfileClick,
  onBookingsClick,
  translations,
}) => {
  const displayName = getUserDisplayName(userData);
  const firstName = displayName.split(' ')[0]; // Get only the first word
  const userImage = userData?.image;
  const [imageError, setImageError] = React.useState(false);
  const locale = useLocale();

  // Show skeleton while loading
  if (isLoading || !userData) {
    return (
      <div className={BUTTON_STYLES.userButton} aria-label="Loading user menu">
        <div className="w-16 h-4 bg-white/30 rounded animate-pulse" />
        <div className="w-6 h-6 rounded-full bg-white/30 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className={BUTTON_STYLES.userButton}>
          <span>{firstName}</span>
          {userImage && !imageError ? (
            <img 
              src={userImage} 
              alt={displayName}
              className="w-6 h-6 rounded-full object-cover"
              onError={() => setImageError(true)}
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          {/* <ChevronDown className="w-4 h-4" /> */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[176px] rounded-[20px] mt-[12px] px-[16px] py-[12px]"  dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <DropdownMenuItem onClick={onProfileClick} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 hover:text-primary">
          <User className="w-4 h-4" />
          <span>{translations.profile}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onBookingsClick} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 hover:text-primary">
          <Car className="w-4 h-4" />
          <span>{translations.myBookings}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} variant="destructive" className="flex items-center gap-2 cursor-pointe hover:bg-[#FFC0C2] hover:text-[#4E0204] cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>{translations.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

