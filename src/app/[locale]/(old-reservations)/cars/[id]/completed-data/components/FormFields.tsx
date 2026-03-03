/**
 * Form Fields Component
 * Renders all form fields except identity-specific fields
 */

'use client';

import { Controller, Control, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { Input, Label, RadioGroupWithOptions, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui';
import { SimpleDatePicker } from '../util/SimpleDatePicker';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    validateBirthdate,
    validateLicenseExpiration,
    validateLicenseNumber,
    validateEmailField,
    validateMobile,
    validateNationality,
} from '../util/validation';
import { NATIONALITY_OPTIONS } from '../util/constants';
import type { FormData } from '../util/types';

interface FormFieldsProps {
    locale: string;
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    trigger: UseFormTrigger<FormData>;
    clientType: 'CITIZEN' | 'RESIDENT' | 'VISITOR';
    setValue: (name: keyof FormData, value: any) => void;
    isMobileDisabled: boolean;
    isEmailDisabled: boolean;
    watch: (name: keyof FormData) => any;
}

export function FormFields({
    locale,
    control,
    errors,
    trigger,
    clientType,
    setValue,
    isMobileDisabled,
    isEmailDisabled,
    watch,
}: FormFieldsProps) {
    const t = useTranslations('carDetails');
    const [licenseImagePreview, setLicenseImagePreview] = useState<string | null>(null);
    const licenseNumber = watch('licenseNumber');
    const nationality = watch('nationality');

    // Reset preview when licenseNumber is cleared
    useEffect(() => {
        if (!licenseNumber || typeof licenseNumber !== 'object') {
            setLicenseImagePreview(null);
        }
    }, [licenseNumber]);

    // Auto-set nationality to Saudi when clientType is CITIZEN
    useEffect(() => {
        if (clientType === 'CITIZEN' && nationality !== 'Saudi') {
            setValue('nationality', 'Saudi');
            trigger('nationality');
        }
    }, [clientType, nationality, setValue, trigger]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | null) => void, setValue: (name: keyof FormData, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return;
            }
            // Save file to licenseNumber field
            setValue('licenseNumber', file);
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLicenseImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {/* Identity Type */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('identity_type')}</Label>
                <div className="mt-4 w-full">
                    <Controller
                        name="clientType"
                        control={control}
                        render={({ field }) => (
                            <RadioGroupWithOptions
                                value={field.value}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setValue('nationalId', '');
                                    setValue('copyNum', '');
                                    // Auto-set nationality to Saudi when CITIZEN is selected
                                    if (value === 'CITIZEN') {
                                        setValue('nationality', 'Saudi');
                                        trigger('nationality');
                                    }
                                }}
                                options={[
                                    { value: 'VISITOR', label: t('visitor') },
                                    { value: 'RESIDENT', label: t('resident') },
                                    { value: 'CITIZEN', label: t('citizen') },
                                ]}
                                className="flex gap-4"
                                itemClassName="flex-1"
                            />
                        )}
                    />
                </div>
            </div>

            {/* License Image Upload */}
            <div className="space-y-2 mt-2">
                <Label className="text-sm font-medium"> {locale === 'ar' ? 'صورة الرخصة' : 'License Image'}</Label>
                <div className="mt-3 w-full">
                    <Controller
                        name="licenseNumber"
                        control={control}
                        render={({ field }) => (
                            <>
                                <div className="border border-dashed border-gray-300 rounded-lg px-4 py-[30px] text-center hover:border-primary transition-colors bg-[#ECEEF2]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, field.onChange, setValue)}
                                        className="hidden"
                                        id="license-image-upload"
                                    />
                                    <label
                                        htmlFor="license-image-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        {licenseImagePreview ? (
                                            <div className="relative w-full h-[150px] mx-auto mb-3">
                                                <Image
                                                    src={licenseImagePreview}
                                                    alt="License preview"
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-[56px] h-[56px] bg-white border border-[#D6D6D6] shadow-[0px_4px_13.6px_0px_#0D3FAA0D] rounded-[14px] flex items-center justify-center mb-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14 3.5H10C6.22876 3.5 4.34315 3.5 3.17157 4.67157C2 5.84315 2 7.72876 2 11.5V12.5C2 16.2712 2 18.1569 3.17157 19.3284C4.34315 20.5 6.22876 20.5 10 20.5H14C17.7712 20.5 19.6569 20.5 20.8284 19.3284C22 18.1569 22 16.2712 22 12.5V11.5C22 7.72876 22 5.84315 20.8284 4.67157C19.6569 3.5 17.7712 3.5 14 3.5Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
                                                    <path d="M5 16C6.03569 13.4189 9.89616 13.2491 11 16" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M9.75 9.75C9.75 10.7165 8.9665 11.5 8 11.5C7.0335 11.5 6.25 10.7165 6.25 9.75C6.25 8.7835 7.0335 8 8 8C8.9665 8 9.75 8.7835 9.75 9.75Z" stroke="#1A1A1A" strokeWidth="1.5" />
                                                    <path d="M14 8.5H19M14 12H19M14 15.5H16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className="text-sm text-[#595959]">
                                            {locale === 'ar' ? 'اضغط لرفع صورة الرخصة' : 'Click to upload license image'}
                                        </span>
                                    </label>
                                </div>
                                {errors.licenseNumber && (
                                    <p className="text-xs text-red-500 font-normal-medium mt-2">{errors.licenseNumber.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>
            
            {/* Birthdate */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('birthdate')}</Label>
                <div className="mt-3 w-full">
                    <Controller
                        name="birthdate"
                        control={control}
                        rules={{
                            validate: (value) => {
                                const validation = validateBirthdate(value);
                                return validation.valid || validation.error || 'Invalid birthdate';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <SimpleDatePicker
                                    locale={locale}
                                    value={field.value || null}
                                    onChange={(date) => {
                                        field.onChange(date || undefined);
                                        trigger('birthdate');
                                    }}
                                    placeholder={t('select_date')}
                                    dialogTitle={t('birthdate')}
                                    className="w-full"
                                    allowPastOnly={true}
                                />
                                {errors.birthdate && (
                                    <p className="text-xs text-red-500 font-normal-medium mt-2">{errors.birthdate.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>

            {/* License Expiration */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('license_expiration')}</Label>
                <div className="mt-3 w-full">
                    <Controller
                        name="licenseExpiration"
                        control={control}
                        rules={{
                            validate: (value) => {
                                const validation = validateLicenseExpiration(value);
                                return validation.valid || validation.error || 'Invalid license expiration';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <SimpleDatePicker
                                    locale={locale}
                                    value={field.value || null}
                                    onChange={(date) => {
                                        field.onChange(date || undefined);
                                        trigger('licenseExpiration');
                                    }}
                                    placeholder={t('select_date')}
                                    dialogTitle={t('license_expiration')}
                                    className="w-full"
                                    allowFutureOnly={true}
                                />
                                {errors.licenseExpiration && (
                                    <p className="text-xs text-red-500 font-normal-medium mt-2">{errors.licenseExpiration.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('gender')}</Label>
                <div className="mt-4 w-full">
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <RadioGroupWithOptions
                                value={field.value}
                                onValueChange={field.onChange}
                                options={[
                                    { value: 'FEMALE', label: t('female') },
                                    { value: 'MALE', label: t('male') },
                                ]}
                                className="flex gap-4"
                                itemClassName="flex-1"
                            />
                        )}
                    />
                </div>
            </div>

            {/* Nationality */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">{t('nationality')}</Label>
                <div className="mt-3 w-full">
                    <Controller
                        name="nationality"
                        control={control}
                        rules={{
                            validate: (value) => {
                                // Skip validation if field is disabled (CITIZEN)
                                if (clientType === 'CITIZEN') {
                                    return true;
                                }
                                const validation = validateNationality(value);
                                return validation.valid || validation.error || 'Nationality is required';
                            },
                        }}
                        render={({ field }) => (
                            <>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        trigger('nationality');
                                    }}
                                    disabled={clientType === 'CITIZEN'}
                                >
                                    <SelectTrigger className="w-full" size="lg">
                                        <SelectValue placeholder={locale === 'ar' ? 'اختر الجنسية' : 'Select nationality'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NATIONALITY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.nationality && clientType !== 'CITIZEN' && (
                                    <p className="text-xs text-red-500 font-normal-medium mt-2">{errors.nationality.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
                <Controller
                    name="mobile"
                    control={control}
                    rules={{
                        validate: (value) => {
                            // Skip validation if field is disabled
                            if (isMobileDisabled) {
                                return true;
                            }
                            const validation = validateMobile(value);
                            return validation.valid || validation.error || 'Mobile is required';
                        },
                    }}
                    render={({ field }) => (
                        <>
                            <Input
                                label={t('mobile')}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    trigger('mobile');
                                }}
                                onBlur={(e) => {
                                    field.onBlur();
                                    trigger('mobile');
                                }}
                                placeholder={t('mobile')}
                                className="w-full"
                                disabled={isMobileDisabled}
                            />
                            {errors.mobile && !isMobileDisabled && (
                                <p className="text-xs text-red-500 font-normal-medium">{errors.mobile.message}</p>
                            )}
                        </>
                    )}
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        validate: (value) => {
                            // Skip validation if field is disabled
                            if (isEmailDisabled) {
                                return true;
                            }
                            const validation = validateEmailField(value);
                            return validation.valid || validation.error || 'Email is required';
                        },
                    }}
                    render={({ field }) => (
                        <>
                            <Input
                                label={t('email')}
                                type="email"
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    trigger('email');
                                }}
                                onBlur={(e) => {
                                    field.onBlur();
                                    trigger('email');
                                }}
                                placeholder={t('enter_email')}
                                className="w-full"
                                disabled={isEmailDisabled}
                            />
                            {errors.email && !isEmailDisabled && (
                                <p className="text-xs text-red-500 font-normal-medium">{errors.email.message}</p>
                            )}
                        </>
                    )}
                />
            </div>



        </>
    );
}

