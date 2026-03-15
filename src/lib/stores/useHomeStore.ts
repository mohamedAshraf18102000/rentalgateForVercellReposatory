"use client";

import { create } from "zustand";

import { HomeResponse } from "@/types/home/home";
import { getHomePageDetails } from "@/services/home/home.service";

interface HomeState {
  data: HomeResponse | null;
  loading: boolean;
  error: string | null;
  setData: (data: HomeResponse) => void;
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>()((set) => ({
  data: null,
  loading: false,
  error: null,
  setData: (data) => set({ data, loading: false, error: null }),
  fetchHomeData: async () => {
    // Only fetch if data is null to avoid redundant requests
    set({ loading: true, error: null });
    try {
      const response = await getHomePageDetails();
      set({ data: response, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch home data", loading: false });
    }
  },
}));
