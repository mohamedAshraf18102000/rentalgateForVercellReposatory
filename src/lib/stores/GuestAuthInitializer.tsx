"use client";

import { useEffect, useRef } from "react";
import { useGuestAuthStore } from "./useGuestAuthStore";
import { getGuestToken } from "@/services/auth/guestLogin/guestLogin.service";

export const GuestAuthInitializer = () => {
  const initialized = useRef(false);

  useEffect(() => {
    const initGuestAuth = async () => {
      // Only fetch if not already authenticated and not already initializing
      const { isAuthenticated, setGuestAuth } = useGuestAuthStore.getState();

      if (isAuthenticated() || initialized.current) return;
      initialized.current = true;

      try {
        const guestData = await getGuestToken();
        setGuestAuth(guestData);
      } catch (error) {
        console.error("Failed to initialize guest auth:", error);
        initialized.current = false; // Allow retry on error
      }
    };

    initGuestAuth();
  }, []);

  return null;
};
