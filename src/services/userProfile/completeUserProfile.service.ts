import { CompleteUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { fetcher } from "../api";
import { ClientData } from "@/lib/api/types/client.types";

export const completeUserProfile = (payload: CompleteUserProfilePayload) => {
  return fetcher<ClientData>("/clients/profile/complete", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
