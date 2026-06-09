import { redirect } from "@/i18n/routing";
import { checkBackendHealth } from "@/lib/health";
import { isServerUnavailable } from "./api-error";

/**
 * Call from server components / server actions after a failed fetch.
 * Redirects to maintenance only when the backend health check is not UP.
 */
export async function redirectIfServerUnavailable(
  error: unknown,
  locale: string,
): Promise<never> {
  if (isServerUnavailable(error)) {
    const { isUp } = await checkBackendHealth();
    if (!isUp) {
      redirect({ href: "/maintenance", locale });
    }
  }

  throw error;
}
