'use client';

/**
 * Promo Code Selector Component
 * Allows users to enter and apply a discount code for their booking
 */

import React, { useState, useMemo } from 'react';
import { InfoCard } from '@/app/(components)/template/InfoCard';
import { DialogWrapper } from '@/app/(components)/ui/dialog-wrapper';
import { Input } from '@/app/(components)/ui/input';
import { Button } from '@/app/(components)/ui/button';
import type { PromoCodeSelectorProps } from './PromoCodeSelector.types';

export const PromoCodeSelector: React.FC<PromoCodeSelectorProps> = ({
    locale,
    promoCode,
    onPromoCodeChange,
}) => {
    const [inputValue, setInputValue] = useState(promoCode || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleApply = () => {
        onPromoCodeChange(inputValue.trim() || null);
        setIsDialogOpen(false);
    };

    const handleCancel = () => {
        setInputValue(promoCode || '');
        setIsDialogOpen(false);
    };

    return (
        <div className="mt-6">
            <DialogWrapper
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                size="md"
                header={{
                    mainTitle: locale === 'ar' ? 'إضافة كود خصم' : 'Add Discount Code',
                }}
                content={
                    <div className="space-y-4">
                        <div> 
                            <Input
                                type="text"
                                label={locale === 'ar' ? 'أدخل كود الخصم:' : 'Enter discount code:'}
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder={locale === 'ar' ? 'أدخل كود الخصم' : 'Enter discount code'}
                                className="bg-white border-gray-300 focus:border-primary"
                                size="md"
                            />
                        </div>
                    </div>
                }
                footer={
                    <Button
                        onClick={handleApply}
                        className="w-full mt-4"
                        size="lg"
                    >
                        {locale === 'ar' ? 'تطبيق' : 'Apply'}
                    </Button>
                }
                trigger={
                    <div>
                        <InfoCard
                            title={locale === 'ar' ? 'إضافة كود خصم' : 'Add Discount Code'}
                            description={
                                locale === 'ar'
                                    ? 'استخدم الكود الآن وتمتع بخصم مميز'
                                    : 'Use the code now and enjoy a special discount'
                            }
                            image='/shared/promoCode.png'
                            locale={locale}
                            onClick={() => setIsDialogOpen(true)}
                        />
                    </div>
                }
            />
        </div>
    );
};

