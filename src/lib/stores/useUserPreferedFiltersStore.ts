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
  pickupType: "airport" | "trainStation" | "currentLocation" | "branches" | "";
  categoryName: string;
  pickupName: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  fromDate: string;
  toDate: string;
  pickupLat?: number;
  pickupLng?: number;
  carReturnLocation: string;
  carReturnLocationLat?: number;
  carReturnLocationLng?: number;
  carReturnLocationId?: string;
  carReturnLocationType?:
  | "airport"
  | "trainStation"
  | "currentLocation"
  | "branches"
  | "";
  pickupTrainId?: number;
  pickupAirportId?: number;
  carReturnTrainId?: number;
  carReturnAirportId?: number;
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
  pickupId: "",
  pickupType: "",
  categoryName: "",
  pickupName: "",
  brandId: "",
  brandName: "",
  modelId: "",
  modelName: "",
  fromDate: "",
  toDate: "",
  carReturnLocation: "",
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
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
