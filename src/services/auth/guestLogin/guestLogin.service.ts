import { GuestTokenResponse } from "@/types/auth/guestLogin";
import { fetcher } from "../../api";

export const getGuestToken = async (): Promise<GuestTokenResponse> => {
  return fetcher<GuestTokenResponse>("/auth/guest-login", {
    method: "POST",
  });
};
