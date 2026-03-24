import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CarDetailsResponse } from "@/types/companyCars/carDetails";
import { CompanyService } from "@/types/companyCars/carServices";

interface BookedCarDetailsState {
  carDetails: CarDetailsResponse | null;
  services: CompanyService[];
  setCarDetails: (carDetails: CarDetailsResponse) => void;
  clearCarDetails: () => void;
  setServices: (services: CompanyService[]) => void;
  clearServices: () => void;
}

export const useBookedCarDetailsStore = create<BookedCarDetailsState>()(
  persist(
    (set) => ({
      carDetails: null,
      services: [],
      setCarDetails: (carDetails) => set({ carDetails }),
      clearCarDetails: () => set({ carDetails: null }),
      setServices: (services) => set({ services }),
      clearServices: () => set({ services: [] }),
    }),
    {
      name: "booked-car-details-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
