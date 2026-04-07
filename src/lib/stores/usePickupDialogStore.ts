import { create } from "zustand";
import { PickUpCardDetails } from "@/types/pickUpTypes";

export type TargetField = "pickup" | "return";

type PickupDialogState = {
  open: boolean;
  activeTab: PickUpCardDetails["key"];
  target: TargetField;
  onConfirm?: () => void;
  openDialog: (tab?: PickUpCardDetails["key"], target?: TargetField, onConfirm?: () => void) => void;
  closeDialog: () => void;
  confirmDialog: () => void;
  setOpen: (open: boolean) => void;
  isUnsavedMapLocation: boolean;
  setIsUnsavedMapLocation: (value: boolean) => void;
  setActiveTab: (tab: PickUpCardDetails["key"]) => void;
};

export const usePickupDialogStore = create<PickupDialogState>((set, get) => ({
  open: false,
  activeTab: "currentLocation",
  target: "pickup",
  onConfirm: undefined,
  isUnsavedMapLocation: true,

  openDialog: (tab = "currentLocation", target = "pickup", onConfirm) =>
    set({ open: true, activeTab: tab, target, onConfirm, isUnsavedMapLocation: true }),

  closeDialog: () => set({ open: false, onConfirm: undefined }),

  confirmDialog: () => {
    get().onConfirm?.();
    set({ open: false, onConfirm: undefined });
  },

  setOpen: (open) => set({ open }),
  
  setIsUnsavedMapLocation: (value) => set({ isUnsavedMapLocation: value }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
