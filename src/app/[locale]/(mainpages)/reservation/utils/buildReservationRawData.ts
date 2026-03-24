import { BookedCarDetailsState } from "@/lib/stores/useBookedCarDetailsStore";

export const buildReservationRawData = (
  bookedCarDetails: BookedCarDetailsState,
) => {
  return {
    companyCarBranchId: bookedCarDetails?.carDetails?.ccbId,

    pickupName: bookedCarDetails.formData.pickupName,
    carReturnLocation: bookedCarDetails.formData.carReturnLocation,
    startDate: (bookedCarDetails.formData.fromDate as Date).toISOString(),
    endDate: (bookedCarDetails.formData.toDate as Date).toISOString(),
    fullName: bookedCarDetails.formData.fullName,
    phoneNumber: bookedCarDetails.formData.phoneNumber,
    idNumber: bookedCarDetails.formData.idNumber,
    nationality: bookedCarDetails.formData.nationality,
    email: bookedCarDetails.formData.email,
    licenceExpiryDate: (
      bookedCarDetails.formData.licenceExpiryDate as Date
    ).toISOString(),
    licenseImage: bookedCarDetails.formData.licenseImage,
    services: bookedCarDetails.formData.services?.length
      ? bookedCarDetails.formData.services
      : [],
  };
};
