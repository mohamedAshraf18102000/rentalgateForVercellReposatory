"use client";

import { useCarDataStore, useFilterStore } from "@/lib/api/stores";

import { useBookedCarDetailsStore } from "./useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "./useUserPreferedFiltersStore";


export function resetAllStores(): void {

  useCarDataStore.getState().reset();
  useFilterStore.getState().reset();
  useBookedCarDetailsStore.getState().resetStore();
  useUserPreferedFiltersStore.getState().resetFilters();

}
