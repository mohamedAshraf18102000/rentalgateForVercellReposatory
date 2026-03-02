/**
 * Dialog Management System - Public API
 * 
 * Exports:
 * - DialogProvider: Context provider that must wrap your app
 * - useDialog: Hook to open/close dialogs with full type safety
 * - DialogName: Type for dialog names (useful for type checking)
 * - DialogPropsMap: Type mapping for dialog props
 */

export { DialogProvider } from "./components/DialogProvider";
export { useDialog } from "./hooks/useDialog";
export type { DialogName, DialogPropsMap } from "./types/dialog.types";

