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
  userPhysical_Latitude: null as number | null,
  userPhysical_Longitude: null as number | null,
  userPhysical_Address: null as string | null,
  userPhysical_AddressId: null as number | null,
  isDialogOpen: false,
  dialogOpenSource: null as string | null,
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      ...initialLocationState,
      setUserPhysical_Latitude: (latitude) => set({ userPhysical_Latitude: latitude }),
      setUserPhysical_Longitude: (longitude) => set({ userPhysical_Longitude: longitude }),
      setUserPhysical_Address: (address) => set({ userPhysical_Address: address }),
      setUserPhysical_AddressId: (addressId) => set({ userPhysical_AddressId: addressId }),
      setUserPhysical_Location: (latitude, longitude, address = null, addressId = null) =>
        set({
          userPhysical_Latitude: latitude,
          userPhysical_Longitude: longitude,
          userPhysical_Address: address,
          userPhysical_AddressId: addressId,
        }),
      openDialog: (source) =>
        set({ isDialogOpen: true, dialogOpenSource: source ?? null }),
      closeDialog: () => set({ isDialogOpen: false, dialogOpenSource: null }),
      resetLocationState: () => set(initialLocationState),
    }),
    {
      name: "user-location-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userPhysical_Latitude: state.userPhysical_Latitude,
        userPhysical_Longitude: state.userPhysical_Longitude,
        userPhysical_Address: state.userPhysical_Address,
        userPhysical_AddressId: state.userPhysical_AddressId,
      }),
    }
  )
);

