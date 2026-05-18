import { ReservationFormData } from "@/lib/stores/useBookedCarDetailsStore";
import { BookingFilters } from "@/lib/stores/useUserPreferedFiltersStore";
import { ReservationFormValues } from "@/lib/validations/reservationSchema";
import { isCurrentLocationPlaceholder } from "@/lib/validations/currentLocationLabels";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

const normalizeLocationValue = (value?: string | null) =>
  value && !isCurrentLocationPlaceholder(value) ? value : "";

export const getRentalDays = (fromDate?: Date | string, toDate?: Date | string) => {
  const normalizedFromDate = formatLocalDateTime(fromDate);
  const normalizedToDate = formatLocalDateTime(toDate);

  if (!normalizedFromDate || !normalizedToDate) return 0;

  const from = new Date(normalizedFromDate);
  const to = new Date(normalizedToDate);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;

  const diffTime = to.getTime() - from.getTime();
  if (diffTime <= 0) return 0;

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

export const buildInitialReservationValues = ({
  formData,
  filters,
  isForOtherReservation,
}: {
  formData: ReservationFormData;
  filters: BookingFilters;
  isForOtherReservation: boolean;
}): ReservationFormValues => {
  const pickupName =
    normalizeLocationValue(formData.pickupName) ||
    normalizeLocationValue(filters.pickupName);

  const returnName =
    normalizeLocationValue(formData.carReturnLocation) ||
    normalizeLocationValue(filters.carReturnLocation) ||
    pickupName ||
    "";

  return {
    pickupName: pickupName || "",
    carReturnLocation: returnName,
    fromDate: formData.fromDate
      ? new Date(formData.fromDate)
      : filters.fromDate
        ? new Date(filters.fromDate)
        : undefined,
    toDate: formData.toDate
      ? new Date(formData.toDate)
      : filters.toDate
        ? new Date(filters.toDate)
        : undefined,
    pickupLat: formData.pickupLat ?? filters.pickupLat ?? null,
    pickupLong: formData.pickupLong ?? filters.pickupLng ?? null,
    pickupId: formData.pickupId || filters.pickupId || null,
    returnLat: formData.returnLat ?? filters.carReturnLocationLat ?? null,
    returnLong: formData.returnLong ?? filters.carReturnLocationLng ?? null,
    carReturnLocationId:
      formData.carReturnLocationId || filters.carReturnLocationId || null,
    pickupTrainId: formData.pickupTrainId ?? filters.pickupTrainId ?? null,
    pickupAirportId: formData.pickupAirportId ?? filters.pickupAirportId ?? null,
    returnTrainId: formData.returnTrainId ?? filters.carReturnTrainId ?? null,
    returnAirportId:
      formData.returnAirportId ?? filters.carReturnAirportId ?? null,
    isForOtherReservation,
    idNumber: formData.idNumber || "0",
    nationality: formData.nationality || "",
    identityExpiryDate: formData.identityExpiryDate
      ? new Date(formData.identityExpiryDate)
      : undefined,
    licenseImage: formData.licenseImage || "",
    licenceExpiryDate: formData.licenceExpiryDate
      ? new Date(formData.licenceExpiryDate)
      : undefined,
    personalId: formData.personalId || "",
    passportNumber: formData.passportNumber || "",
    borderNumber: formData.borderNumber || "",
    services: formData.services || [],
    driver: formData.driver || null,
    extraKmType: formData.extraKmType || "QUOTA",
    extraKmApplied: formData.extraKmApplied || false,
  };
};

export const buildResetReservationValues = (): ReservationFormValues => ({
  pickupName: "",
  carReturnLocation: "",
  fromDate: undefined,
  toDate: undefined,
  pickupLat: null,
  pickupLong: null,
  pickupId: null,
  returnLat: null,
  returnLong: null,
  carReturnLocationId: null,
  pickupTrainId: null,
  pickupAirportId: null,
  returnTrainId: null,
  returnAirportId: null,
  idNumber: "0",
  nationality: "",
  identityExpiryDate: undefined,
  licenseImage: "",
  licenceExpiryDate: undefined,
  personalId: "",
  passportNumber: "",
  borderNumber: "",
  services: [],
  driver: null,
  extraKmType: "QUOTA",
  extraKmApplied: false,
});

export const mapValuesToFormData = (
  values: Partial<Record<keyof ReservationFormValues, unknown>>,
): Partial<ReservationFormData> => {
  const update: Partial<ReservationFormData> = {};

  if (values.pickupName !== undefined) update.pickupName = values.pickupName as string;
  if (values.carReturnLocation !== undefined)
    update.carReturnLocation = values.carReturnLocation as string;
  if (values.fromDate !== undefined)
    update.fromDate = formatLocalDateTime(
      values.fromDate as Date | string | null | undefined,
    );
  if (values.toDate !== undefined)
    update.toDate = formatLocalDateTime(
      values.toDate as Date | string | null | undefined,
    );
  if (values.idNumber !== undefined) update.idNumber = values.idNumber as string;
  if (values.nationality !== undefined)
    update.nationality = values.nationality as string;
  if (values.identityExpiryDate !== undefined)
    update.identityExpiryDate = formatLocalDateTime(
      values.identityExpiryDate as Date | string | null | undefined,
    );
  if (values.licenseImage !== undefined)
    update.licenseImage = values.licenseImage as string;
  if (values.licenceExpiryDate !== undefined)
    update.licenceExpiryDate = formatLocalDateTime(
      values.licenceExpiryDate as Date | string | null | undefined,
    );
  if (values.personalId !== undefined) update.personalId = values.personalId as string;
  if (values.passportNumber !== undefined)
    update.passportNumber = values.passportNumber as string;
  if (values.borderNumber !== undefined)
    update.borderNumber = values.borderNumber as string;
  if (values.services !== undefined) {
    update.services = (values.services as Array<number | undefined>).filter(
      (serviceId): serviceId is number => typeof serviceId === "number",
    );
  }
  if (values.driver !== undefined)
    update.driver = values.driver as ReservationFormData["driver"];
  if (values.extraKmType !== undefined)
    update.extraKmType = values.extraKmType as "UNLIMITED" | "QUOTA";
  if (values.extraKmApplied !== undefined)
    update.extraKmApplied = values.extraKmApplied as boolean;
  if (values.pickupLat !== undefined) update.pickupLat = values.pickupLat as number | null;
  if (values.pickupLong !== undefined)
    update.pickupLong = values.pickupLong as number | null;
  if (values.returnLat !== undefined) update.returnLat = values.returnLat as number | null;
  if (values.returnLong !== undefined)
    update.returnLong = values.returnLong as number | null;
  if (values.pickupId !== undefined) update.pickupId = values.pickupId as string | null;
  if (values.carReturnLocationId !== undefined)
    update.carReturnLocationId = values.carReturnLocationId as string | null;
  if (values.pickupTrainId !== undefined)
    update.pickupTrainId = values.pickupTrainId as number | null;
  if (values.pickupAirportId !== undefined)
    update.pickupAirportId = values.pickupAirportId as number | null;
  if (values.returnTrainId !== undefined)
    update.returnTrainId = values.returnTrainId as number | null;
  if (values.returnAirportId !== undefined)
    update.returnAirportId = values.returnAirportId as number | null;

  if (values.fromDate && values.toDate) {
    update.rentalDays = getRentalDays(
      values.fromDate as Date | string | undefined,
      values.toDate as Date | string | undefined,
    );
  }

  return update;
};
