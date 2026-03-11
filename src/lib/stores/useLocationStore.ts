import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  setLatitude: (lat: number | null) => void;
  setLongitude: (lng: number | null) => void;
  setAddress: (address: string | null) => void;
  setLocation: (lat: number | null, lng: number | null, address?: string | null) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      address: null,
      setLatitude: (latitude) => set({ latitude }),
      setLongitude: (longitude) => set({ longitude }),
      setAddress: (address) => set({ address }),
      setLocation: (latitude, longitude, address = null) => 
        set({ latitude, longitude, address }),
    }),
    {
      name: "user-location-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
