import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Session-scoped zustand persist key (cleared when the browser tab/session ends). */
export const SESSION_LOCATION_STORAGE_KEY = "user-location-session";

/** Legacy localStorage key — removed on startup so locations are never permanent. */
export const LEGACY_LOCATION_STORAGE_KEY = "user-location-storage";

export type SetUserPhysicalLocationOptions = {
  /** When true, auto-detection must not overwrite until the tab/session ends. */
  isSessionManual?: boolean;
};

interface LocationState {
  userPhysical_Latitude: number | null;
  userPhysical_Longitude: number | null;
  userPhysical_Address: string | null;
  userPhysical_AddressId: number | null;
  /** Map/saved-address pick within the current browser session only. */
  isSessionManualLocation: boolean;

  isDialogOpen: boolean;
  dialogOpenSource: string | null;
  /** True while browser geolocation is resolving (not persisted). */
  isDetectingUserLocation: boolean;

  setUserPhysical_Latitude: (lat: number | null) => void;
  setUserPhysical_Longitude: (lng: number | null) => void;
  setUserPhysical_Address: (address: string | null) => void;
  setUserPhysical_AddressId: (addressId: number | null) => void;

  setUserPhysical_Location: (
    lat: number | null,
    lng: number | null,
    address?: string | null,
    addressId?: number | null,
    options?: SetUserPhysicalLocationOptions,
  ) => void;

  openDialog: (source?: string) => void;
  closeDialog: () => void;
  setIsDetectingUserLocation: (isDetecting: boolean) => void;

  resetLocationState: () => void;
}

const initialLocationState = {
  userPhysical_Latitude: null,
  userPhysical_Longitude: null,
  userPhysical_Address: null,
  userPhysical_AddressId: null,
  isSessionManualLocation: false,
  isDialogOpen: false,
  dialogOpenSource: null,
  isDetectingUserLocation: false,
};

export const clearLegacyLocationStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_LOCATION_STORAGE_KEY);
};

/**
 * Session cookie for SSR/navigation within the same browser tab.
 * Omitted max-age so the cookie is cleared when the browser session ends.
 */
const setSessionCookie = (name: string, value: string | number | null) => {
  if (typeof document === "undefined") return;

  if (value == null || value === "") {
    document.cookie = `${name}=; path=/; max-age=0`;
    return;
  }

  document.cookie = `${name}=${value}; path=/`;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocationState,

      setUserPhysical_Latitude: (lat) => {
        set({ userPhysical_Latitude: lat });
        setSessionCookie("lat", lat);
      },

      setUserPhysical_Longitude: (lng) => {
        set({ userPhysical_Longitude: lng });
        setSessionCookie("lng", lng);
      },

      setUserPhysical_Address: (address) => {
        set({ userPhysical_Address: address });
      },

      setUserPhysical_AddressId: (addressId) => {
        set({ userPhysical_AddressId: addressId });
      },

      setUserPhysical_Location: (
        lat,
        lng,
        address = null,
        addressId = null,
        options,
      ) => {
        set({
          userPhysical_Latitude: lat,
          userPhysical_Longitude: lng,
          userPhysical_Address: address,
          userPhysical_AddressId: addressId,
          ...(options?.isSessionManual !== undefined
            ? { isSessionManualLocation: options.isSessionManual }
            : {}),
        });

        setSessionCookie("lat", lat);
        setSessionCookie("lng", lng);
      },

      openDialog: (source) =>
        set({ isDialogOpen: true, dialogOpenSource: source ?? null }),

      closeDialog: () =>
        set({ isDialogOpen: false, dialogOpenSource: null }),

      setIsDetectingUserLocation: (isDetecting) =>
        set({ isDetectingUserLocation: isDetecting }),

      resetLocationState: () => {
        set(initialLocationState);
        setSessionCookie("lat", null);
        setSessionCookie("lng", null);
      },
    }),

    {
      name: SESSION_LOCATION_STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => sessionStorage),

      migrate: (persistedState, version) => {
        clearLegacyLocationStorage();

        if (version < 2) {
          return { ...initialLocationState };
        }

        const state = persistedState as Partial<typeof initialLocationState> & {
          isCustomLocation?: boolean;
        };

        return {
          userPhysical_Latitude: state.userPhysical_Latitude ?? null,
          userPhysical_Longitude: state.userPhysical_Longitude ?? null,
          userPhysical_Address: state.userPhysical_Address ?? null,
          userPhysical_AddressId: state.userPhysical_AddressId ?? null,
          isSessionManualLocation:
            state.isSessionManualLocation ??
            state.isCustomLocation ??
            false,
        };
      },

      partialize: (state) => ({
        userPhysical_Latitude: state.userPhysical_Latitude,
        userPhysical_Longitude: state.userPhysical_Longitude,
        userPhysical_Address: state.userPhysical_Address,
        userPhysical_AddressId: state.userPhysical_AddressId,
        isSessionManualLocation: state.isSessionManualLocation,
      }),

      onRehydrateStorage: () => (state, error) => {
        clearLegacyLocationStorage();

        if (error || !state) return;

        if (
          state.userPhysical_Latitude != null &&
          state.userPhysical_Longitude != null
        ) {
          setSessionCookie("lat", state.userPhysical_Latitude);
          setSessionCookie("lng", state.userPhysical_Longitude);
        }
      },
    },
  ),
);
