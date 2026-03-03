/**
 * Identity Fields Component
 * Renders identity-specific fields based on client type (CITIZEN, RESIDENT, VISITOR)
 */

'use client';

import { Controller, Control, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { Input } from '@/ui';
import { useTranslations } from 'next-intl';
import {
    validateCitizenNationalId,
    validateResidentId,
    validateCopyNum,
} from '../util/validation';
import type { FormData } from '../util/types';

interface IdentityFieldsProps {
    clientType: 'CITIZEN' | 'RESIDENT' | 'VISITOR';
    locale: string;
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    trigger: UseFormTrigger<FormData>;
}

export function IdentityFields({ clientType, locale, control, errors, trigger }: IdentityFieldsProps) {
    const t = useTranslations('carDetails');

    if (clientType === 'CITIZEN') {
        return (
            <>
                <div className="space-y-2">
                    <Controller
                        name="nationalId"
                        control={control}
                        rules={{
                            required: 'رقم الهوية مطلوب',
                            validate: (value) => {
                                if (!value) return true;
                                const validation = validateCitizenNationalId(value);
                                return validation.valid || validation.error || 'Invalid ID';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <Input
                                    label={locale === 'ar' ? 'رقم الهوية' : 'National ID'}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        trigger('nationalId');
                                    }}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        trigger('nationalId');
                                    }}
                                    placeholder={t('enter_id_number')}
                                    className="w-full"
                                />
                                {errors.nationalId && (
                                    <p className="text-xs text-red-500 font-normal-medium">{errors.nationalId.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Controller
                        name="copyNum"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (!value) return true;
                                const validation = validateCopyNum(value);
                                return validation.valid || validation.error || 'Invalid copy number';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <Input
                                    label={locale === 'ar' ? 'رقم النسخة' : 'Copy Number'}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        trigger('copyNum');
                                    }}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        trigger('copyNum');
                                    }}
                                    placeholder={t('enter_copy_num')}
                                    className="w-full"
                                />
                                {errors.copyNum && (
                                    <p className="text-xs text-red-500 font-normal-medium">{errors.copyNum.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </>
        );
    }

    if (clientType === 'RESIDENT') {
        return (
            <>
                <div className="space-y-2">
                    <Controller
                        name="nationalId"
                        control={control}
                        rules={{
                            required: 'رقم الإقامة مطلوب',
                            validate: (value) => {
                                if (!value) return true;
                                const validation = validateResidentId(value);
                                return validation.valid || validation.error || 'Invalid ID';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <Input
                                    label={locale === 'ar' ? 'رقم الإقامة' : 'Residence ID'}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        trigger('nationalId');
                                    }}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        trigger('nationalId');
                                    }}
                                    placeholder={locale === 'ar' ? 'ادخل رقم الإقامة' : 'Enter residence ID'}
                                    className="w-full"
                                />
                                {errors.nationalId && (
                                    <p className="text-xs text-red-500 font-normal-medium">{errors.nationalId.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Controller
                        name="copyNum"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (!value) return true;
                                const validation = validateCopyNum(value);
                                return validation.valid || validation.error || 'Invalid copy number';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <Input
                                    label={locale === 'ar' ? 'رقم النسخة' : 'Copy Number'}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        trigger('copyNum');
                                    }}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        trigger('copyNum');
                                    }}
                                    placeholder={t('enter_copy_num')}
                                    className="w-full"
                                />
                                {errors.copyNum && (
                                    <p className="text-xs text-red-500 font-normal-medium">{errors.copyNum.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </>
        );
    }

    if (clientType === 'VISITOR') {
        return (
            <div className="space-y-2">
                <Controller
                    name="nationalId"
                    control={control}
                    rules={{
                        required: 'رقم الهوية مطلوب',
                    }}
                    render={({ field }) => (
                        <>
                            <Input
                                label={locale === 'ar' ? 'رقم الهوية' : 'National ID'}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    trigger('nationalId');
                                }}
                                onBlur={(e) => {
                                    field.onBlur();
                                    trigger('nationalId');
                                }}
                                placeholder={t('enter_id_number')}
                                className="w-full"
                            />
                            {errors.nationalId && (
                                <p className="text-xs text-red-500 font-normal-medium">{errors.nationalId.message}</p>
                            )}
                        </>
                    )}
                />
            </div>
        );
    }

    return null;
}



