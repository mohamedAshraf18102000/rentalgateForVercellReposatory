import type { ClientData } from "@/lib/api/types/client.types";
import type { UpdateUserReservationProfileFormValues } from "@/lib/validations/updateUserReservationProfileSchema";

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
