import { getCookie } from "@/util/cookies";

const getAuthToken = async () => {
  if (typeof document !== "undefined") {
    return getCookie("authToken");
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("authToken")?.value ?? null;
  } catch {
    return null;
  }
};

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = await getAuthToken();

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

  const res = await fetch(`https://api.rentalgate.net/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": currentLocale,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), 
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = "API Error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || "API Error";
    } catch (e) {
      // Not a JSON error or empty body
      console.log("Error fetching data:", e);

    }
    throw new Error(errorMessage);
  }

  return res.json();
}
