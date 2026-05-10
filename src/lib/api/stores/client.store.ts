/**
 * Client Data Store - Zustand store for managing client data
 */

import { create } from "zustand";
import { getClientData } from "@/lib/api/services/client.service";
import type { ClientData } from "@/lib/api/types/client.types";
import { getUserData } from "@/util/auth";
import { setCookie } from "@/util/cookies";

interface ClientState {
  // Data
  clientData: ClientData | null;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;

  // Actions
  fetchClientData: () => Promise<void>;
  setClientData: (data: ClientData | null) => void;
  clearClientData: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  // Initial state - try to load from cookie first for immediate UI update
  clientData: typeof window !== "undefined" ? getUserData() : null,
  isLoading: false,
  isError: false,
  error: null,

  // Fetch client data from API
  fetchClientData: async () => {
    set({ isLoading: true, isError: false, error: null });

    try {
      const response = await getClientData();
      const prev = get().clientData;
      const next = response.data;
      const merged =
        next && prev
          ? {
              ...next,
              walletBalance:
                next.walletBalance ?? prev.walletBalance,
              availablePoints:
                next.availablePoints ?? prev.availablePoints,
            }
          : next;
      // Update store
      set({
        clientData: merged,
        isLoading: false,
        isError: false,
        error: null,
      });

      // Update cookie to persist full data for next refresh
      if (merged) {
        setCookie("userData", JSON.stringify(merged), 30);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      set({
        isLoading: false,
        isError: true,
        error: errorMessage,
      });
    }
  },

  // Set client data directly
  setClientData: (data: ClientData | null) => {
    set({ clientData: data });
    if (data) {
      setCookie("userData", JSON.stringify(data), 30);
    }
  },

  // Clear client data
  clearClientData: () => {
    set({
      clientData: null,
      isLoading: false,
      isError: false,
      error: null,
    });
  },
}));
