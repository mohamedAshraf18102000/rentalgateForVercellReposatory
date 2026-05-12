import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationState {
  userPhysical_Latitude: number | null;
  userPhysical_Longitude: number | null;
  userPhysical_Address: string | null;
  userPhysical_AddressId: number | null;

  isDialogOpen: boolean;
  dialogOpenSource: string | null;

  setUserPhysical_Latitude: (lat: number | null) => void;
  setUserPhysical_Longitude: (lng: number | null) => void;
  setUserPhysical_Address: (address: string | null) => void;
  setUserPhysical_AddressId: (addressId: number | null) => void;

  setUserPhysical_Location: (
    lat: number | null,
    lng: number | null,
    address?: string | null,
    addressId?: number | null
  ) => void;

  openDialog: (source?: string) => void;
  closeDialog: () => void;

  resetLocationState: () => void;
}

const initialLocationState = {
  userPhysical_Latitude: null,
  userPhysical_Longitude: null,
  userPhysical_Address: null,
  userPhysical_AddressId: null,
  isDialogOpen: false,
  dialogOpenSource: null,
};

/**
 * Safe cookie setter (browser only)
 */
const setCookie = (name: string, value: string | number | null) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${value ?? ""}; path=/; max-age=31536000`;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocationState,

      // =========================
      // Individual setters
      // =========================
      setUserPhysical_Latitude: (lat) => {
        set({ userPhysical_Latitude: lat });
        setCookie("lat", lat);
      },

      setUserPhysical_Longitude: (lng) => {
        set({ userPhysical_Longitude: lng });
        setCookie("lng", lng);
      },

      setUserPhysical_Address: (address) => {
        set({ userPhysical_Address: address });
      },

      setUserPhysical_AddressId: (addressId) => {
        set({ userPhysical_AddressId: addressId });
      },

      // =========================
      // Combined setter (IMPORTANT)
      // =========================
      setUserPhysical_Location: (lat, lng, address = null, addressId = null) => {
        set({
          userPhysical_Latitude: lat,
          userPhysical_Longitude: lng,
          userPhysical_Address: address,
          userPhysical_AddressId: addressId,
        });

        // sync for SSR usage
        setCookie("lat", lat);
        setCookie("lng", lng);
      },

      // =========================
      // Dialog state
      // =========================
      openDialog: (source) =>
        set({ isDialogOpen: true, dialogOpenSource: source ?? null }),

      closeDialog: () =>
        set({ isDialogOpen: false, dialogOpenSource: null }),

      // =========================
      // Reset
      // =========================
      resetLocationState: () => {
        set(initialLocationState);

        setCookie("lat", "");
        setCookie("lng", "");
      },
    }),

    {
      name: "user-location-storage",

      // localStorage only (client side)
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        userPhysical_Latitude: state.userPhysical_Latitude,
        userPhysical_Longitude: state.userPhysical_Longitude,
        userPhysical_Address: state.userPhysical_Address,
        userPhysical_AddressId: state.userPhysical_AddressId,
      }),

      /** Align document cookies with rehydrated coords so SSR reads `lat`/`lng`. */
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        if (
          state.userPhysical_Latitude != null &&
          state.userPhysical_Longitude != null
        ) {
          setCookie("lat", state.userPhysical_Latitude);
          setCookie("lng", state.userPhysical_Longitude);
        }
      },
    }
  )
);