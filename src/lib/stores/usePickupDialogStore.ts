import { create } from "zustand";
import { PickUpCardDetails } from "@/types/pickUpTypes";

type PickupDialogState = {
  open: boolean;
  activeTab: PickUpCardDetails["key"];
  openDialog: (tab?: PickUpCardDetails["key"]) => void;
  closeDialog: () => void;
  setOpen: (open: boolean) => void;
};

export const usePickupDialogStore = create<PickupDialogState>((set) => ({
  open: false,
  activeTab: "currentLocation",

  openDialog: (tab = "currentLocation") => set({ open: true, activeTab: tab }),

  closeDialog: () => set({ open: false }),

  setOpen: (open) => set({ open }),
}));
