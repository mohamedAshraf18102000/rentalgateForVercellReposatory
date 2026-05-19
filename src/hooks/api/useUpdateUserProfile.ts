import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { updateUserProfile } from "@/services/userProfile/updateUserProfile.service";
import { syncUserProfileCaches } from "@/lib/utils/syncUserProfileCaches";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateUserProfile(payload),
    onSuccess: (data) => {
      syncUserProfileCaches(queryClient, data);
    },
  });
};

export default useUpdateUserProfile;
