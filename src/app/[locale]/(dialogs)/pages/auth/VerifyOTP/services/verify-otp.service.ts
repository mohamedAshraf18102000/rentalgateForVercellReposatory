import { getLocaleRequestHeaders } from "@/services/api";
import type { VerifyOTPPayload, VerifyOTPResponse } from "../types/api.types";
import type { SignUpPayload } from "../../SignUp/types/api.types";

const VERIFY_API_URL = "/clients/verify-registration-otp";
const RESEND_API_URL = "/clients/resend-registration-otp";

export const verifyOTP = async (
  payload: VerifyOTPPayload,
): Promise<VerifyOTPResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(`https://api.rentalgate.net/api${VERIFY_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyOTPResponse = await response.json();

  // Check if OTP is invalid
  if (!data.valid || !data.status) {
    throw new Error("INVALID_OTP_CODE");
  }

  return data;
};

export const resendRegistrationOTP = async (
  payload: SignUpPayload,
): Promise<VerifyOTPResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(`https://api.rentalgate.net/api${RESEND_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyOTPResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "FAILED_TO_RESEND_OTP");
  }

  return data;
};

