import { isMaintenancePath } from "@/lib/health/paths";
import { isServerUnavailable } from "./api-error";

/**
 * Custom DOM event dispatched whenever the backend is detected as unreachable.
 * BackendHealthWatcher listens to this event and performs a single, deduplicated
 * health check before soft-navigating to the maintenance page.
 * Using a custom event keeps the redirect inside React (router.replace) instead
 * of triggering a full browser reload via window.location.href.
 */
export const BACKEND_MAINTENANCE_EVENT = "rental-gate:maintenance" as const;

/**
 * Signals that the backend may be down by dispatching a DOM event.
 * BackendHealthWatcher (mounted in the locale layout) receives it and
 * performs the actual navigation — no hard page reload occurs.
 */
export function redirectToMaintenanceClient(): void {
  if (typeof window === "undefined") return;
  if (isMaintenancePath(window.location.pathname)) return;

  window.dispatchEvent(new Event(BACKEND_MAINTENANCE_EVENT));
}

/**
 * Called by the React Query QueryCache/MutationCache global onError.
 * Fires immediately (no retry delay) because ReactQueryProvider configures
 * retry: false for ApiUnavailableError.
 */
export function handleClientApiError(error: unknown): void {
  if (!isServerUnavailable(error)) return;
  redirectToMaintenanceClient();
}
