/**
 * Client Data Store - Zustand store for managing client data
 */

import { create } from "zustand";
import { getClientData } from "@/lib/api/services/client.service";
import type { ClientData } from "@/lib/api/types/client.types";
import { getUserData } from "@/util/auth";
import { setCookie } from "@/util/cookies";

export interface FetchClientDataOptions {
  /** Bypass session cache and fetch fresh data from the API. */
  force?: boolean;
}

/** Shared across all store subscribers — prevents duplicate profile requests. */
let clientDataFetchPromise: Promise<void> | null = null;
let hasSyncedWithServer = false;

interface ClientState {
  // Data
  clientData: ClientData | null;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;

  // Actions
  fetchClientData: (options?: FetchClientDataOptions) => Promise<void>;
  setClientData: (data: ClientData | null) => void;
  clearClientData: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  // Initial state - try to load from cookie first for immediate UI update
  clientData: typeof window !== "undefined" ? getUserData() : null,
  isLoading: false,
  isError: false,
  error: null,

  // Fetch client data from API (deduped: one in-flight request, one sync per session)
  fetchClientData: async (options?: FetchClientDataOptions) => {
    const force = options?.force ?? false;

    if (!force && hasSyncedWithServer) {
      return;
    }

    if (clientDataFetchPromise) {
      return clientDataFetchPromise;
    }

    clientDataFetchPromise = (async () => {
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
        set({
          clientData: merged,
          isLoading: false,
          isError: false,
          error: null,
        });

        if (merged) {
          setCookie("userData", JSON.stringify(merged), 30);
        }

        hasSyncedWithServer = true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع";
        set({
          isLoading: false,
          isError: true,
          error: errorMessage,
        });
      } finally {
        clientDataFetchPromise = null;
      }
    })();

    return clientDataFetchPromise;
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
    hasSyncedWithServer = false;
    clientDataFetchPromise = null;
    set({
      clientData: null,
      isLoading: false,
      isError: false,
      error: null,
    });
  },
}));
