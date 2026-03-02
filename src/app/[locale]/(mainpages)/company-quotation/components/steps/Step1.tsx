import { Controller, Control, FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/app/(components)/ui/input";
import { FormData } from "../../hooks/useFormCookies";
import { getValidationMessages } from "../../utils/validation";

interface Step1Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isRTL: boolean;
  onFieldChange: (field: keyof FormData, value: any) => void;
}

export function Step1({ control, errors, isRTL, onFieldChange }: Step1Props) {
  const t = useTranslations("companyQuotation");
  const validationMessages = getValidationMessages(isRTL);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Company Name */}
      <div className="space-y-2">
        <Controller
          name="companyName"
          control={control}
          rules={{
            required: validationMessages.companyName.required,
            minLength: {
              value: 2,
              message: validationMessages.companyName.minLength,
            },
          }}
          render={({ field }) => (
            <>
              <Input
                label={t("step1.fields.companyName")}
                id="companyName"
                placeholder={t("step1.placeholders.companyName")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onFieldChange("companyName", value);
                }}
                onBlur={field.onBlur}
                size="lg"
                className="w-full"
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Activity */}
      <div className="space-y-2">
        <Controller
          name="activity"
          control={control}
          rules={{
            required: validationMessages.activity.required,
            minLength: {
              value: 2,
              message: validationMessages.activity.minLength,
            },
          }}
          render={({ field }) => (
            <>
              <Input
                label={t("step1.fields.activity")}
                id="activity"
                placeholder={t("step1.placeholders.activity")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onFieldChange("activity", value);
                }}
                onBlur={field.onBlur}
                size="lg"
                className="w-full"
              />
              {errors.activity && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.activity.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Controller
          name="city"
          control={control}
          rules={{
            required: validationMessages.city.required,
            minLength: {
              value: 2,
              message: validationMessages.city.minLength,
            },
          }}
          render={({ field }) => (
            <>
              <Input
                label={t("step1.fields.city")}
                id="city"
                placeholder={t("step1.placeholders.city")}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  onFieldChange("city", value);
                }}
                onBlur={field.onBlur}
                size="lg"
                className="w-full"
              />
              {errors.city && (
                <p className="text-xs text-red-500 font-normal mt-1">
                  {errors.city.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}

