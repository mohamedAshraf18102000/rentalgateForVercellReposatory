/**
 * Client Data Store - Zustand store for managing client data
 */

import { create } from "zustand";
import { getClientData } from "@/lib/api/services/client.service";
import type { ClientData } from "@/lib/api/types/client.types";
import { getUserData } from "@/util/auth";

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

export const useClientStore = create<ClientState>((set) => ({
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
      set({
        clientData: response.data,
        isLoading: false,
        isError: false,
        error: null,
      });
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
