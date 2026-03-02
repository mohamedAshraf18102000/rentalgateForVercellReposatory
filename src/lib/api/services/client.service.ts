/**
 * Client Service - API calls for client data
 */

import { authenticatedFetch, URL } from "@/util/api";
import type { ClientDataApiResponse } from "@/lib/api/types/client.types";

const CLIENT_DATA_API_URL = "/clients/get-data";
const CLIENT_UPDATE_API_URL = "/clients/update";
const CHANGE_PASSWORD_API_URL = "/clients/change-password";

export interface UpdateClientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  cityId?: number;
  countryId?: number;
  address?: string;
  licenseExpiration?: string;
  image?: string;
  licenseNumber?: string;
}

export interface UpdateClientResponse {
  message: string;
  status?: boolean;
  data?: any;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  status: boolean;
  data?: string;
}

/**
 * Get client data from API
 * @returns Client data response
 */
export const getClientData = async (): Promise<ClientDataApiResponse> => {
  const response = await authenticatedFetch(URL(CLIENT_DATA_API_URL), {
    method: "GET",
  });

  const data: ClientDataApiResponse = await response.json();

  // Check if response is successful (either status: true or message: "SUCCESS")
  if (!response.ok || (!data.status && data.message !== "SUCCESS")) {
    throw new Error(data.message || "فشل في جلب بيانات العميل");
  }

  return data;
};

/**
 * Upload image file
 * @param file - File to upload
 * @returns Filename returned from server
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  // Get auth token for upload endpoint
  const { getAuthHeader } = await import('@/util/auth');
  const authHeader = getAuthHeader();
  
  const response = await fetch('https://viganium.co/uploads', {
    method: 'POST', 
    body: formData,
  });

  if (!response.ok) {
    throw new Error('فشل في رفع الصورة');
  }

  // The API returns just the filename as text
  const filename = await response.text();
  return filename.trim();
};

/**
 * Update client data
 * @param updateData - Data to update
 * @returns Update response
 */
export const updateClientData = async (
  updateData: UpdateClientData
): Promise<UpdateClientResponse> => {
  const response = await authenticatedFetch(URL(CLIENT_UPDATE_API_URL), {
    method: "PATCH",
    body: JSON.stringify(updateData),
  });

  const data: UpdateClientResponse = await response.json();

  // Check if response is successful (either status: true or message: "SUCCESS")
  if (!response.ok || (data.status !== undefined && !data.status && data.message !== "SUCCESS")) {
    throw new Error(data.message || "فشل في تحديث بيانات العميل");
  }

  return data;
};

/**
 * Change password
 * @param passwordData - Password change data
 * @returns Change password response
 */
export const changePassword = async (
  passwordData: ChangePasswordData
): Promise<ChangePasswordResponse> => {
  const response = await authenticatedFetch(URL(CHANGE_PASSWORD_API_URL), {
    method: "POST",
    body: JSON.stringify({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    }),
  });

  const data: ChangePasswordResponse = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "فشل في تغيير كلمة المرور");
  }

  return data;
};

