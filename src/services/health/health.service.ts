import { fetcher } from "../api";

/**
 * Lightweight probe to determine whether the API is reachable.
 * Uses the same endpoint as the home page because there is no dedicated health route.
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    await fetcher("/main_home", {
      skipErrorToast: true,
      cache: "no-store",
    });
    return true;
  } catch {
    return false;
  }
};
