import { fetcher } from "@/services/api";

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  valid: boolean;
  passwordChanged: boolean;
}

export interface UpdatePasswordResponse {
  status: boolean;
  message: string;
}

export const updateClientPassword = async (
  payload: Pick<UpdatePasswordPayload, "oldPassword" | "newPassword">
): Promise<UpdatePasswordResponse> => {
  return fetcher<UpdatePasswordResponse>("/clients/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      valid: true,
      passwordChanged: true,
    }),
  });
};
