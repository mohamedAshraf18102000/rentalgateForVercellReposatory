import { calculateRentalPrice } from "@/lib/utils/calculateRentalPrice";
import { completeUserProfile } from "@/services/userProfile/completeUserProfile.service";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { getRentalDays } from "./stepContentFormValues";
import {
  formatDateAsLocalDay,
  formatDateAsLocalDayTime,
} from "@/lib/utils/formatLocalDateTime";


interface ValidateStepParams {
  displayStep: number;
  isForOtherReservation: boolean;
  trigger: (
    fields?: (keyof ReservationFormValues)[],
  ) => Promise<boolean>;
  getValues: () => ReservationFormValues;
  carDetails: {
    dailyPrice: number;
    weeklyPrice: number;
    halfMonthPrice: number;
    monthlyPrice: number;
    yearlyPrice: number;
    offerDailyPrice: number;
    offerWeeklyPrice: number;
    offerHalfMonthPrice: number;
    offerMonthlyPrice: number;
    offerYearlyPrice: number;
  } | null;
  setFormData: (data: Partial<ReservationFormData>) => void;
  setClientData: (data: any) => void;
}

const STEP_ONE_FIELDS: (keyof ReservationFormValues)[] = [
  "pickupName",
  "carReturnLocation",
  "fromDate",
  "toDate",
];

const STEP_TWO_OTHER_FIELDS: (keyof ReservationFormValues)[] = [
  "OtherPersonName",
  "OtherPersonPhoneNumber",
  "OtherPersonLicenseImage",
  "OtherPersonalId",
  "identityExpiryDate",
  "licenseExpirationDate",
];

const STEP_TWO_SELF_FIELDS: (keyof ReservationFormValues)[] = [
  "idNumber",
  "nationality",
  "identityExpiryDate",
  "licenseImage",
  "licenceExpiryDate",
  "personalId",
  "passportNumber",
  "borderNumber",
];

export const validateCurrentStep = async ({
  displayStep,
  isForOtherReservation,
  trigger,
  getValues,
  carDetails,
  setFormData,
  setClientData,
}: ValidateStepParams): Promise<boolean> => {
  let fieldsToValidate: (keyof ReservationFormValues)[] = [];

  if (displayStep === 1) {
    fieldsToValidate = STEP_ONE_FIELDS;
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return false;

    const values = getValues();
    if (!values.fromDate || !values.toDate || !carDetails) return true;

    const diffDays = getRentalDays(values.fromDate, values.toDate);
    const effectivePricing = calculateRentalPrice({
      days: diffDays,
      dailyPrice: carDetails.dailyPrice,
      weeklyPrice: carDetails.weeklyPrice,
      halfMonthlyPrice: carDetails.halfMonthPrice,
      monthlyPrice: carDetails.monthlyPrice,
      yearlyPrice: carDetails.yearlyPrice,
      offerDailyPrice: carDetails.offerDailyPrice,
      offerWeeklyPrice: carDetails.offerWeeklyPrice,
      offerHalfMonthlyPrice: carDetails.offerHalfMonthPrice,
      offerMonthlyPrice: carDetails.offerMonthlyPrice,
      offerYearlyPrice: carDetails.offerYearlyPrice,
    });

    const originalPricing = calculateRentalPrice({
      days: diffDays,
      dailyPrice: carDetails.dailyPrice,
      weeklyPrice: carDetails.weeklyPrice,
      halfMonthlyPrice: carDetails.halfMonthPrice,
      monthlyPrice: carDetails.monthlyPrice,
      yearlyPrice: carDetails.yearlyPrice,
      offerDailyPrice: 0,
      offerWeeklyPrice: 0,
      offerHalfMonthlyPrice: 0,
      offerMonthlyPrice: 0,
      offerYearlyPrice: 0,
    });

    setFormData({
      price: effectivePricing.totalPrice,
      originalPrice: originalPricing.totalPrice,
    });
    return true;
  }

  if (displayStep === 2) {
    fieldsToValidate = isForOtherReservation
      ? STEP_TWO_OTHER_FIELDS
      : STEP_TWO_SELF_FIELDS;
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return false;

    const values = getValues();
    if (isForOtherReservation) {
      setFormData({
        reservationForOther: {
          name: values.OtherPersonName || "",
          phone: values.OtherPersonPhoneNumber || "",
          nationalId: values.OtherPersonalId || "",
          licenseImage: values.OtherPersonLicenseImage || "",
          identityExpiryDate: formatDateAsLocalDayTime(
            values.identityExpiryDate as Date | string | undefined,
          ),
          licenseExpirationDate: formatDateAsLocalDayTime(
            values.licenseExpirationDate as Date | string | undefined,
          ),
        },
      });
      return true;
    }

    const residenceType = values.idNumber;
    try {
      const updatedData = await completeUserProfile({
        identityExpiryDate: formatDateAsLocalDay(
          values.identityExpiryDate as Date | string | undefined,
        ),
        licenseExpirationDate: formatDateAsLocalDay(
          values.licenceExpiryDate as Date | string | undefined,
        ),
        licenseImage: values.licenseImage,
        nationality: values.nationality,
        residenceType: Number(residenceType),
        personalId: residenceType === "2" ? null : values.personalId || null,
        passportNumber:
          residenceType === "2" || residenceType === "3"
            ? values.passportNumber || null
            : null,
        borderNumber: residenceType === "3" ? values.borderNumber || null : null,
      });
      setClientData(updatedData);
      return true;
    } catch (err) {
      console.error("Update profile failed", err);
      return false;
    }
  }

  return trigger(fieldsToValidate);
};
