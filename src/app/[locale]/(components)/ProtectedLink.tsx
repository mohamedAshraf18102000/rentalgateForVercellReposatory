"use client";

import * as React from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useDialog } from "../(dialogs)";
import { isAuthenticated, isTokenValid } from "@/util/auth";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/booking", "/reservation"];

interface ProtectedLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
}

/**
 * ProtectedLink Component
 *
 * A Link component that checks authentication before navigation.
 * If the route is protected and user is not authenticated, opens login modal instead.
 */
export function ProtectedLink({
  href,
  children,
  ...props
}: ProtectedLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openDialog } = useDialog();

  const isRouteProtected = React.useMemo(() => {
    // Check if route is protected (href might be with or without locale)
    // Remove locale prefix if present
    const pathWithoutLocale = href.replace(/^\/(ar|en)(\/|$)/, "/") || "/";
    const normalizedPath = pathWithoutLocale === "/" ? "/" : pathWithoutLocale;
    return PROTECTED_ROUTES.some(
      (route) =>
        normalizedPath === route || normalizedPath.startsWith(route + "/"),
    );
  }, [href]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isRouteProtected && (!isAuthenticated() || !isTokenValid())) {
        e.preventDefault();

        // Get the full path with locale
        const locale = pathname.split("/")[1] || "ar";
        const fullPath = href.startsWith("/") ? `/${locale}${href}` : href;

        openDialog("Login", {
          onSuccess: () => {
            // After successful login, navigate to the intended page
            router.push(href);
          },
        });
      }
    },
    [isRouteProtected, href, pathname, router, openDialog],
  );

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
