import type { ReservationProfileLockableField } from "@/lib/utils/mapUserProfileToReservationForm";

export type ProfileIdentityFieldConfig = {
  name: Extract<
    ReservationProfileLockableField,
    "personalId" | "passportNumber" | "borderNumber"
  >;
  residenceTypes: string[];
  inputType?: "number" | "text";
  labelKey: string;
  placeholderKey: string;
};

export const PROFILE_IDENTITY_FIELD_CONFIG: ProfileIdentityFieldConfig[] = [
  {
    name: "personalId",
    residenceTypes: ["0", "1"],
    inputType: "number",
    labelKey: "fields.personalId.label",
    placeholderKey: "fields.personalId.placeholder",
  },
  {
    name: "passportNumber",
    residenceTypes: ["2"],
    labelKey: "fields.passportNumber.label",
    placeholderKey: "fields.passportNumber.placeholder",
  },
  {
    name: "borderNumber",
    residenceTypes: ["3"],
    inputType: "number",
    labelKey: "fields.borderNumber.label",
    placeholderKey: "fields.borderNumber.placeholder",
  },
];

export const shouldShowProfileIdentityField = (
  config: ProfileIdentityFieldConfig,
  residenceType?: string,
): boolean =>
  residenceType != null && config.residenceTypes.includes(residenceType);
