// ============================================================================
// Components - LanguageSwitcher
// ============================================================================

import { cn } from '@/lib/utils';
import { Button } from '@/ui';
import { Globe } from 'lucide-react';
import React from 'react';

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
    icon={<Globe className="w-4 h-4 text-inherit" />}
    className={cn(
      'border-none    *[color:var(--primary)] px-4 rounded-[12px] hover:opacity-90 transition-opacity',
      'font-normal text-base leading-[130%] tracking-normal',
      '[font-family:var(--font-almarai),Almarai,sans-serif]',
      className
    )}
  >
    {currentLocale === 'ar' ? 'English' : 'العربية'}
  </Button>
);

