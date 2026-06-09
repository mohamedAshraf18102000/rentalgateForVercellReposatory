"use client";

import { BACKEND_HEALTH_STATUS_UP } from "@/lib/health";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_POLL_INTERVAL_MS = 15_000;

type UseBackendHealthPollingOptions = {
  enabled?: boolean;
  intervalMs?: number;
  onHealthy?: () => void;
};

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

export function useBackendHealthPolling({
  enabled = true,
  intervalMs = DEFAULT_POLL_INTERVAL_MS,
  onHealthy,
}: UseBackendHealthPollingOptions = {}) {
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const isHealthy = await fetchSiteHealth();
      if (isHealthy) {
        onHealthy?.();
      }
      return isHealthy;
    } finally {
      setIsChecking(false);
    }
  }, [onHealthy]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void checkHealth();
    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [checkHealth, enabled, intervalMs]);

  return { checkHealth, isChecking };
}
