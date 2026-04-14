export interface LocationChanges {
  createdAt: string;
  updatedAt: string;
  status: string;

  deliverBranchBranchId: number;
  deliverLatitude: number;
  deliverLongitude: number;
  deliverPrice: number;

  receiveBranchBranchId: number;
  receiveLatitude: number;
  receiveLongitude: number;
  receivePrice: number;
}

export type ReservationDetailsResponse = {
  reservationId: number;
  clientId: number;

  startDate: string; // ISO date
  endDate: string; // ISO date
  days: number;

  reservationStatus: "PAID" | "CREATED" | "STARTED" | "IN_PROGRESS" | "HOLD" | "EXTENDED" | "FINISHED" | "CANCELLED" | "DECLINED" | "ADMIN_APPROVED" | "AUTOMATICALLY_EXTENDED" | "WALLET_PAID" | "LOCATION_CHANGED";

  receiveType: "AIRPORT" | "HOME" | "BRANCH" | string;
  deliverType: "AIRPORT" | "HOME" | "BRANCH" | string;

  receiveFee: number;
  deliverFee: number;

  receiveLocationName: string;
  receiveLocationLatitude: number;
  receiveLocationLongitude: number;
  receiveLocationMobile: string;

  deliverLocationName: string;
  deliverLocationLatitude: number;
  deliverLocationLongitude: number;
  deliverLocationMobile: string;

  basePrice: number;
  servicesPrice: number;
  driverPrice: number;
  driverExtraPrice: number;

  driverServiceType: "in" | "out" | string;

  extraKmPrice: number;
  extraHoursPrice: number;

  carOfferPrice: number;
  carDaysDiscount: number;
  promoDiscount: number;
  pointsDiscount: number;

  totalBeforeTax: number;
  taxValue: number;
  total: number;

  carName: string;
  carImage: string;

  companyName: string;
  companyImage: string;
  companyMobile: string;

  driverName: string;
  driverMobile: string;
  driverStatus: string | null;

  locationChanges: LocationChanges | null;

  reservationServices: {
    serviceId: number;
    arabicName: string;
    englishName: string;
    price: number;
  }[];
  reservationExtends: unknown[]; // refine later if you have structure

  reservationForOther: unknown | null;
};
