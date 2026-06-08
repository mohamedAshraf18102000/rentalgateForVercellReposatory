import { redirect } from "@/i18n/routing";
import { isServerUnavailable } from "./api-error";

/**
 * Call from server components / server actions after a failed fetch.
 * Redirects to maintenance when the API is down; rethrows other errors.
 */
export function redirectIfServerUnavailable(
  error: unknown,
  locale: string,
): never {
  if (isServerUnavailable(error)) {
    redirect({ href: "/maintenance", locale });
  }

  throw error;
}
