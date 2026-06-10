"use client";

import { BACKEND_HEALTH_STATUS_UP } from "@/lib/health";
import { isMaintenancePath } from "@/lib/health/paths";
import { BACKEND_MAINTENANCE_EVENT } from "@/lib/api/client-redirect";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const HEALTH_POLL_INTERVAL_MS = 30_000;

async function fetchSiteHealth(): Promise<boolean> {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (!response.ok) return false;
    const data = (await response.json()) as { status?: string };
    return data.status === BACKEND_HEALTH_STATUS_UP;
  } catch {
    return false;
  }
}

export function BackendHealthWatcher() {
  const pathname = usePathname();
  const router = useRouter();

  // True only when the user is already on the maintenance page.
  // Derived here so it can be a stable effect dependency.
  const isOnMaintenancePage = !!pathname && isMaintenancePath(pathname);

  // Prevents parallel in-flight health checks from piling up when
  // the interval fires at the same time as an API error event.
  const isCheckingRef = useRef(false);

  const checkAndRedirectIfDown = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    try {
      const isHealthy = await fetchSiteHealth();
      if (!isHealthy) {
        // Read the locale from the live URL at redirect time, not from the
        // stale closure — avoids wrong locale after client-side navigation.
        const locale =
          window.location.pathname.split("/").filter(Boolean)[0] || "ar";
        router.replace(`/${locale}/maintenance`);
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, [router]);

  // Polling loop — only depends on whether we are already on the maintenance
  // page. Removing `pathname` from the dep array prevents the effect from
  // restarting (and firing an extra health check) on every client navigation.
  useEffect(() => {
    if (isOnMaintenancePage) return;

    void checkAndRedirectIfDown();
    const intervalId = window.setInterval(
      () => void checkAndRedirectIfDown(),
      HEALTH_POLL_INTERVAL_MS,
    );

    return () => window.clearInterval(intervalId);
  }, [isOnMaintenancePage, checkAndRedirectIfDown]);

  // Event listener — receives the signal dispatched by handleClientApiError
  // (React Query onError) and error.tsx when a request fails with a 5xx or
  // network error. This replaces the old window.location.href hard-reload path.
  useEffect(() => {
    if (isOnMaintenancePage) return;

    const handleMaintenanceEvent = () => void checkAndRedirectIfDown();
    window.addEventListener(BACKEND_MAINTENANCE_EVENT, handleMaintenanceEvent);
    return () =>
      window.removeEventListener(
        BACKEND_MAINTENANCE_EVENT,
        handleMaintenanceEvent,
      );
  }, [isOnMaintenancePage, checkAndRedirectIfDown]);

  return null;
}
