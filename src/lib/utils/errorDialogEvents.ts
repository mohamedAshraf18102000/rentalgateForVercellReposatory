import type { ReactNode } from "react";

const API_ERROR_DIALOG_EVENT = "api:error-dialog";
const APP_NAVIGATE_EVENT = "app:navigate";
const CLOSE_DIALOG_EVENT = "dialog:close";

type ApiErrorDialogDetail = {
  message: ReactNode;
};

type AppNavigateDetail = {
  href: string;
  replace?: boolean;
};

export const emitApiErrorDialog = (message: ReactNode) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ApiErrorDialogDetail>(API_ERROR_DIALOG_EVENT, {
      detail: { message },
    }),
  );
};

export const onApiErrorDialog = (
  handler: (detail: ApiErrorDialogDetail) => void,
) => {
  if (typeof window === "undefined") return () => { };

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<ApiErrorDialogDetail>;
    handler(customEvent.detail);
  };

  window.addEventListener(API_ERROR_DIALOG_EVENT, listener);
  return () => window.removeEventListener(API_ERROR_DIALOG_EVENT, listener);
};

export const emitAppNavigate = (detail: AppNavigateDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AppNavigateDetail>(APP_NAVIGATE_EVENT, {
      detail,
    }),
  );
};

export const onAppNavigate = (handler: (detail: AppNavigateDetail) => void) => {
  if (typeof window === "undefined") return () => { };

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<AppNavigateDetail>;
    handler(customEvent.detail);
  };

  window.addEventListener(APP_NAVIGATE_EVENT, listener);
  return () => window.removeEventListener(APP_NAVIGATE_EVENT, listener);
};

export const emitCloseDialog = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CLOSE_DIALOG_EVENT));
};

export const onCloseDialog = (handler: () => void) => {
  if (typeof window === "undefined") return () => { };

  const listener = () => {
    handler();
  };

  window.addEventListener(CLOSE_DIALOG_EVENT, listener);
  return () => window.removeEventListener(CLOSE_DIALOG_EVENT, listener);
};
