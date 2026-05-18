import { routing } from "@/i18n/routing";

/**
 * Routes that require authentication (without locale prefix).
 */
export const PROTECTED_ROUTES = [
  "/profile",
  "/userProfile",
  "/myBookings",
  "/wallet",
  "/reservation",
] as const;

const localePattern = new RegExp(
  `^/(${routing.locales.join("|")})(/|$)`,
);

/** Strip locale prefix from a pathname (e.g. /ar/userProfile -> /userProfile). */
export function stripLocalePrefix(pathname: string): string {
  const withoutLocale = pathname.replace(localePattern, "/") || "/";
  return withoutLocale === "/" ? "/" : withoutLocale.replace(/\/$/, "") || "/";
}

/** Check if a pathname (with or without locale) is protected. */
export function isProtectedPath(pathname: string): boolean {
  const normalizedPath = stripLocalePrefix(pathname);

  return PROTECTED_ROUTES.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );
}
