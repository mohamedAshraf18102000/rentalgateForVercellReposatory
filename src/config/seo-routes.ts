import { routing } from "@/i18n/routing";
import { SEO_KEYS, type SeoKey } from "@/config/seo";

/**
 * Maps app paths (without locale prefix) to seo.json keys.
 * Add an entry when you add a matching key in messages/{locale}/seo.json.
 */
export const SEO_ROUTE_MAP: Record<string, SeoKey> = {
  "": SEO_KEYS.HOME,
  bookings: SEO_KEYS.BOOKINGS,
  bussinessAccounts: SEO_KEYS.BUSINESS_ACCOUNTS,
  userProfile: SEO_KEYS.USER_PROFILE,
  myBookings: SEO_KEYS.MY_BOOKINGS,
  wallet: SEO_KEYS.WALLET,
  "terms&conditions": SEO_KEYS.TERMS_AND_CONDITIONS,
};

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
    return segments.slice(1).join("/");
  }

  return segments.join("/");
}

export function resolveSeoKeyFromPathname(pathname: string): SeoKey | undefined {
  const path = stripLocaleFromPathname(pathname);

  if (path in SEO_ROUTE_MAP) {
    return SEO_ROUTE_MAP[path];
  }

  const firstSegment = path.split("/")[0];
  if (firstSegment && firstSegment in SEO_ROUTE_MAP) {
    return SEO_ROUTE_MAP[firstSegment];
  }

  return undefined;
}
