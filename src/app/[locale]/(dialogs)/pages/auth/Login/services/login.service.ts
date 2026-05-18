/**
 * Login Service - API calls
 */

import { getLocaleRequestHeaders } from "@/services/api";
import type { LoginApiResponse, LoginPayload } from "../types/api.types";

const LOGIN_API_URL = "/clients/login";

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginApiResponse> => {
  const localeHeaders = await getLocaleRequestHeaders();
  const response = await fetch(`https://api.rentalgate.net/api${LOGIN_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...localeHeaders,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.status === 423) {
    const apiMessage =
      data.message && typeof data.message === "string"
        ? data.message.trim()
        : undefined;
    const err = new Error("LOGIN_HTTP_423") as Error & {
      apiMessage?: string;
    };
    if (apiMessage) err.apiMessage = apiMessage;
    throw err;
  }

  // Check if response is successful
  // Explicitly check for token or bearerToken as evidence of success
  const isSuccess =
    response.ok &&
    (data.token ||
      data.bearerToken ||
      data.status === true ||
      data.message === "SUCCESS" ||
      (data.data && (data.data.token || data.data.bearerToken)));

  if (!isSuccess) {
    const rawMessage =
      data.message && typeof data.message === "string"
        ? data.message
        : "LOGIN_FAILED";
    throw new Error(rawMessage.trim());
  }

  // Normalize flat response into the expected LoginApiResponse structure
  if ((data.token || data.bearerToken) && !data.data) {
    const userData = { ...data };

    // Map fields for compatibility
    if (!userData.firstName && userData.clientName) {
      userData.firstName = userData.clientName;
    }

    return {
      status: true,
      message: "SUCCESS",
      data: {
        ...userData,
        bearerToken: data.token || data.bearerToken,
      },
    };
  }

  // Ensure data.data has bearerToken if it only has token
  if (data.data) {
    if (data.data.token && !data.data.bearerToken) {
      data.data.bearerToken = data.data.token;
    }
    // Also map clientName -> firstName for nested data
    if (!data.data.firstName && data.data.clientName) {
      data.data.firstName = data.data.clientName;
    }
  }

  return data;
};
