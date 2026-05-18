"use client";

import * as React from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useDialog } from "../(dialogs)";
import { isAuthenticated, isTokenValid } from "@/util/auth";
import { isProtectedPath } from "@/util/protected-routes";

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

  const isRouteProtected = React.useMemo(() => isProtectedPath(href), [href]);

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
