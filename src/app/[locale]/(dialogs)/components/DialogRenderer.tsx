"use client";

import * as React from "react";
import type { DialogName, DialogState } from "../types/dialog.types";
import { dialogRegistry } from "../registry/dialogRegistry";

/**
 * DialogRenderer
 * 
 * Renders the currently active dialog based on the dialog state.
 * Uses type inference to ensure the correct component receives the correct props.
 * No switch-case needed - the registry handles the mapping.
 * 
 * Type safety is maintained through the discriminated union in DialogState
 * and the strongly typed registry.
 * 
 * @param {DialogState} dialogState - Current dialog state
 */
export function DialogRenderer({ dialogState }: { dialogState: DialogState }) {
  if (!dialogState) {
    return null;
  }

  const { name, props } = dialogState;
  const DialogComponent = dialogRegistry[name];

  if (!DialogComponent) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Dialog "${name}" not found in registry`);
    }
    return null;
  }

  // Type assertion is safe here because:
  // 1. DialogState is a discriminated union ensuring name matches props
  // 2. dialogRegistry is strongly typed to match DialogState
  // 3. TypeScript validates the registry at compile time
  return <DialogComponent {...(props as any)} />;
}

