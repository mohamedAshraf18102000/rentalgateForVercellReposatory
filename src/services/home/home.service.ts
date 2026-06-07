import { HomeResponse } from "@/types/home/home";
import { unstable_cache } from "next/cache";
import { fetcher } from "../api";

export const getHomePageDetails = async (options?: {
  skipErrorToast?: boolean;
  cache?: RequestCache;
}): Promise<HomeResponse> => {
  return fetcher<HomeResponse>("/main_home", {
    skipErrorToast: options?.skipErrorToast,
    cache: options?.cache,
  });
};

export const getHomePageDetailsCached = unstable_cache(
  async () => getHomePageDetails({ skipErrorToast: true }),
  ["home-page-details"],
  {
    revalidate: 300,
    tags: ["home-page-details"],
  },
);

const hasAuthToken = async (): Promise<boolean> => {
  if (typeof window !== "undefined") {
    return document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith("authToken"));
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return Boolean(cookieStore.get("authToken")?.value);
  } catch {
    return false;
  }
};

export const getHomePageDetailsWithAuth = async (options?: {
  skipErrorToast?: boolean;
}): Promise<HomeResponse> => {
  const fetchOptions = { skipErrorToast: options?.skipErrorToast ?? true };

  // Do not use shared cache for authenticated users.
  if (await hasAuthToken()) {
    return getHomePageDetails(fetchOptions);
  }

  return getHomePageDetailsCached();
};