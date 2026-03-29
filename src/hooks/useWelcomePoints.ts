"use client";

/**
 * Hook for managing welcome points popup display
 * Shows popup only after new account signup
 */

import { useEffect, useState, useRef } from "react";
import { useClientStore } from "@/lib/api/stores";
import { getCookie, setCookie } from "@/util/cookies";
import { isAuthenticated } from "@/util/auth";

const SHOW_WELCOME_POINTS = "show_welcome_points";

export function useWelcomePoints(locale: string) {
  const { clientData } = useClientStore();
  // const { sharedData } = useSharedStore();
  const [showWelcomePoints, setShowWelcomePoints] = useState(false);
  const [welcomePoints, setWelcomePoints] = useState(0);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check if user is authenticated
    if (!isAuthenticated() || !clientData) {
      hasCheckedRef.current = false;
      return;
    }

    const clientId = clientData.clientId;
    if (!clientId) {
      hasCheckedRef.current = false;
      return;
    }

    // Prevent multiple checks
    if (hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;

    // Get welcome points from shared data
    // const points = parseInt(sharedData?.settings?.WELCOME_POINTS || "0", 10);
    // if (points <= 0) {
    //   return;
    // }

    // Check if should show welcome points (set to 'true' during signup)
    const shouldShow = getCookie(SHOW_WELCOME_POINTS) === "true";

    if (shouldShow) {
      setWelcomePoints(10);
      setShowWelcomePoints(true);

      // Set to false after showing
      setCookie(SHOW_WELCOME_POINTS, "false", 365);
    }
  }, [clientData]);

  const handleClose = (open: boolean) => {
    setShowWelcomePoints(open);
    // Ensure flag is set to false when dialog is closed
    if (!open) {
      setCookie(SHOW_WELCOME_POINTS, "false", 365);
    }
  };

  return {
    showWelcomePoints,
    welcomePoints,
    handleClose,
  };
}

// Helper function to set show welcome points flag (call this after signup)
export function setShowWelcomePointsFlag() {
  if (typeof window !== "undefined") {
    setCookie(SHOW_WELCOME_POINTS, "true", 1);
  }
}
