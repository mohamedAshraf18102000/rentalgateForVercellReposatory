import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

export const buildReservationPayload = (formData: any) => {
  return {
    companyCarBranchId: formData.carDetails?.ccbId ?? null,
    startDate: formatLocalDateTime(formData.fromDate),
    endDate: formatLocalDateTime(formData.toDate),
    promoCode: formData.promoData?.code ?? null,
    referralCode: formData.referalcode ?? null,
    deliver: {
      type: formData.pickupType ?? null,
      ...(formData.pickupType === "TRAIN_STATION" && {
        trainId: formData.pickupTrainId,
      }),
      ...(formData.pickupType === "AIRPORT" && {
        airportId: formData.pickupAirportId,
      }),
      ...(formData.pickupType === "MY_LOCATION" && {
        latitude: formData.pickupLat ?? null,
        longitude: formData.pickupLong ?? null,
        addressId: formData.pickupId ? Number(formData.pickupId) : null,
      }),
      ...(formData.pickupType === "BRANCH" && {
        latitude: formData.pickupLat ?? null,
        longitude: formData.pickupLong ?? null,
      }),
    },
    receive: {
      type: formData.returnType ?? null,
      ...(formData.returnType === "TRAIN_STATION" && {
        trainId: formData.returnTrainId,
      }),
      ...(formData.returnType === "AIRPORT" && {
        airportId: formData.returnAirportId,
      }),
      ...(formData.returnType === "MY_LOCATION" && {
        latitude: formData.returnLat ?? null,
        longitude: formData.returnLong ?? null,
        addressId: formData.carReturnLocationId
          ? Number(formData.carReturnLocationId)
          : null,
      }),
      ...(formData.returnType === "BRANCH" && {
        latitude: formData.returnLat ?? null,
        longitude: formData.returnLong ?? null,
      }),
    },
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
      extraKmQuotaId: null,
    },
  };
};
