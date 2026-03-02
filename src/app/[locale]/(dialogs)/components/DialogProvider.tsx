"use client";

import * as React from "react";
import type { DialogName, DialogPropsMap, DialogState } from "../types/dialog.types";
import { DialogContext } from "../context/DialogContext";
import { DialogRenderer } from "./DialogRenderer";

/**
 * DialogProvider
 * 
 * Context provider that manages dialog state and renders active dialogs.
 * Must wrap your application to enable dialog functionality.
 * 
 * @param {React.ReactNode} children - Child components
 */
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = React.useState<DialogState>(null);

  const openDialog = React.useCallback(
    <K extends DialogName>(name: K, props: DialogPropsMap[K]) => {
      const onClose = () => {
        setDialogState(null);
      };

      // Type-safe state creation using discriminated union
      const state: DialogState = {
        name,
        props: {
          ...props,
          onClose,
        } as DialogState extends { name: K; props: infer P } ? P : never,
      } as DialogState;

      setDialogState(state);
    },
    []
  );

  const closeDialog = React.useCallback(() => {
    setDialogState(null);
  }, []);

  const value = React.useMemo(
    () => ({
      openDialog,
      closeDialog,
      currentDialog: dialogState,
    }),
    [openDialog, closeDialog, dialogState]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <DialogRenderer dialogState={dialogState} />
    </DialogContext.Provider>
  );
}

