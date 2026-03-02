"use client";

import * as React from "react";
import type { DialogName, DialogPropsMap, DialogState } from "../types/dialog.types";

/**
 * Dialog Context Value Interface
 */
export interface DialogContextValue {
  openDialog: <K extends DialogName>(
    name: K,
    props: DialogPropsMap[K]
  ) => void;
  closeDialog: () => void;
  currentDialog: DialogState;
}

/**
 * Dialog Context
 * 
 * React Context for dialog state management.
 * Should not be used directly - use useDialog hook instead.
 */
export const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined
);

