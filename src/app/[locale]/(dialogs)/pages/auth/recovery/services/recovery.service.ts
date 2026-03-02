/**
 * Account Recovery Service - API calls
 */

import { AUTH_URL } from "@/util/api";
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

export const accountRecovery = async (
  payload: AccountRecoveryPayload
): Promise<AccountRecoveryResponse> => {
  const response = await fetch(AUTH_URL(ACCOUNT_RECOVERY_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(AUTH_URL(VERIFY_ACCOUNT_RECOVERY_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(AUTH_URL(RESET_PASSWORD_VERIFICATION_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ResetPasswordVerificationResponse = await response.json();

  if (!response.ok || (data.status !== undefined && !data.status)) {
    throw new Error(data.message || "فشل في التحقق من الرمز");
  }

  return data;
};

