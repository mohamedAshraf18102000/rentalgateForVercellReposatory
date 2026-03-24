import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CarDetailsResponse } from "@/types/companyCars/carDetails";
import { CompanyService } from "@/types/companyCars/carServices";

export interface ReservationFormData {
  // Step 1
  pickupName: string;
  carReturnLocation: string;
  fromDate: Date | null;
  toDate: Date | null;

  // Step 2
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  nationality: string;
  email: string;
  licenseImage: string;
  licenseImageFile: File | null;
  licenceExpiryDate: Date | null;

  // Step 3
  services: string[];
}

const initialFormData: ReservationFormData = {
  pickupName: "",
  carReturnLocation: "",
  fromDate: null,
  toDate: null,
  fullName: "",
  phoneNumber: "",
  idNumber: "",
  nationality: "",
  email: "",
  licenseImage: "",
  licenseImageFile: null,
  licenceExpiryDate: null,
  services: [],
};

export interface BookedCarDetailsState {
  carDetails: CarDetailsResponse | null;
  services: CompanyService[];
  formData: ReservationFormData;

  setCarDetails: (carDetails: CarDetailsResponse) => void;
  clearCarDetails: () => void;
  setServices: (services: CompanyService[]) => void;
  clearServices: () => void;

  setFormField: <K extends keyof ReservationFormData>(
    key: K,
    value: ReservationFormData[K]
  ) => void;
  setFormData: (data: Partial<ReservationFormData>) => void;
  resetForm: () => void;
}

export const useBookedCarDetailsStore = create<BookedCarDetailsState>()(
  persist(
    (set) => ({
      carDetails: null,
      services: [],
      formData: initialFormData,

      setCarDetails: (carDetails) => set({ carDetails }),
      clearCarDetails: () => set({ carDetails: null }),
      setServices: (services) => set({ services }),
      clearServices: () => set({ services: [] }),

      setFormField: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ formData: initialFormData }),
    }),
    {
      name: "booked-car-details-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        carDetails: state.carDetails,
        services: state.services,
      }), // Don't persist formData to avoid serializing File objects
    }
  )
);
