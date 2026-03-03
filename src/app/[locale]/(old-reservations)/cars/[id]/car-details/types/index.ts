/**
 * Type definitions for car details booking
 */

import type { PricingData, BetterPriceData } from '@/constants/api';

export type WarningInfo = {
  title: string;
  message: string;
  type: 'extra_hours' | 'extra_day';
} | null;

export type { PricingData, BetterPriceData };

