import type { Status } from "@/util/bookingStatus";

export type ReservationStatus = Status;

export type ReceiveType =
  | "AIRPORT"
  | "HOME"
  | "BRANCH"
  | "TRAIN_STATION"
  | "MY_LOCATION";

export interface Reservation {
  reservationId: number;

  carNameEn: string;
  carNameAr: string;
  carImage: string;

  carBrandArabicName: string;
  carBrandEnglishName: string;

  carTypeArabicName: string;
  carTypeEnglishName: string;

  categoryNameAr: string;
  categoryNameEn: string;

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
