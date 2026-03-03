/**
 * Payment Method Selector Types
 * Types for the Payment Method Selector component
 */

export type PaymentMethod = 'card' | 'cash' | null;

export interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
    locale: string;
}

