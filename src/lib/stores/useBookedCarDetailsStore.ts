import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CarDetailsResponse } from "@/types/companyCars/carDetails";

interface BookedCarDetailsState {
  carDetails: CarDetailsResponse | null;
  setCarDetails: (carDetails: CarDetailsResponse) => void;
  clearCarDetails: () => void;
}

export const useBookedCarDetailsStore = create<BookedCarDetailsState>()(
  persist(
    (set) => ({
      carDetails: null,
      setCarDetails: (carDetails) => set({ carDetails }),
      clearCarDetails: () => set({ carDetails: null }),
    }),
    {
      name: "booked-car-details-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
