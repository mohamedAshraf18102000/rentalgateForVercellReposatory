import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeUserProfile } from "@/services/userProfile/completeUserProfile.service";
import { CompleteUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { syncUserProfileCaches } from "@/lib/utils/syncUserProfileCaches";

const useCompleteUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CompleteUserProfilePayload>) =>
      completeUserProfile(payload as CompleteUserProfilePayload),
    onSuccess: (data) => {
      syncUserProfileCaches(queryClient, data);
    },
  });
};

export default useCompleteUserProfile;
