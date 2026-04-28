import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  confirmedDialogAddress: string | null;
  confirmedDialogLatitude: number | null;
  confirmedDialogLongitude: number | null;
  isDialogOpen: boolean;
  dialogSource: "homeCard" | "navbar" | "auto" | null;
  setLatitude: (lat: number | null) => void;
  setLongitude: (lng: number | null) => void;
  setAddress: (address: string | null) => void;
  setConfirmedDialogAddress: (address: string | null) => void;
  setConfirmedDialogLocation: (
    address: string | null,
    latitude: number | null,
    longitude: number | null,
  ) => void;
  clearConfirmedDialogLocation: () => void;
  setLocation: (lat: number | null, lng: number | null, address?: string | null) => void;
  openDialog: (source?: "homeCard" | "navbar" | "auto") => void;
  closeDialog: () => void;
  resetLocationState: () => void;
}

const initialLocationState = {
  latitude: null as number | null,
  longitude: null as number | null,
  address: null as string | null,
  confirmedDialogAddress: null as string | null,
  confirmedDialogLatitude: null as number | null,
  confirmedDialogLongitude: null as number | null,
  isDialogOpen: false,
  dialogSource: null as "homeCard" | "navbar" | "auto" | null,
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocationState,
      setLatitude: (latitude) => set({ latitude }),
      setLongitude: (longitude) => set({ longitude }),
      setAddress: (address) => set({ address }),
      setConfirmedDialogAddress: (confirmedDialogAddress) =>
        set({ confirmedDialogAddress }),
      setConfirmedDialogLocation: (
        confirmedDialogAddress,
        confirmedDialogLatitude,
        confirmedDialogLongitude,
      ) =>
        set({
          confirmedDialogAddress,
          confirmedDialogLatitude,
          confirmedDialogLongitude,
        }),
      clearConfirmedDialogLocation: () =>
        set({
          confirmedDialogAddress: null,
          confirmedDialogLatitude: null,
          confirmedDialogLongitude: null,
        }),
      setLocation: (latitude, longitude, address = null) =>
        set({ latitude, longitude, address }),
      openDialog: (source) =>
        set({ isDialogOpen: true, dialogSource: source ?? null }),
      closeDialog: () => set({ isDialogOpen: false, dialogSource: null }),
      resetLocationState: () => set(initialLocationState),
    }),
    {
      name: "user-location-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        address: state.address,
        confirmedDialogAddress: state.confirmedDialogAddress,
        confirmedDialogLatitude: state.confirmedDialogLatitude,
        confirmedDialogLongitude: state.confirmedDialogLongitude,
      }),
    }
  )
);

