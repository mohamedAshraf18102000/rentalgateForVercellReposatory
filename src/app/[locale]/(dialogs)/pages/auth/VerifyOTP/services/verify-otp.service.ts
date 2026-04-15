import type { VerifyOTPPayload, VerifyOTPResponse } from "../types/api.types";
import type { SignUpPayload } from "../../SignUp/types/api.types";

const VERIFY_API_URL = "/clients/verify-registration-otp";
const RESEND_API_URL = "/clients/resend-registration-otp";

export const verifyOTP = async (
  payload: VerifyOTPPayload,
): Promise<VerifyOTPResponse> => {
  const response = await fetch(`https://api.rentalgate.net/api${VERIFY_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(`https://api.rentalgate.net/api${RESEND_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyOTPResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "FAILED_TO_RESEND_OTP");
  }

  return data;
};

// Forgot Password API Calls
export const verifyForgotOTP = async (
  email: string,
  code: string,
): Promise<VerifyOTPResponse> => {
  const response = await fetch(
    `https://api.rentalgate.net/api/clients/auth/reset-password-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    },
  );

  const data: VerifyOTPResponse = await response.json();

  if (!data.status || data.data === false) {
    throw new Error(data.message || "INVALID_OTP_CODE");
  }

  return data;
};

export const resendForgotOTP = async (
  email: string,
  channel: "EMAIL" | "WHATSAPP",
): Promise<{ status: boolean; message: string }> => {
  const response = await fetch(`https://api.rentalgate.net/api/clients/auth/resend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, channel }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "FAILED_TO_RESEND_OTP");
  }

  return data;
};
