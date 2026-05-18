import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Airport,
  CarDetailsResponse,
  TrainStation,
  WorkingHours,
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
  fromDate: string | null;
  toDate: string | null;
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
  identityExpiryDate: string | null;
  email: string;
  licenseImage: string;
  licenseImageFile: File | null;
  licenceExpiryDate: string | null;
  personalId: string;
  passportNumber: string;
  borderNumber: string;
  reservationForOther: {
    name: string;
    phone: string;
    nationalId: string;
    licenseImage: string;
    identityExpiryDate: string;
    licenseExpirationDate: string;
  };

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
  extraKmApplied: boolean;
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
  branchId: number | null;
  pickupTrainId: number | null;
  pickupAirportId: number | null;
  returnTrainId: number | null;
  returnAirportId: number | null;
  referalcode: string | null;
  rentalDays: number | null;
}

const createInitialFormData = (): ReservationFormData => ({
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
  identityExpiryDate: null,
  email: "",
  licenseImage: "",
  licenseImageFile: null,
  licenceExpiryDate: null,
  personalId: "",
  passportNumber: "",
  borderNumber: "",
  reservationForOther: {
    name: "",
    phone: "",
    nationalId: "",
    licenseImage: "",
    identityExpiryDate: "",
    licenseExpirationDate: "",
  },
  plan: null,
  services: [],
  driver: null,
  extraKmType: "QUOTA",
  extraKmApplied: false,
  points: null,
  carDetails: null,
  pickupType: null,
  returnType: null,
  branchId: null,
  referalcode: null,
  pickupId: null,
  carReturnLocationId: null,
  pickupTrainId: null,
  pickupAirportId: null,
  returnTrainId: null,
  returnAirportId: null,
  rentalDays: 0,
});

export interface BookedCarDetailsState {
  carDetails: CarDetailsResponse | null;
  workingHours: WorkingHours | null;
  services: CompanyService[];
  airports: Airport[];
  trainStations: TrainStation[];
  formData: ReservationFormData;
  showPricesWithTax: boolean;

  // hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  setCarDetails: (carDetails: CarDetailsResponse) => void;
  clearCarDetails: () => void;
  setServices: (services: CompanyService[]) => void;
  clearServices: () => void;
  setAirports: (airports: Airport[]) => void;
  setTrainStations: (trainStations: TrainStation[]) => void;
  setShowPricesWithTax: (value: boolean) => void;

  setFormField: <K extends keyof ReservationFormData>(
    key: K,
    value: ReservationFormData[K],
  ) => void;

  setFormData: (data: Partial<ReservationFormData>) => void;
  resetForm: () => void;
  /** Clears car context, lists, and form; keeps hydration flag. */
  resetStore: () => void;
}

export const useBookedCarDetailsStore = create<BookedCarDetailsState>()(
  persist(
    (set, get) => ({
      carDetails: null,
      workingHours: null,
      services: [],
      airports: [],
      trainStations: [],
      formData: createInitialFormData(),
      showPricesWithTax: true,

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setCarDetails: (carDetails) =>
        set({
          carDetails,
          workingHours: carDetails.workingHours ?? null,
        }),
      clearCarDetails: () => set({ carDetails: null, workingHours: null }),

      setServices: (services) => set({ services }),
      clearServices: () => set({ services: [] }),
      setAirports: (airports) => set({ airports }),
      setTrainStations: (trainStations) => set({ trainStations }),

      setFormField: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),

      setShowPricesWithTax: (value) => set({ showPricesWithTax: value }),

      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...Object.fromEntries(
              Object.entries(data).filter(([_, v]) => v !== undefined),
            ),
          },
        })),

      resetForm: () => set({ formData: createInitialFormData() }),

      resetStore: () =>
        set({
          carDetails: null,
          workingHours: null,
          services: [],
          airports: [],
          trainStations: [],
          formData: createInitialFormData(),
          showPricesWithTax: true,
        }),

    }),
    {
      name: "booked-car-details-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },

      partialize: (state) => ({
        carDetails: state.carDetails,
        workingHours: state.workingHours,
        services: state.services,
        airports: state.airports,
        trainStations: state.trainStations,
        formData: state.formData,
        showPricesWithTax: state.showPricesWithTax,
      }),
    },
  ),
);
