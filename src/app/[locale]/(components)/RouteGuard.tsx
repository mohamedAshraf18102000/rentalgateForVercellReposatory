"use client";

import * as React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDialog } from "../(dialogs)";
import { isAuthenticated, isTokenValid } from "@/util/auth";
import { useWelcomePoints } from "@/hooks/useWelcomePoints";
import { WelcomePointsDialog } from "@/app/(components)/WelcomePointsDialog";
import { useParams } from "next/navigation";

/**
 * RouteGuard Component
 * 
 * Checks for requireAuth query parameter and opens login modal if needed.
 * After successful login, removes the query parameter and allows access.
 */
function RouteGuardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openDialog, currentDialog } = useDialog();
  const dialogOpenedRef = React.useRef<string | null>(null);
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  
  // Welcome points popup
  const { showWelcomePoints, welcomePoints, handleClose } = useWelcomePoints(locale);

  React.useEffect(() => {
    // Use a small delay to ensure URL is fully updated
    const timeoutId = setTimeout(() => {
      const requireAuth = searchParams.get('requireAuth');
      const currentUrl = `${pathname}?${searchParams.toString()}`;
      
      // Skip if login dialog is already open for this URL
      if (currentDialog?.name === 'Login' && dialogOpenedRef.current === currentUrl) {
        return;
      }
      
      // Reset ref if dialog is closed and redirect to home if requireAuth was present
      if (!currentDialog && dialogOpenedRef.current) {
        const hadRequireAuth = searchParams.get('requireAuth') === 'true';
        dialogOpenedRef.current = null;
        
        // If dialog was closed and requireAuth is still present, redirect to home
        if (hadRequireAuth) {
          const locale = pathname.split('/')[1] || 'ar';
          router.replace(`/${locale}`);
        }
      }

      if (requireAuth === 'true') {
        // Check if user is already authenticated (in case they logged in in another tab)
        if (isAuthenticated() && isTokenValid()) {
          // User is authenticated, remove the query parameter
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete('requireAuth');
          const newUrl = newSearchParams.toString()
            ? `${pathname}?${newSearchParams.toString()}`
            : pathname;
          router.replace(newUrl);
          return;
        }

        // Only open dialog if it's not already open for this URL
        if (dialogOpenedRef.current !== currentUrl) {
          dialogOpenedRef.current = currentUrl;
          
          // User is not authenticated, open login modal
          const redirectPath = searchParams.get('redirect') || pathname;
          
          openDialog("Login", {
            onSuccess: () => {
              dialogOpenedRef.current = null;
              // After successful login, redirect to the intended page
              const newSearchParams = new URLSearchParams(searchParams.toString());
              newSearchParams.delete('requireAuth');
              newSearchParams.delete('redirect');
              
              // Use the redirect path if available, otherwise use current pathname
              const finalPath = redirectPath || pathname;
              const newUrl = newSearchParams.toString()
                ? `${finalPath}?${newSearchParams.toString()}`
                : finalPath;
              router.replace(newUrl);
            },
          });
        }
      }
    }, 100); // Small delay to ensure URL is updated

    return () => clearTimeout(timeoutId);
  }, [searchParams, pathname, router, openDialog, currentDialog]);

  return (
    <>
      {/* Welcome Points Dialog */}
      <WelcomePointsDialog
        open={showWelcomePoints}
        onOpenChange={handleClose}
        points={welcomePoints}
        locale={locale}
      />
    </>
  );
}

export function RouteGuard() {
  return (
    <React.Suspense fallback={null}>
      <RouteGuardContent />
    </React.Suspense>
  );
}

