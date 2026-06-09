import { API_BASE_URL } from "@/util/api";
import {
  BACKEND_HEALTH_STATUS_UP,
  type BackendHealthCheckResult,
  type BackendHealthResponse,
} from "./types";

const HEALTH_CHECK_TIMEOUT_MS = 5_000;

export function getBackendHealthUrl(): string {
  const configured = process.env.NEXT_PUBLIC_HEALTH_CHECK_URL;
  if (configured) {
    return configured;
  }

  const apiBase = API_BASE_URL.replace(/\/$/, "");

  // Health is served at the backend root (/health), not under the /api prefix.
  if (apiBase.endsWith("/api")) {
    return `${apiBase.slice(0, -4)}/health`;
  }

  return `${apiBase}/health`;
}

export function isBackendUp(
  response: BackendHealthResponse | null | undefined,
): boolean {
  return response?.status === BACKEND_HEALTH_STATUS_UP;
}

export async function fetchBackendHealth(): Promise<BackendHealthResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    HEALTH_CHECK_TIMEOUT_MS,
  );

  try {
    const response = await fetch(getBackendHealthUrl(), {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as BackendHealthResponse;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkBackendHealth(): Promise<BackendHealthCheckResult> {
  const health = await fetchBackendHealth();

  return {
    isUp: isBackendUp(health),
    status: health?.status ?? null,
  };
}

/** @deprecated Use checkBackendHealth instead */
export async function checkApiAvailability(): Promise<boolean> {
  const { isUp } = await checkBackendHealth();
  return isUp;
}
