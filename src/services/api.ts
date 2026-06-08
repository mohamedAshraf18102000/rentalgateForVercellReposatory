import {
  ApiError,
  ApiUnavailableError,
} from "@/lib/api/api-error";
import {
  getDialogMessage,
} from "@/lib/utils/errorMessagesHandler";
import { emitApiErrorDialog } from "@/lib/utils/errorDialogEvents";
import { getCookie } from "@/util/cookies";
import { API_BASE_URL } from "@/util/api";

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

export async function getLocaleRequestHeaders(): Promise<Record<string, string>> {
  const currentLocale = await getCurrentLocale();
  return {
    "Accept-Language": currentLocale,
    "X-Locale": currentLocale,
  };
}

export async function fetcher<T>(
  url: string,
  options?: (RequestInit & { skipErrorToast?: boolean }),
): Promise<T> {
  const token = await getAuthToken();
  const localeHeaders = await getLocaleRequestHeaders();
  const requestHeaders = new Headers(options?.headers);
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Accept-Language", localeHeaders["Accept-Language"]);
  requestHeaders.set("X-Locale", localeHeaders["X-Locale"]);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: requestHeaders,
    });
  } catch (error) {
    throw new ApiUnavailableError(error);
  }

  if (!res.ok) {
    let errorMessage = "API Error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || "API Error";
    } catch (e) {
      // Not a JSON error or empty body
      console.log("Error fetching data:", e);
    }

    if (res.status >= 500) {
      throw new ApiUnavailableError(new ApiError(errorMessage, { status: res.status }));
    }

    if (!options?.skipErrorToast) {
      emitApiErrorDialog(getDialogMessage(errorMessage));
    }
    throw new ApiError(errorMessage, { status: res.status });
  }

  return res.json();
}
