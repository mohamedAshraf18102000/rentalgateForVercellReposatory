import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RentPeriod = "daily" | "weekly" | "monthly" | "yearly" | "";
export type CarCategory = "small" | "economy" | "family" | "luxury" | "";

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
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
}

interface UserPreferedFiltersState {
  filters: BookingFilters;
  appliedFilters: BookingFilters;
  setFilter: <K extends keyof BookingFilters>(
    key: K,
    value: BookingFilters[K],
  ) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const initialFilters: BookingFilters = {
  rentPeriod: "",
  carCategory: "",
  priceMin: "",
  priceTo: "",
  categoryId: "",
  pickupId: "current-location",
  pickupType: "currentLocation",
  categoryName: "",
  pickupName: "الموقع الحالي",
  brandId: "",
  brandName: "",
  modelId: "",
  modelName: "",
};

export const useUserPreferedFiltersStore = create<UserPreferedFiltersState>()(
  persist(
    (set) => ({
      filters: initialFilters,
      appliedFilters: initialFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      applyFilters: () =>
        set((state) => ({
          appliedFilters: { ...state.filters },
        })),
      resetFilters: () =>
        set({ filters: initialFilters, appliedFilters: initialFilters }),
    }),
    {
      name: "user-prefered-filters-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
