import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "@/lib/stores/useUserPreferedFiltersStore";

export const resetReservationState = () => {
  useBookedCarDetailsStore.getState().resetForm();
  useUserPreferedFiltersStore.getState().resetFilters();
};
