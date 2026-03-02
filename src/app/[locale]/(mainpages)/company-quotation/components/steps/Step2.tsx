import { Controller, Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/app/(components)/ui/input";
import CountryPhone from "@/app/(components)/template/phone/CountryPhone";
import { FormData } from "../../hooks/useFormCookies";
import { getValidationMessages, validatePhone } from "../../utils/validation";

interface Step2Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isRTL: boolean;
  phoneValid: boolean;
  onPhoneValidChange: (valid: boolean) => void;
  onFieldChange: (field: keyof FormData, value: any) => void;
}

export function Step2({
  control,
  errors,
  isRTL,
  phoneValid,
  onPhoneValidChange,
  onFieldChange,
}: Step2Props) {
  const t = useTranslations("companyQuotation");
  const validationMessages = getValidationMessages(isRTL);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Responsible Name */}
      <div className="space-y-2">
        <Controller
          name="responsibleName"
          control={control}
          rules={{
            required: validationMessages.responsibleName.required,
            minLength: {
              value: 2,
              message: validationMessages.responsibleName.minLength,
            },
          }}
          render={({ field }) => (
            <>
              <Input
                label={t("step2.fields.name")}
                id="responsibleName"
                placeholder={t("step2.placeholders.name")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onFieldChange("responsibleName", value);
                }}
                onBlur={field.onBlur}
                size="lg"
                className="w-full"
              />
              {errors.responsibleName && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.responsibleName.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Controller
          name="phone"
          control={control}
          rules={{
            required: validationMessages.phone.required,
            validate: (value) => {
              if (!value) return validationMessages.phone.required;
              if (!validatePhone(value)) {
                return validationMessages.phone.invalid;
              }
              return true;
            },
          }}
          render={({ field }) => (
            <>
              <CountryPhone
                label={t("step2.fields.phone")}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  const isValid = validatePhone(value);
                  onPhoneValidChange(isValid);
                  onFieldChange("phone", value);
                }}
                placeholder={isRTL ? "5xxxxxxxx" : "5xxxxxxxx"}
                defaultCountry="sa"
                showValidation={true}
                className="w-full"
                onValidationChange={onPhoneValidChange}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.phone.message}
                </p>
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
            required: validationMessages.email.required,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: validationMessages.email.invalid,
            },
          }}
          render={({ field }) => (
            <>
              <Input
                label={t("step2.fields.email")}
                id="email"
                type="email"
                placeholder={t("step2.placeholders.email")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onFieldChange("email", value);
                }}
                onBlur={field.onBlur}
                size="lg"
                className="w-full"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.email.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}

