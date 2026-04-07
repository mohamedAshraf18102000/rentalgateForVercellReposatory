import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { fetcher } from "../api";
import { ClientData } from "@/lib/api/types/client.types";

export const updateUserProfile = (payload: UpdateUserProfilePayload) => {
  return fetcher<ClientData>("/clients/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
