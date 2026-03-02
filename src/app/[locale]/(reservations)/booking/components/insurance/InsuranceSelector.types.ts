/**
 * Insurance Selector Types
 * Types for the Insurance Selector component
 */

export interface InsuranceSelectorProps {
  locale: string;
  insurancePrice: number;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

