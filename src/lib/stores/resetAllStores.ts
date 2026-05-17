"use client";

import { useCarDataStore, useFilterStore } from "@/lib/api/stores";

import { useBookedCarDetailsStore } from "./useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "./useUserPreferedFiltersStore";
import { useLocationStore } from "./useLocationStore";
import { usePickupDialogStore } from "./usePickupDialogStore";

type ResetAllStoresProps = {
  excludeLocationReset?: boolean;
};

export function resetAllStores(
  { excludeLocationReset = false }: ResetAllStoresProps = {},
): void {

  useCarDataStore.getState().reset();
  useFilterStore.getState().reset();
  useBookedCarDetailsStore.getState().resetStore();
  useUserPreferedFiltersStore.getState().resetFilters();
  if (!excludeLocationReset) {
    useLocationStore.getState().resetLocationState();
  }
  usePickupDialogStore.getState().resetDialogState();
}
