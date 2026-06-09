"use client";

import { BACKEND_HEALTH_STATUS_UP } from "@/lib/health";
import { isMaintenancePath } from "@/lib/health/paths";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const HEALTH_POLL_INTERVAL_MS = 30_000;

async function fetchSiteHealth(): Promise<boolean> {
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

export function BackendHealthWatcher() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname || isMaintenancePath(pathname)) {
      return;
    }

    const redirectToMaintenance = () => {
      const locale = pathname.split("/").filter(Boolean)[0] || "ar";
      router.replace(`/${locale}/maintenance`);
    };

    const checkHealth = async () => {
      const isHealthy = await fetchSiteHealth();
      if (!isHealthy) {
        redirectToMaintenance();
      }
    };

    void checkHealth();
    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, HEALTH_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [pathname, router]);

  return null;
}
