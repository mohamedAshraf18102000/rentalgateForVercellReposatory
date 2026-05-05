import {
  getDialogMessage,
} from "@/lib/utils/errorMessagesHandler";
import { emitApiErrorDialog } from "@/lib/utils/errorDialogEvents";
import { getCookie } from "@/util/cookies";

type AppLocale = "ar" | "en";

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

const isValidLocale = (value: string | null | undefined): value is AppLocale =>
  value === "ar" || value === "en";

const getCurrentLocale = async (): Promise<AppLocale> => {
  if (typeof document !== "undefined") {
    const pathSegment = window.location.pathname.split("/")[1];
    if (isValidLocale(pathSegment)) {
      return pathSegment;
    }

    const cookieLocale = getCookie("NEXT_LOCALE");
    if (isValidLocale(cookieLocale)) {
      return cookieLocale;
    }

    return "ar";
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (isValidLocale(cookieLocale)) {
      return cookieLocale;
    }
  } catch {
    // Ignore and fallback to default locale.
  }

  return "ar";
};

export async function fetcher<T>(
  url: string,
  options?: (RequestInit & { skipErrorToast?: boolean }),
): Promise<T> {
  const token = await getAuthToken();
  const currentLocale = await getCurrentLocale();
  const requestHeaders = new Headers(options?.headers);
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Accept-Language", currentLocale);
  requestHeaders.set("X-Locale", currentLocale);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`https://api.rentalgate.net/api${url}`, {
    ...options,
    headers: requestHeaders,
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
    if (!options?.skipErrorToast) {
      emitApiErrorDialog(getDialogMessage(errorMessage));
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
