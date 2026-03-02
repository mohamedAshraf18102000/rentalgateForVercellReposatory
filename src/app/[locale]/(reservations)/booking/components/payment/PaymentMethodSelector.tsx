'use client';

/**
 * Payment Method Selector Component
 * Allows users to select their preferred payment method (Card or Cash)
 */

import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { RadioGroup } from '@/app/(components)/ui/radio-group';
import { cn } from '@/lib/utils';
import { CreditCardIcon, BanknoteIcon } from '@/constants/icons';
import type { PaymentMethodSelectorProps, PaymentMethod } from './PaymentMethodSelector.types';

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    selectedMethod,
    onMethodChange,
    locale,
}) => {
    const isArabic = locale === 'ar';

    return (
        <div className="mt-6" dir={isArabic ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isArabic ? 'حدد طريقة الدفع:' : 'Select payment method:'}
            </h3>
            <div className="bg-[#ECEEF2] rounded-lg px-4 py-3">
                <RadioGroup value={selectedMethod || ''} onValueChange={(value) => onMethodChange(value as PaymentMethod)}>
                    <div className="flex flex-col gap-3">
                        {/* بطاقة - Card */}
                        <label
                            htmlFor="payment-card"
                            className={cn(
                                "flex items-center justify-between cursor-pointer ",
                                isArabic ? 'flex-row-reverse' : '',
                                selectedMethod !== 'cash' ? '   ' : ''
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[16px] font-bold text-gray-900">
                                    {isArabic ? 'بطاقة' : 'Card'}
                                </span>
                                <RadioGroupPrimitive.Item
                                    value="card"
                                    id="payment-card"
                                    className={cn(
                                        "aspect-square size-4 shrink-0 rounded-full border border-primary bg-white transition-all outline-none",
                                        "data-[state=checked]:border-primary data-[state=checked]:bg-white"
                                    )}
                                >
                                    <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                    </RadioGroupPrimitive.Indicator>
                                </RadioGroupPrimitive.Item>
                            </div>
                            <CreditCardIcon width={20} height={20} className="text-gray-900" />

                        </label>
                        <hr className="border-gray-300 my-0" />
                        {/* كاش في الفرع - Cash at branch */}
                        <label
                            htmlFor="payment-cash"
                            className={cn(
                                "flex items-center justify-between cursor-pointer ",
                                isArabic ? 'flex-row-reverse' : ''
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[16px] font-bold text-gray-900">
                                    {isArabic ? 'كاش في الفرع' : 'Cash at branch'}
                                </span>
                                <RadioGroupPrimitive.Item
                                    value="cash"
                                    id="payment-cash"
                                    className={cn(
                                        "aspect-square size-4 shrink-0 rounded-full border border-primary bg-white transition-all outline-none",
                                        "data-[state=checked]:border-primary data-[state=checked]:bg-white"
                                    )}
                                >
                                    <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                    </RadioGroupPrimitive.Indicator>
                                </RadioGroupPrimitive.Item>
                            </div>

                            <BanknoteIcon width={20} height={20} className="text-gray-900" />
                        </label>

                    </div>
                </RadioGroup>
            </div>
        </div>
    );
};

