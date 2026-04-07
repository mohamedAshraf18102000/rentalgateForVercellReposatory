import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Airport,
  CarDetailsResponse,
  TrainStation,
} from "@/types/companyCars/carDetails";
import { CompanyService } from "@/types/companyCars/carServices";
import { PricingType } from "@/lib/utils/calculateRentalPrice";

export interface ReservationFormData {
  // Step 1
  company_id: number | null;
  pickupName: string;
  pickupLat: number | null;
  pickupLong: number | null;
  pickupId: string | null;
  carReturnLocation: string;
  carReturnLocationId: string | null;
  returnLat: number | null;
  returnLong: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  price: number | null;
  originalPrice: number | null;
  promoData: {
    code: string;
    codeType: number;
    discountValue: number;
  } | null;

  // Step 2
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  nationality: string;
  email: string;
  licenseImage: string;
  licenseImageFile: File | null;
  licenceExpiryDate: Date | null;
  personalId: string;
  passportNumber: string;
  borderNumber: string;

  // Step 3
  plan: PricingType | null;
  services: number[];
  driver: {
    id: number;
    hours: number;
    days: number;
    type?: "in" | "out";
  } | null;
  extraKmType: "UNLIMITED" | "QUOTA" | null;
  points: {
    type: "PACKAGE" | "COUPON" | null;
    pointsPkId: number | null;
    value: number | null;
  } | null;

  carDetails: {
    unlimitedKm: number;
    unlimitedKmPrice: number;
    ccbId: number;
  } | null;

  pickupType: "BRANCH" | "MY_LOCATION" | "TRAIN_STATION" | "AIRPORT" | null;
  returnType: "BRANCH" | "MY_LOCATION" | "TRAIN_STATION" | "AIRPORT" | null;
  pickupTrainId: number | null;
  pickupAirportId: number | null;
  returnTrainId: number | null;
  returnAirportId: number | null;
  referalcode: string | null;
  rentalDays: number | null;
}

const initialFormData: ReservationFormData = {
  company_id: null,
  pickupName: "",
  pickupLat: null,
  pickupLong: null,
  carReturnLocation: "",
  returnLat: null,
  returnLong: null,
  fromDate: null,
  toDate: null,
  price: null,
  originalPrice: null,
  promoData: null,
  fullName: "",
  phoneNumber: "",
  idNumber: "",
  nationality: "",
  email: "",
  licenseImage: "",
  licenseImageFile: null,
  licenceExpiryDate: null,
  personalId: "",
  passportNumber: "",
  borderNumber: "",
  plan: null,
  services: [],
  driver: null,
  extraKmType: "QUOTA",
  points: null,
  carDetails: null,
  pickupType: null,
  returnType: null,
  referalcode: null,
  pickupId: null,
  carReturnLocationId: null,
  pickupTrainId: null,
  pickupAirportId: null,
  returnTrainId: null,
  returnAirportId: null,
  rentalDays: 0,
};

export interface BookedCarDetailsState {
  carDetails: CarDetailsResponse | null;
  services: CompanyService[];
  airports: Airport[];
  trainStations: TrainStation[];
  formData: ReservationFormData;

  // hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  setCarDetails: (carDetails: CarDetailsResponse) => void;
  clearCarDetails: () => void;
  setServices: (services: CompanyService[]) => void;
  clearServices: () => void;
  setAirports: (airports: Airport[]) => void;
  setTrainStations: (trainStations: TrainStation[]) => void;

  setFormField: <K extends keyof ReservationFormData>(
    key: K,
    value: ReservationFormData[K],
  ) => void;

  setFormData: (data: Partial<ReservationFormData>) => void;
  resetForm: () => void;
}

export const useBookedCarDetailsStore = create<BookedCarDetailsState>()(
  persist(
    (set, get) => ({
      carDetails: null,
      services: [],
      airports: [],
      trainStations: [],
      formData: initialFormData,

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setCarDetails: (carDetails) => set({ carDetails }),
      clearCarDetails: () => set({ carDetails: null }),

      setServices: (services) => set({ services }),
      clearServices: () => set({ services: [] }),
      setAirports: (airports) => set({ airports }),
      setTrainStations: (trainStations) => set({ trainStations }),

      setFormField: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== undefined),
            ),
          },
        })),

      resetForm: () => set({ formData: initialFormData }),
    }),
    {
      name: "booked-car-details-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        if (state?.formData) {
          state.formData.fromDate = state.formData.fromDate
            ? new Date(state.formData.fromDate)
            : null;

          state.formData.toDate = state.formData.toDate
            ? new Date(state.formData.toDate)
            : null;

          state.formData.licenceExpiryDate = state.formData.licenceExpiryDate
            ? new Date(state.formData.licenceExpiryDate)
            : null;
        }

        state?.setHasHydrated(true);
      },

      // ✅ خزّن كل حاجة (مفيش File أصلاً)
      partialize: (state) => ({
        carDetails: state.carDetails,
        services: state.services,
        airports: state.airports,
        trainStations: state.trainStations,
        formData: state.formData,
      }),
    },
  ),
);
