'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/(components)/ui/button';
import { SeparatorWithContent } from '@/app/(components)/ui/separator-with-content';

export interface FilterSectionTriggerProps {
    /** عنوان القسم (مثل: نوع السيارة، السعر) */
    title: string;
    /** هل القسم مفتوح؟ (يُستخدم فقط عند وجود onToggle) */
    isOpen?: boolean;
    /** عند التوفّر: يعرض زر قابل للطي مع السهم. عند الغياب: يعرض عنواناً ثابتاً مع خطوط */
    onToggle?: () => void;
    /** مسافة الـ Separator (مثل: mt-4 sm:mt-6) */
    spacing?: string;
    /** للاتجاه: عربي = السهم بعد النص، إنجليزي = السهم قبل النص */
    isRTL?: boolean;
}

/**
 * مكوّن ثابت لإعادة الاستخدام: عنوان قسم مع خط فاصل.
 * - مع onToggle: زر يفتح/يغلق مع سهم (نفس شكل SpecificationsSection).
 * - بدون onToggle: عنوان ثابت مع خطين على الجانبين فقط.
 */
export function FilterSectionTrigger({
    title,
    isOpen = false,
    onToggle,
    spacing = 'mt-4 sm:mt-6',
    isRTL = false,
}: FilterSectionTriggerProps) {
    if (onToggle != null) {
        return (
            <SeparatorWithContent spacing={spacing}>
                <Button
                    variant="ghost"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A1A1A] hover:bg-gray-50"
                    onClick={onToggle}
                >
                    {isOpen ? (
                        <span className="flex items-center gap-2">
                            {!isRTL && <ChevronUp className="w-4 h-4" />}
                            {title}
                            {isRTL && <ChevronUp className="w-4 h-4" />}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {!isRTL && <ChevronDown className="w-4 h-4" />}
                            {title}
                            {isRTL && <ChevronDown className="w-4 h-4" />}
                        </span>
                    )}
                </Button>
            </SeparatorWithContent>
        );
    }

    return (
        <div className={`flex items-center justify-center gap-3 mb-5 ${spacing}`}>
            <div className="flex-1 h-px bg-[#D7DDE8]" />
            <h4 className="text-center font-semibold text-gray-900 whitespace-nowrap">
                {title}
            </h4>
            <div className="flex-1 h-px bg-[#D7DDE8]" />
        </div>
    );
}
