import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isAuthenticatedOnServer } from "./util/auth-server";
import {
  ensureLocalizedPathname,
  getPreferredLocale,
  hasLocalePrefix,
} from "./util/locale-path";
import { isProtectedPath } from "./util/protected-routes";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Force locale prefix before Next matches [locale] with a route segment (404).
  if (!hasLocalePrefix(pathname)) {
    const locale = getPreferredLocale(request);
    const localizedPath = ensureLocalizedPathname(pathname, locale);
    const redirectUrl = new URL(`${localizedPath}${search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isProtectedPath(pathname) && !isAuthenticatedOnServer(request)) {
    const locale = getPreferredLocale(request);
    const redirectUrl = new URL(`/${locale}${search}`, request.url);
    redirectUrl.searchParams.set("requireAuth", "true");
    redirectUrl.searchParams.set(
      "redirect",
      ensureLocalizedPathname(pathname, locale),
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticatedOnServer(request)) {
    const url = request.nextUrl.clone();
    if (url.searchParams.has("requireAuth")) {
      url.searchParams.delete("requireAuth");
      const redirectPath = url.searchParams.get("redirect");
      url.searchParams.delete("redirect");

      const locale = getPreferredLocale(request);
      const finalPath = redirectPath
        ? ensureLocalizedPathname(redirectPath, locale)
        : pathname;
      const finalUrl = url.searchParams.toString()
        ? `${finalPath}?${url.searchParams.toString()}`
        : finalPath;
      return NextResponse.redirect(new URL(finalUrl, request.url));
    }
  }

  const response = intlMiddleware(request);
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
