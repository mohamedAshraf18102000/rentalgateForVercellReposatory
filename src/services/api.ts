import { getCookie } from "@/util/cookies";

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = typeof document !== "undefined" ? getCookie("authToken") : null;

  let currentLocale = "ar";
  if (typeof document !== "undefined") {
    const pathSegment = window.location.pathname.split("/")[1];
    if (pathSegment === "ar" || pathSegment === "en") {
      currentLocale = pathSegment;
    } else {
      const cookieLocale = getCookie("NEXT_LOCALE");
      if (cookieLocale === "ar" || cookieLocale === "en") {
        currentLocale = cookieLocale;
      }
    }
  }

  const res = await fetch(`https://rentalgate.net/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": currentLocale,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let errorMessage = "API Error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || "API Error";
    } catch (e) {
      // Not a JSON error or empty body
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
