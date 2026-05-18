/**
 * Forgot Password Service - API calls
 */

import { getLocaleRequestHeaders } from "@/services/api";
import { URL } from "@/util/api";
import type {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  ResendOTPPayload,
  ResendOTPResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../types/api.types";

const FORGET_PASSWORD_API_URL = "/clients/auth/forget-password";
const RESEND_OTP_API_URL = "/clients/auth/resend";
const RESET_PASSWORD_API_URL = "/clients/auth/reset-password";
const VERIFY_OTP_API_URL = "/clients/auth/verify-otp";

export const forgetPassword = async (
  payload: ForgetPasswordPayload,
): Promise<ForgetPasswordResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(URL(FORGET_PASSWORD_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: ForgetPasswordResponse = await response.json();

  if (!data.status && data.status !== undefined) {
    throw new Error(data.message || "فشل في إرسال رمز التحقق");
  }

  return data;
};

export const resendOTP = async (
  payload: ResendOTPPayload,
): Promise<ResendOTPResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(URL(RESEND_OTP_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify({ email: payload.email, channel: payload.channel }),
  });

  const data: ResendOTPResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "FAILED_TO_RESEND_OTP");
  }

  return data;
};

/** Step 1 of forgot-password: validate OTP before collecting new password */
export const verifyAuthOtp = async (payload: {
  email: string;
  otpCode: string;
}): Promise<{ status?: boolean; message?: string; data?: unknown }> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(URL(VERIFY_OTP_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify({
      email: payload.email,
      otpCode: payload.otpCode,
    }),
  });

  const data = await response.json();

  const ok =
    data.status === true ||
    data.data === true ||
    String(data.message ?? "").toUpperCase() === "SUCCESS";

  if (!ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "INVALID_OTP_CODE",
    );
  }

  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(URL(RESET_PASSWORD_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify({
      email: payload.email,
      newPassword: payload.newPassword,
      otpCode: payload.otpCode,
    }),
  });

  const data: ResetPasswordResponse = await response.json();

  if (!data.status && data.status !== undefined) {
    throw new Error(data.message || "فشل في إعادة تعيين كلمة المرور");
  }

  return data;
};
