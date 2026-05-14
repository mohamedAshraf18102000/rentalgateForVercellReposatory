"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { resetReservationState } from "@/lib/stores/resetReservationState";

const getReservationIdFromPathname = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const reservationIndex = segments.findIndex((segment) => segment === "reservation");

  if (reservationIndex === -1) return null;

  return segments[reservationIndex + 1] ?? null;
};

const isReservationPath = (pathname: string) => pathname.includes("/reservation/");

const ReservationStateResetWatcherContent = () => {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;

    if (!previousPathname) {
      previousPathnameRef.current = pathname;
      return;
    }

    const wasOnReservation = isReservationPath(previousPathname);
    const isOnReservation = isReservationPath(pathname);

    // Leaving reservation flow -> clear stale form data globally.
    if (wasOnReservation && !isOnReservation) {
      resetReservationState();
    }

    // Switching reservation car/id -> start with fresh reservation form.
    if (wasOnReservation && isOnReservation) {
      const previousReservationId = getReservationIdFromPathname(previousPathname);
      const currentReservationId = getReservationIdFromPathname(pathname);

      if (
        previousReservationId &&
        currentReservationId &&
        previousReservationId !== currentReservationId
      ) {
        resetReservationState();
      }
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  return null;
};

const ReservationStateResetWatcher = () => {
  return (
    <Suspense fallback={null}>
      <ReservationStateResetWatcherContent />
    </Suspense>
  );
};

export default ReservationStateResetWatcher;
