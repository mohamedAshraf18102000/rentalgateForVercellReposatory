import type { ClientData } from "@/lib/api/types/client.types";
import type { UpdateUserReservationProfileFormValues } from "@/lib/validations/updateUserReservationProfileSchema";

export type ReservationProfileLockableField = keyof Pick<
  UpdateUserReservationProfileFormValues,
  "idNumber" | "nationality" | "personalId" | "passportNumber" | "borderNumber"
>;

export type LockedReservationProfileFields = Partial<
  Record<ReservationProfileLockableField, boolean>
>;

export const hasExistingProfileStringValue = (value: unknown): boolean => {
  if (value == null) return false;
  if (typeof value === "number") return !Number.isNaN(value);
  return String(value).trim() !== "";
};

export const getNationalityValue = (
  nationality: ClientData["nationality"],
): string => {
  if (typeof nationality === "object" && nationality) {
    return (
      nationality.name ||
      nationality.englishName ||
      nationality.arabicName ||
      ""
    );
  }
  return String(nationality ?? "");
};

export const hasExistingNationality = (
  nationality: ClientData["nationality"],
): boolean => getNationalityValue(nationality).trim() !== "";

export const hasExistingResidenceType = (
  residenceType: ClientData["residenceType"],
): boolean => {
  if (residenceType == null) return false;
  if (typeof residenceType === "number") return true;
  if (typeof residenceType === "string") return residenceType.trim() !== "";
  if (typeof residenceType === "object") {
    const id = residenceType.residenceTypeId ?? residenceType.id;
    return id != null && id !== "";
  }
  return false;
};

const RESERVATION_PROFILE_LOCK_CHECKS: {
  field: ReservationProfileLockableField;
  hasExisting: (profile: ClientData) => boolean;
}[] = [
  {
    field: "idNumber",
    hasExisting: (profile) => hasExistingResidenceType(profile.residenceType),
  },
  {
    field: "nationality",
    hasExisting: (profile) => hasExistingNationality(profile.nationality),
  },
  {
    field: "personalId",
    hasExisting: (profile) => hasExistingProfileStringValue(profile.personalId),
  },
  {
    field: "passportNumber",
    hasExisting: (profile) =>
      hasExistingProfileStringValue(profile.passportNumber),
  },
  {
    field: "borderNumber",
    hasExisting: (profile) =>
      hasExistingProfileStringValue(profile.borderNumber),
  },
];

export const getLockedReservationProfileFields = (
  profile?: ClientData | null,
): LockedReservationProfileFields => {
  if (!profile) return {};

  return RESERVATION_PROFILE_LOCK_CHECKS.reduce<LockedReservationProfileFields>(
    (locked, { field, hasExisting }) => {
      if (hasExisting(profile)) locked[field] = true;
      return locked;
    },
    {},
  );
};

export const isReservationProfileFieldLocked = (
  lockedFields: LockedReservationProfileFields,
  field: ReservationProfileLockableField,
): boolean => lockedFields[field] ?? false;

export const getResidenceTypeValue = (
  residenceType: ClientData["residenceType"],
): string => {
  if (typeof residenceType === "object" && residenceType) {
    return String(
      residenceType.residenceTypeId ?? residenceType.id ?? 0,
    );
  }
  return String(residenceType ?? 0);
};

export const mapUserProfileToReservationFormValues = (
  profile: ClientData,
): Partial<UpdateUserReservationProfileFormValues> => {
  const identityExpirySource =
    profile.identityExpiryDate ?? profile.licenseExpirationDate;

  return {
    fullName: String(profile.clientName ?? ""),
    email: String(profile.email ?? ""),
    mobile: String(profile.mobile ?? ""),
    idNumber: getResidenceTypeValue(profile.residenceType) || "0",
    nationality: getNationalityValue(profile.nationality),
    personalId: String(profile.personalId ?? ""),
    passportNumber: String(profile.passportNumber ?? ""),
    borderNumber: String(profile.borderNumber ?? ""),
    identityExpiryDate: identityExpirySource
      ? new Date(identityExpirySource)
      : undefined,
    licenceExpiryDate: profile.licenseExpirationDate
      ? new Date(profile.licenseExpirationDate)
      : undefined,
    licenseImage: String(profile.licenseImage ?? ""),
  };
};
