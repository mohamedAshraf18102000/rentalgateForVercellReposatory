export type ReservationStatus = "STARTED" | "PAID";

export type ReceiveType = "AIRPORT" | "HOME" | "BRANCH" | "TRAIN_STATION"; // زود غيرهم لو موجودين

export interface Reservation {
  reservationId: number;

  carName: string;
  carImage: string;

  carBrandArabicName: string;
  carBrandEnglishName: string;

  carTypeArabicName: string;
  carTypeEnglishName: string;

  carCategoryArabicName: string;
  carCategoryEnglishName: string;

  year: number;

  startDate: string; // ISO Date
  endDate: string; // ISO Date

  reservationStatus: ReservationStatus;
  receiveType: ReceiveType;

  extended: boolean;

  ccid: number;
}

export type UserReservationsResponse = Reservation[];

export interface UserReservationsPaylod {
  localStatus: "all" | "current" | "finished";
}
