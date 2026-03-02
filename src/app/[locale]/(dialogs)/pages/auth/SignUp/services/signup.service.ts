/**
 * SignUp Service - API calls
 */

import { AUTH_URL } from "@/util/api";
import type { SignUpApiResponse, SignUpPayload } from "../types/api.types";

const SIGNUP_API_URL = "/signup";

export const signUpUser = async (payload: SignUpPayload): Promise<SignUpApiResponse> => {
  const response = await fetch(AUTH_URL(SIGNUP_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: SignUpApiResponse = await response.json();

  // Check if message is not "SUCCESS" to throw error
  if (!response.ok || data.message !== "SUCCESS") {
    // Extract only the first word (before : or spaces) from error message
    const cleanMessage = data.message 
      ? data.message.split(/[:\s]/)[0].trim() 
      : "فشل إنشاء الحساب";
    throw new Error(cleanMessage);
  }

  return data;
};

