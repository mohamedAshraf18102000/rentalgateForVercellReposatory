"use client";

import { useCarDataStore, useFilterStore } from "@/lib/api/stores";

import { useBookedCarDetailsStore } from "./useBookedCarDetailsStore";
import { useUserPreferedFiltersStore } from "./useUserPreferedFiltersStore";
import { useLocationStore } from "./useLocationStore";
import { usePickupDialogStore } from "./usePickupDialogStore";


export function resetAllStores(): void {

  useCarDataStore.getState().reset();
  useFilterStore.getState().reset();
  useBookedCarDetailsStore.getState().resetStore();
  useUserPreferedFiltersStore.getState().resetFilters();
  useLocationStore.getState().resetLocationState();
  usePickupDialogStore.getState().resetDialogState();

  sessionStorage.removeItem("hasClosedLocationDialog");
}
