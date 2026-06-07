import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const LOCALE_COOKIE = "NEXT_LOCALE";

type AppLocale = (typeof routing.locales)[number];

/** Resolve document locale from middleware-injected request headers. */
export async function getServerDocumentLocale(): Promise<AppLocale> {
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale");

  if (hasLocale(routing.locales, headerLocale)) {
    return headerLocale;
  }

  const pathname = headerList.get("x-pathname") ?? "";
  const segment = pathname.split("/").filter(Boolean)[0];

  if (hasLocale(routing.locales, segment)) {
    return segment;
  }

  return routing.defaultLocale;
}

function isAppLocale(value: string | undefined | null): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}

/** True when the first path segment is a supported locale (e.g. /ar/...). */
export function hasLocalePrefix(pathname: string): boolean {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isAppLocale(firstSegment);
}

/** Resolve locale from URL, cookie, or routing default. */
export function getPreferredLocale(request: NextRequest): AppLocale {
  const pathLocale = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  if (isAppLocale(pathLocale)) {
    return pathLocale;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  return routing.defaultLocale;
}

/** Prefix pathname with locale when missing (e.g. /userProfile -> /ar/userProfile). */
export function ensureLocalizedPathname(
  pathname: string,
  locale: AppLocale,
): string {
  if (hasLocalePrefix(pathname)) {
    return pathname;
  }

  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
