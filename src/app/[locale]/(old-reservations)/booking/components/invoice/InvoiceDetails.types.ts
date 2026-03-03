/**
 * Invoice Details Types
 * Types for the Invoice Details component
 */

import type { PricingData } from '@/constants/api';

export interface InvoiceDetailsProps {
  pricingData: PricingData;
  locale: string;
  formatPrice: (price: number) => string;
}

