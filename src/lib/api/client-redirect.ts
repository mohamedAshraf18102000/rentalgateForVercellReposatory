import { BACKEND_HEALTH_STATUS_UP } from "@/lib/health";
import { isMaintenancePath } from "@/lib/health/paths";
import { isServerUnavailable } from "./api-error";

export function redirectToMaintenanceClient(): void {
  if (typeof window === "undefined") {
    return;
  }

  const pathname = window.location.pathname;

  if (isMaintenancePath(pathname)) {
    return;
  }

  const [, locale = "ar"] = pathname.split("/");
  window.location.href = `/${locale}/maintenance`;
}

async function isBackendHealthyClient(): Promise<boolean> {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { status?: string };
    return data.status === BACKEND_HEALTH_STATUS_UP;
  } catch {
    return false;
  }
}

export function handleClientApiError(error: unknown): void {
  if (!isServerUnavailable(error)) {
    return;
  }

  void isBackendHealthyClient().then((isHealthy) => {
    if (!isHealthy) {
      redirectToMaintenanceClient();
    }
  });
}
