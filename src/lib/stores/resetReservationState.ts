import { useBookedCarDetailsStore } from "@/lib/stores/useBookedCarDetailsStore";

export const resetReservationState = () => {
  useBookedCarDetailsStore.getState().resetForm();
};
