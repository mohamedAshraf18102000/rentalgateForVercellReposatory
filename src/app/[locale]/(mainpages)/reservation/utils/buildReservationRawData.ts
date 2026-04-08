import { BookedCarDetailsState } from "@/lib/stores/useBookedCarDetailsStore";

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
      ? (bookedCarDetails.formData.fromDate as Date).toISOString()
      : "",
    endDate: bookedCarDetails.formData.toDate
      ? (bookedCarDetails.formData.toDate as Date).toISOString()
      : "",
    services: bookedCarDetails.formData.services?.length
      ? bookedCarDetails.formData.services
      : [],
    extraKmType: bookedCarDetails.formData.extraKmType,
    extraKmApplied: bookedCarDetails.formData.extraKmApplied,
  };
};
