"use client";

import * as React from "react";
import { DialogContext } from "../context/DialogContext";

/**
 * useDialog Hook
 * 
 * Hook to access dialog management functions.
 * Must be used within a DialogProvider.
 * 
 * @returns {Object} Dialog management functions
 * @returns {Function} openDialog - Opens a dialog with type-safe props
 * @returns {Function} closeDialog - Closes the currently open dialog
 * @returns {DialogState} currentDialog - Current dialog state
 * 
 * @throws {Error} If used outside DialogProvider
 */
export function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

