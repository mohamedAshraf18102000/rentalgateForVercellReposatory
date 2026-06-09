import { checkBackendHealth } from "./check-backend-health";

const HEALTH_CACHE_TTL_MS = 30_000;

type HealthCacheEntry = {
  isUp: boolean;
  expiresAt: number;
};

let healthCache: HealthCacheEntry | null = null;

export async function getCachedBackendHealth(): Promise<boolean> {
  const now = Date.now();

  if (healthCache && now < healthCache.expiresAt) {
    return healthCache.isUp;
  }

  const { isUp } = await checkBackendHealth();
  healthCache = {
    isUp,
    expiresAt: now + HEALTH_CACHE_TTL_MS,
  };

  return isUp;
}

export function clearBackendHealthCache(): void {
  healthCache = null;
}
