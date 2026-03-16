import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RentPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type CarCategory = "small" | "economy" | "family" | "luxury";

export interface BookingFilters {
  rentPeriod: RentPeriod;
  carCategory: CarCategory;
  priceMin: string;
  priceTo: string;
  categoryId: string;
  pickupId: string;
  pickupType: "airport" | "trainStation" | "currentLocation" | "";
  categoryName: string;
  pickupName: string;
}

interface UserPreferedFiltersState {
  filters: BookingFilters;
  setFilter: <K extends keyof BookingFilters>(
    key: K,
    value: BookingFilters[K],
  ) => void;
  resetFilters: () => void;
}

const initialFilters: BookingFilters = {
  rentPeriod: "daily",
  carCategory: "small",
  priceMin: "",
  priceTo: "",
  categoryId: "",
  pickupId: "",
  pickupType: "",
  categoryName: "",
  pickupName: "",
};

export const useUserPreferedFiltersStore = create<UserPreferedFiltersState>()(
  persist(
    (set) => ({
      filters: initialFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: "user-prefered-filters-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
