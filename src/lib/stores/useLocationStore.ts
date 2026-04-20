import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  isDialogOpen: boolean;
  setLatitude: (lat: number | null) => void;
  setLongitude: (lng: number | null) => void;
  setAddress: (address: string | null) => void;
  setLocation: (lat: number | null, lng: number | null, address?: string | null) => void;
  openDialog: () => void;
  closeDialog: () => void;
  resetLocationState: () => void;
}

const initialLocationState = {
  latitude: null as number | null,
  longitude: null as number | null,
  address: null as string | null,
  isDialogOpen: false,
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocationState,
      setLatitude: (latitude) => set({ latitude }),
      setLongitude: (longitude) => set({ longitude }),
      setAddress: (address) => set({ address }),
      setLocation: (latitude, longitude, address = null) => 
        set({ latitude, longitude, address }),
      openDialog: () => set({ isDialogOpen: true }),
      closeDialog: () => set({ isDialogOpen: false }),
      resetLocationState: () => set(initialLocationState),
    }),
    {
      name: "user-location-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        address: state.address,
      }),
    }
  )
);

