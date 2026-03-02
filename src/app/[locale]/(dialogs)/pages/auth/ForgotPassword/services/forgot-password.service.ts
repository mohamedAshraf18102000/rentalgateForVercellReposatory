/**
 * Forgot Password Service - API calls
 */

import { AUTH_URL } from "@/util/api";
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

const FORGET_PASSWORD_API_URL = "/forget-password";
const VERIFY_OTP_API_URL = "/reset-password-verification";
const RESEND_OTP_API_URL = "/resend";
const RESET_PASSWORD_API_URL = "/reset-password";

export const forgetPassword = async (
  payload: ForgetPasswordPayload
): Promise<ForgetPasswordResponse> => {
  const response = await fetch(AUTH_URL(FORGET_PASSWORD_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ForgetPasswordResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "فشل في إرسال رمز التحقق");
  }

  return data;
};

export const verifyOTP = async (
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> => {
  const response = await fetch(AUTH_URL(VERIFY_OTP_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyOTPResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "رمز التحقق غير صحيح");
  }

  return data;
};

export const resendOTP = async (
  payload: ResendOTPPayload
): Promise<ResendOTPResponse> => {
  const response = await fetch(AUTH_URL(RESEND_OTP_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ResendOTPResponse = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "فشل في إعادة إرسال رمز التحقق");
  }

  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const response = await fetch(AUTH_URL(RESET_PASSWORD_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ResetPasswordResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "فشل في إعادة تعيين كلمة المرور");
  }

  return data;
};

