import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RentPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type CarCategory = "small" | "economy" | "family" | "luxury";

interface UserPreferedFiltersState {
  rentPeriod: RentPeriod;
  carCategory: CarCategory;
  setRentPeriod: (period: RentPeriod) => void;
  setCarCategory: (category: CarCategory) => void;
}

export const useUserPreferedFiltersStore = create<UserPreferedFiltersState>()(
  persist(
    (set) => ({
      rentPeriod: "daily",
      carCategory: "small",
      setRentPeriod: (rentPeriod) => set({ rentPeriod }),
      setCarCategory: (carCategory) => set({ carCategory }),
    }),
    {
      name: "user-prefered-filters-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
