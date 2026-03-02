/**
 * Login Service - API calls
 */

import { AUTH_URL } from "@/util/api";
import type { LoginApiResponse, LoginPayload } from "../types/api.types";

const LOGIN_API_URL = "/client/login";

export const loginUser = async (payload: LoginPayload): Promise<LoginApiResponse> => {
  const response = await fetch(AUTH_URL(LOGIN_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: LoginApiResponse = await response.json();

  // Check if response is successful (either status: true or message: "SUCCESS")
  if (!response.ok || (!data.status && data.message !== "SUCCESS")) {
    // Extract only the first word (before : or spaces) from error message
    const cleanMessage = data.message 
      ? data.message.split(/[:\s]/)[0].trim() 
      : "فشل تسجيل الدخول";
    throw new Error(cleanMessage);
  }

  return data;
};

