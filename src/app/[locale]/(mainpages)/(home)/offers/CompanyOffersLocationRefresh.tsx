"use client";

import { useLocationStore } from "@/lib/stores/useLocationStore";
import { useRouter } from "next/navigation";
import { startTransition, Suspense, useEffect, useRef } from "react";

function pairKey(lat: number | null, lng: number | null): string {
  if (lat == null || lng == null) return "";
  return `${lat},${lng}`;
}

/**
 * When the user sets location in the client, `lat`/`lng` cookies update but RSC
 * does not re-run. This triggers `router.refresh()` so server components like
 * {@link CompanyOffers} fetch again with the new cookies (SSR stays correct).
 */
function CompanyOffersLocationRefreshContent() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const scheduleRefresh = () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
        startTransition(() => {
          router.refresh();
        });
      }, 0);
    };

    const unsubHydration = useLocationStore.persist.onFinishHydration((state) => {
      if (
        state.userPhysical_Latitude != null &&
        state.userPhysical_Longitude != null
      ) {
        scheduleRefresh();
      }
    });

    const unsubSubscribe = useLocationStore.subscribe((state, prev) => {
      if (
        pairKey(state.userPhysical_Latitude, state.userPhysical_Longitude) !==
        pairKey(prev.userPhysical_Latitude, prev.userPhysical_Longitude)
      ) {
        scheduleRefresh();
      }
    });

    if (useLocationStore.persist.hasHydrated()) {
      const s = useLocationStore.getState();
      if (
        s.userPhysical_Latitude != null &&
        s.userPhysical_Longitude != null
      ) {
        scheduleRefresh();
      }
    }

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      unsubHydration();
      unsubSubscribe();
    };
  }, [router]);

  return null;
}

export default function CompanyOffersLocationRefresh() {
  return (
    <Suspense fallback={null}>
      <CompanyOffersLocationRefreshContent />
    </Suspense>
  );
}
