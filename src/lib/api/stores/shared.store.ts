/**
 * Shared Data Store - Zustand store for managing shared data
 */

import { create } from "zustand";
import { getSharedData } from "@/lib/api/services/shared.service";
import type { SharedData } from "@/lib/api/types/shared.types";

interface SharedState {
  // Data
  sharedData: SharedData | null;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // Actions
  fetchSharedData: () => Promise<void>;
  setSharedData: (data: SharedData | null) => void;
  clearSharedData: () => void;
}

export const useSharedStore = create<SharedState>((set) => ({
  // Initial state
  sharedData: null,
  isLoading: false,
  isError: false,
  error: null,

  // Fetch shared data from API
  fetchSharedData: async () => {
    set({ isLoading: true, isError: false, error: null });
    
    try {
      const response = await getSharedData();
      set({
        sharedData: response.data,
        isLoading: false,
        isError: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      set({
        sharedData: null,
        isLoading: false,
        isError: true,
        error: errorMessage,
      });
    }
  },

  // Set shared data directly
  setSharedData: (data: SharedData | null) => {
    set({ sharedData: data });
  },

  // Clear shared data
  clearSharedData: () => {
    set({
      sharedData: null,
      isLoading: false,
      isError: false,
      error: null,
    });
  },
}));

