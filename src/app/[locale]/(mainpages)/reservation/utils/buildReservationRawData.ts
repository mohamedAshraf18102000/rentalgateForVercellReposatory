import { BookedCarDetailsState } from "@/lib/stores/useBookedCarDetailsStore";
import { formatLocalDateTime } from "@/lib/utils/formatLocalDateTime";

export const buildReservationRawData = (
  bookedCarDetails: BookedCarDetailsState,
) => {
  return {
    companyCarBranchId: bookedCarDetails?.carDetails?.ccbId,
    pickupLatitude: bookedCarDetails.formData.pickupLat,
    pickupLongitude: bookedCarDetails.formData.pickupLong,
    returnLatitude: bookedCarDetails.formData.returnLat,
    returnLongitude: bookedCarDetails.formData.returnLong,
    startDate: bookedCarDetails.formData.fromDate
      ? formatLocalDateTime(bookedCarDetails.formData.fromDate)
      : "",
    endDate: bookedCarDetails.formData.toDate
      ? formatLocalDateTime(bookedCarDetails.formData.toDate)
      : "",
    services: bookedCarDetails.formData.services?.length
      ? bookedCarDetails.formData.services
      : [],
    extraKmType: bookedCarDetails.formData.extraKmType,
    extraKmApplied: bookedCarDetails.formData.extraKmApplied,
  };
};
