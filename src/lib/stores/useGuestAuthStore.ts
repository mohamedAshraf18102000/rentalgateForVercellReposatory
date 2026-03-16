import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { GuestTokenResponse } from "@/types/auth/guestLogin";

interface GuestAuthState {
  user: GuestTokenResponse | null;
  token: string | null;
  setGuestAuth: (auth: GuestTokenResponse) => void;
  clearGuestAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useGuestAuthStore = create<GuestAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setGuestAuth: (auth) => set({ user: auth, token: auth.token }),
      clearGuestAuth: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "guest-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
