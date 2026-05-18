/**
 * Account Recovery Service - API calls
 */

import { getLocaleRequestHeaders } from "@/services/api";
import { AUTH_URL, URL } from "@/util/api";
import type {
  AccountRecoveryPayload,
  AccountRecoveryResponse,
  VerifyAccountRecoveryPayload,
  VerifyAccountRecoveryResponse,
  ResetPasswordVerificationPayload,
  ResetPasswordVerificationResponse,
} from "../types/api.types";

const ACCOUNT_RECOVERY_API_URL = "/account-recovery";
const VERIFY_ACCOUNT_RECOVERY_API_URL = "/verify-account-recovery";
const RESET_PASSWORD_VERIFICATION_API_URL = "/reset-password-verification";
const AUTH_RESET_PASSWORD_API_URL = "/clients/auth/reset-password";

export const accountRecovery = async (
  payload: AccountRecoveryPayload
): Promise<AccountRecoveryResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(AUTH_URL(ACCOUNT_RECOVERY_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: AccountRecoveryResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "فشل في إرسال رمز التحقق");
  }

  return data;
};

export const verifyAccountRecovery = async (
  payload: VerifyAccountRecoveryPayload
): Promise<VerifyAccountRecoveryResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(AUTH_URL(VERIFY_ACCOUNT_RECOVERY_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyAccountRecoveryResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "رمز التحقق غير صحيح");
  }

  return data;
};

export const resetPasswordVerification = async (
  payload: ResetPasswordVerificationPayload
): Promise<ResetPasswordVerificationResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(AUTH_URL(RESET_PASSWORD_VERIFICATION_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: ResetPasswordVerificationResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "فشل في التحقق من الرمز");
  }

  return data;
};

export const resetAuthPasswordWithOtp = async (payload: {
  email: string;
  newPassword: string;
  otpCode: string;
}): Promise<{ status?: boolean; message: string; data?: unknown }> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(URL(AUTH_RESET_PASSWORD_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data: { status?: boolean; message: string; data?: unknown } =
    await response.json();

  if (!data.status && data.status !== undefined) {
    throw new Error(data.message || "فشل في إعادة تعيين كلمة المرور");
  }

  return data;
};

