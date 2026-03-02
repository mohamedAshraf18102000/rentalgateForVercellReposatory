/**
 * Formatters Utility
 * Date, time, and price formatting functions
 */

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export interface FormattedDateTime {
  date: string;
  time: string;
}

export function formatDateTime(dateString: string, isArabic: boolean): FormattedDateTime {
  const date = new Date(dateString);
  return {
    date: format(date, 'yyyy-MM-dd'),
    time: format(date, 'HH:mm', { locale: isArabic ? ar : undefined }),
  };
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

