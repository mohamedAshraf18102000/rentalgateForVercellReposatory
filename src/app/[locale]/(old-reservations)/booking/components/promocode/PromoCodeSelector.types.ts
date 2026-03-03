/**
 * Promo Code Selector Types
 * Types for the Promo Code Selector component
 */

export interface PromoCodeSelectorProps {
  locale: string;
  promoCode: string | null;
  onPromoCodeChange: (code: string | null) => void;
}


