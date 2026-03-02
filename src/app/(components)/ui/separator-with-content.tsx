import React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorWithContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'mt-2' | 'mt-6' | 'mb-6' | 'my-6' | string;
}

const SeparatorWithContent: React.FC<SeparatorWithContentProps> = ({ 
  children, 
  className,
  spacing = 'mb-6'
}) => {
  return (
    <div className={cn('relative', spacing, className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        {children}
      </div>
    </div>
  );
};

export { SeparatorWithContent };

