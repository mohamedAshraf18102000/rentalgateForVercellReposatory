import { fetcher } from "../../api";
import { SignUpPayload } from "@/app/[locale]/(dialogs)/pages/auth/SignUp/types/api.types";

export interface RegisterWithOtpResponse {
  message: string;
  status: boolean;
  clientId: number | null;
  welcomePoints: number | null;
  valid: boolean;
}

export const signup = async (payload: SignUpPayload): Promise<RegisterWithOtpResponse> => {
  return fetcher<RegisterWithOtpResponse>("/clients/register-with-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
