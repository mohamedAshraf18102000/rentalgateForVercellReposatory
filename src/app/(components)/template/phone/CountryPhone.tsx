'use client';

import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import './phone.css';

interface CountryPhoneProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    defaultCountry?: string;
    showValidation?: boolean;
    className?: string;
    onValidationChange?: (isValid: boolean) => void;
    disabled?: boolean;
    label?: string;
    inputClassName?: string;
    labelClassName?: string;
    withoutValidations?: boolean;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

export default function CountryPhone({
    value,
    onChange,
    placeholder,
    defaultCountry = "sa",
    showValidation = false,
    className = "",
    onValidationChange,
    disabled = false,
    label,
    inputClassName = "",
    labelClassName = "",
    withoutValidations = false,
    onBlur
}: CountryPhoneProps) {
    const [phone, setPhone] = useState<string>(value || "");
    const [touched, setTouched] = useState<boolean>(false);
    const t = useTranslations('validation');

    // Sync with external value changes
    useEffect(() => {
        if (value !== phone) {
            setPhone(value || "");
        }
    }, [value, phone]);

    // التحقق من صحة الرقم مع دعم جميع الدول ودقة عالية للهواتف المصرية
    const isValid = useMemo(() => {
        // If validations are disabled, always return true
        if (withoutValidations) return true;

        // التأكد من أن phone هو string
        const phoneStr = String(phone || "");
        if (!phoneStr || phoneStr.length === 0) return false;

        // التحقق من أن الرقم يحتوي على رمز الدولة
        if (!phoneStr.startsWith("+")) return false;

        // التحقق الخاص للهواتف المصرية (أكثر دقة)
        const cleanPhone = phoneStr.replace(/\D/g, "");
        if (cleanPhone.startsWith("20")) {
            // التحقق من طول الرقم المصرية
            if (cleanPhone.length !== 12) return false;

            // التحقق من البادئات الصحيحة للهواتف المحمولة المصرية
            const mobilePrefix = cleanPhone.substring(2, 4);
            const validMobilePrefixes = ['10', '11', '12', '15'];

            // التحقق من الهواتف الأرضية المصرية
            const landlinePrefix = cleanPhone.substring(2, 3);

            const isMobile = validMobilePrefixes.includes(mobilePrefix);
            const isLandline = landlinePrefix === '2';

            if (!isMobile && !isLandline) return false;
        }

        // التحقق العام باستخدام libphonenumber-js
        try {
            return isValidPhoneNumber(phoneStr);
        } catch (error) {
            return false;
        }
    }, [phone]);

    // Get appropriate error message
    const getErrorMessage = (): string => {
        const phoneStr = String(phone || "");
        if (!phoneStr || phoneStr.length === 0) return t('AUTH_ERRORS.PHONE_REQUIRED');
        if (!phoneStr.startsWith("+")) return t('AUTH_ERRORS.PHONE_MUST_START_WITH_COUNTRY_CODE');
        if (phoneStr.length < 10) return t('AUTH_ERRORS.PHONE_TOO_SHORT');
        return t('AUTH_ERRORS.PHONE_INVALID_FORMAT');
    };

    // Send validation state to parent
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [isValid, onValidationChange]);

    const handlePhoneChange = (value: string) => {
        // Remove leading 0 after country code for Saudi Arabia (+966)
        let formattedValue = value;
        if (formattedValue && formattedValue.startsWith('+9660') && formattedValue.length > 5) {
            // +9660566830032 -> +966566830032
            formattedValue = '+966' + formattedValue.substring(5);
        }

        setPhone(formattedValue);
        // Mark as touched when user starts typing
        if (!touched && formattedValue.length > 0) {
            setTouched(true);
        }
        // Call parent onChange with the phone value
        if (onChange) {
            onChange(formattedValue);
        }
    };

    const handleBlur = () => {
        setTouched(true);
    };

    // Check if we should show error (only if touched and has content beyond country code and validation is not disabled)
    const shouldShowError = !withoutValidations && showValidation && touched && !isValid && phone && phone.length > 4;

    const phoneInput = (
        <div className={className} onBlur={(e) => {
            handleBlur();
            if (onBlur) onBlur(e);
        }}>
            <PhoneInput
                defaultCountry={defaultCountry}
                value={phone}
                onChange={handlePhoneChange}
                placeholder={placeholder}
                disabled={disabled}
                inputClassName={inputClassName}
            />

            {shouldShowError && (
                <p style={{
                    color: "rgb(255, 77, 79)",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "22px",
                    marginTop: "8px",
                    marginBottom: 0,
                    textAlign: "right"
                }}>
                    {getErrorMessage()}
                </p>
            )}
        </div>
    );

    // If no label, return phone input
    if (!label) {
        return phoneInput;
    }

    // With label (same structure as Input component)
    return (
        <div className="space-y-1.5 w-full">
            <label className={`text-sm font-medium text-foreground ${labelClassName}`}>
                {label}
            </label>
            <div className="mt-2">
                {phoneInput}
            </div>
        </div>
    );
}
