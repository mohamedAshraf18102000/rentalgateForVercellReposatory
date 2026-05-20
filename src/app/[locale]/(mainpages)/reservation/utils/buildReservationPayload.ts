import {
  formatDateAsLocalDayTime,
  formatLocalDateTime,
} from "@/lib/utils/formatLocalDateTime";
import type { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import {
  buildDeliverSegment,
  buildReceiveSegment,
} from "@/lib/booking/buildBookingLocationPayload";
import { warnIfLocationInvariantViolations } from "@/lib/booking/reservationLocationDebug";

export const buildReservationPayload = (formData: ReservationFormData) => {
  warnIfLocationInvariantViolations(formData, "buildReservationPayload");

  const reservationForOther = formData.reservationForOther;
  const hasReservationForOtherData =
    !!reservationForOther?.name ||
    !!reservationForOther?.phone ||
    !!reservationForOther?.nationalId ||
    !!reservationForOther?.licenseImage;

  return {
    companyCarBranchId: formData.carDetails?.ccbId ?? null,
    startDate: formatLocalDateTime(formData.fromDate),
    endDate: formatLocalDateTime(formData.toDate),
    promoCode: formData.promoData?.code ?? null,
    referralCode: formData.referalcode ?? null,
    deliver: buildDeliverSegment(formData),
    receive: buildReceiveSegment(formData),
    servicesIds:
      formData.services && formData.services.length > 0
        ? formData.services
        : null,
    driver: {
      driverRequested: !!formData.driver,
      outOfCity: formData.driver?.type === "out" ? true : false,
      driverHours: formData.driver?.hours ?? null,
      driverDays: formData.driver?.days ?? null,
    },
    points: formData.points?.type
      ? {
        type: formData.points.type,
        pointsPkId: formData.points.pointsPkId ?? null,
      }
      : null,
    extraKm: {
      extraKmApplied: formData.extraKmApplied,
      extraKmType: formData.extraKmType,
      extraKmQuotaId:
        formData.extraKmType === "QUOTA" ? formData.extraKmQuotaId ?? null : null,
    },
    reservationForOther: hasReservationForOtherData
      ? {
        name: reservationForOther?.name ?? "",
        phone: reservationForOther?.phone ?? "",
        nationalId: reservationForOther?.nationalId ?? "",
        licenseImage: reservationForOther?.licenseImage ?? "",
        identityExpiryDate: formatDateAsLocalDayTime(
          reservationForOther?.identityExpiryDate,
        ),
        licenseExpirationDate: formatDateAsLocalDayTime(
          reservationForOther?.licenseExpirationDate,
        ),
      }
      : null,
  };
};
