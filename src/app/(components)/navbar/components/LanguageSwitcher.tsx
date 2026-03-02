// ============================================================================
// Components - LanguageSwitcher
// ============================================================================

import React from 'react';
import { Button } from '@/ui';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUTTON_STYLES } from '../constants';

interface LanguageSwitcherProps {
  currentLocale: string;
  onToggle: () => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onToggle,
  className,
}) => (
  <Button
    onClick={onToggle}
    variant="outline"
    size="lg" 
    icon={<Globe className="w-4 h-4" />}
    className={cn(
      'border-none text-[13px] font-bold px-4 rounded-[20px] hover:bg-gray-100 transition-colors',
      className
    )}
  >
    {currentLocale === 'ar' ? 'English' : 'العربية'}
  </Button>
);

