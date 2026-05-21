import { Input, PhoneInput } from "@/app/(components)";
import {
  isReservationProfileFieldLocked,
  type LockedReservationProfileFields,
  type ReservationProfileLockableField,
} from "@/lib/utils/mapUserProfileToReservationForm";
import { UpdateUserReservationProfileFormValues } from "@/lib/validations/updateUserReservationProfileSchema";
import { Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface UserDetailsFormProps {
  control: Control<UpdateUserReservationProfileFormValues>;
  errors: FieldErrors<UpdateUserReservationProfileFormValues>;
  getErrorMessage: (message?: string) => string | undefined;
  disabled?: boolean;
  lockedFields?: LockedReservationProfileFields;
}

const UserDetailsForm = ({
  control,
  errors,
  getErrorMessage,
  disabled = false,
  lockedFields = {},
}: UserDetailsFormProps) => {
  const t = useTranslations("profile.profilePage");
  const isFieldDisabled = (field: ReservationProfileLockableField) =>
    disabled || isReservationProfileFieldLocked(lockedFields, field);

  return (
    <div className="grid grid-cols-1 gap-5 mt-1 md:grid-cols-2">
      <Controller
        name="fullName"
        control={control}
        render={({ field: { value, onChange, onBlur, name, ref } }) => (
          <Input
            ref={ref}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            required
            disabled={disabled}
            label={t("nameLabel")}
            startIcon={<User className="size-4" />}
            placeholder={t("nameLabel")}
            errorMessage={getErrorMessage(errors.fullName?.message)}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field: { value, onChange, onBlur, name, ref } }) => (
          <Input
            ref={ref}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            required
            type="email"
            disabled={isFieldDisabled("email")}
            label={t("emailLabel")}
            startIcon={<Mail className="size-4" />}
            placeholder={t("emailLabel")}
            errorMessage={getErrorMessage(errors.email?.message)}
          />
        )}
      />

      <Controller
        name="mobile"
        control={control}
        render={({ field: { value, onChange, onBlur, name, ref } }) => (
          <PhoneInput
            className={isFieldDisabled("mobile") ? "opacity-50" : ""}
            ref={ref}
            name={name}
            value={value ?? ""}
            onChange={(phone) => onChange(phone ?? "")}
            onBlur={onBlur}
            required
            disabled={isFieldDisabled("mobile")}
            label={t("phoneLabel")}
            placeholder={t("phoneLabel")}
            errorMessage={getErrorMessage(errors.mobile?.message)}
          />
        )}
      />
    </div>
  );
};

export default UserDetailsForm;
