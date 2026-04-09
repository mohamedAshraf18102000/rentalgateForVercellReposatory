import { fetcher } from "../api";

// export interface CalculateQuotePricePayload {
//   companyCarBranchId: number | null;
//   startDate: string;
//   endDate: string;
//   promoCode: string | null;
//   referralCode: string | null;
//   deliver: {
//     type: string | null;
//     trainId?: number | null;
//     airportId?: number | null;
//     latitude?: number | null;
//     longitude?: number | null;
//     addressId?: number | null;
//   };
//   receive: {
//     type: string | null;
//     trainId?: number | null;
//     airportId?: number | null;
//     latitude?: number | null;
//     longitude?: number | null;
//     addressId?: number | null;
//   };
//   servicesIds: number[] | null;
//   driver: {
//     driverRequested: boolean;
//     outOfCity: boolean;
//     driverHours: number | null;
//     driverDays: number | null;
//   };
//   points: {
//     type: string;
//     pointsPkId: number | null;
//   } | null;
//   extraKm: {
//     extraKmApplied: boolean;
//     extraKmType: string | null;
//     extraKmQuotaId: number | null;
//   };
// }

export interface DataForReservation {
  promoId: number | null;
  days: number;
  pointsUsed: number;
  carHasOffer: boolean;
  clientId: number;
  temporaryPriceId: number | null;
  extraHours: number;
  driverDays: number;
  driverHours: number;
  driverExtraHours: number;
  receiveBranchId: number | null;
  deliveryBranchId: number | null;
  services: {
    serviceId: number;
    price: number;
  }[];
}

export interface CalculateQuotePriceResponse {
  startDate: string;
  endDate: string;
  basePrice: number;
  isExtraDayAdded: boolean;
  offerApplied: boolean;
  appliedPlan: "DAILY" | "WEEKLY" | "HALF_MONTHLY" | "MONTHLY" | "YEARLY";
  pickupFee: number;
  deliveryFee: number;
  servicesPrice: number;
  driverPrice: number;
  driverExtraPrice: number;
  extraHoursPrice: number;
  extraKmPrice: number;
  promoDiscount: number;
  businessDiscount: number;
  carDaysDiscount: number;
  pointsDiscount: number;
  taxPercentage: number;
  totalBeforeTax: number;
  taxValue: number;
  total: number;
  dataForReservation: DataForReservation;
}

export const calculateQuotePrice = (payload: any) => {
  if (
    !payload.startDate ||
    !payload.endDate ||
    !payload.receive?.type ||
    !payload.deliver?.type
  ) {
    return Promise.reject(new Error("FE-STOP-TOAST"));
  }

  return fetcher<CalculateQuotePriceResponse>("/reservations/quote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
