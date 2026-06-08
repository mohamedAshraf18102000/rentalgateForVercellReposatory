import { isServerUnavailable } from "./api-error";

export function redirectToMaintenanceClient(): void {
  if (typeof window === "undefined") {
    return;
  }

  const [, locale = "ar"] = window.location.pathname.split("/");

  if (window.location.pathname.includes("/maintenance")) {
    return;
  }

  window.location.href = `/${locale}/maintenance`;
}

export function handleClientApiError(error: unknown): void {
  if (isServerUnavailable(error)) {
    redirectToMaintenanceClient();
  }
}
