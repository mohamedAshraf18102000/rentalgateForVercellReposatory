/**
 * Forgot Password Service - API calls
 */

import type {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  VerifyOTPPayload,
  VerifyOTPResponse,
  ResendOTPPayload,
  ResendOTPResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/api.types";

const FORGET_PASSWORD_API_URL = "/clients/auth/forget-password";
const VERIFY_OTP_API_URL = "/clients/auth/reset-password-verification";
const RESEND_OTP_API_URL = "/clients/auth/resend";
const RESET_PASSWORD_API_URL = "/clients/auth/reset-password";

export const forgetPassword = async (
  payload: ForgetPasswordPayload,
): Promise<ForgetPasswordResponse> => {
  const response = await fetch(
    `https://rentalgate.net/api${FORGET_PASSWORD_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data: ForgetPasswordResponse = await response.json();

  if (!data.status && data.status !== undefined) {
    throw new Error(data.message || "فشل في إرسال رمز التحقق");
  }

  return data;
};

export const verifyOTP = async (
  payload: VerifyOTPPayload,
): Promise<VerifyOTPResponse> => {
  const response = await fetch(
    `https://rentalgate.net/api${VERIFY_OTP_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: payload.email, code: payload.code }),
    },
  );

  const data: VerifyOTPResponse = await response.json();

  if (!data.status || data.data === false) {
    throw new Error(data.message || "INVALID_OTP_CODE");
  }

  return data;
};

export const resendOTP = async (
  payload: ResendOTPPayload,
): Promise<ResendOTPResponse> => {
  const response = await fetch(
    `https://rentalgate.net/api${RESEND_OTP_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: payload.email, channel: payload.channel }),
    },
  );

  const data: ResendOTPResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "FAILED_TO_RESEND_OTP");
  }

  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const response = await fetch(
    `https://rentalgate.net/api${RESET_PASSWORD_API_URL}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    },
  );

  const data: ResetPasswordResponse = await response.json();

  if (!data.status && data.status !== undefined) {
    throw new Error(data.message || "فشل في إعادة تعيين كلمة المرور");
  }

  return data;
};
