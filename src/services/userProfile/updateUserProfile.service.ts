import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { fetcher } from "../api";
import { ClientData } from "@/lib/api/types/client.types";

export const updateUserProfile = (payload: UpdateUserProfilePayload) => {
  return fetcher<ClientData>("/clients/profile/complete", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
