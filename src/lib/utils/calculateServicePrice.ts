import { ServicePriceInput } from "@/types/companyCars/carServices";

export const calculateServicePrice = (
  service: ServicePriceInput,
  rentalDays: number,
) => {
  const days = rentalDays || 1;
  
  if (service.csType === "once") {
    return service.price;
  }

  if (service.csType === "everyday") {
    if (service.priceType === "same") {
      return service.price * days;
    }

    if (service.priceType === "multi") {
      let pricePerDay = 0;
      if (days <= 6) {
        pricePerDay = service.dailyPrice ?? 0;
      } else if (days <= 14) {
        pricePerDay = (service.weeklyPrice ?? 0) / 7;
      } else if (days <= 29) {
        pricePerDay = (service.halfMonthly || 0) / 15;
      } else if (days <= 359) {
        pricePerDay = (service.monthly || 0) / 30;
      } else {
        pricePerDay = (service.yearly || 0) / 360;
      }
      return pricePerDay * days;
    }
  }
  
  return service.price;
};
