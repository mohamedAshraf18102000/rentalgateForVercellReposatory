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
};

export const usePickupDialogStore = create<PickupDialogState>((set, get) => ({
  open: false,
  activeTab: "currentLocation",
  target: "pickup",
  onConfirm: undefined,

  openDialog: (tab = "currentLocation", target = "pickup", onConfirm) =>
    set({ open: true, activeTab: tab, target, onConfirm }),

  closeDialog: () => set({ open: false, onConfirm: undefined }),

  confirmDialog: () => {
    get().onConfirm?.();
    set({ open: false, onConfirm: undefined });
  },

  setOpen: (open) => set({ open }),
}));
