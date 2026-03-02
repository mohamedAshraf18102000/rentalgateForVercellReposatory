/**
 * VerifyOTP Service - API calls
 */

import { AUTH_URL } from "@/util/api";
import type { VerifyOTPPayload, VerifyOTPResponse } from "../types/api.types";

const VERIFY_API_URL = "/verify";

export const verifyOTP = async (
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> => {
  const response = await fetch(AUTH_URL(VERIFY_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: VerifyOTPResponse = await response.json();

  // Check if response is not ok
  if (!response.ok) {
    throw new Error(data.message || "رمز التحقق غير صحيح");
  }

  // Check if message is "SUCCESS" but data is false (OTP is wrong)
  if (data.message === "SUCCESS" && data.data === false) {
    throw new Error("INVALID_OTP_CODE");
  }

  // Check if message is not "SUCCESS"
  if (data.message !== "SUCCESS") {
    throw new Error(data.message || "INVALID_OTP_CODE");
  }

  return data;
};

