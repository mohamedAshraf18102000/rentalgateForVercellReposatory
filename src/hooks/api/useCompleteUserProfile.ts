import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClientStore } from "@/lib/api/stores";
import { completeUserProfile } from "@/services/userProfile/completeUserProfile.service";
import { CompleteUserProfilePayload } from "@/types/userProfile/updateUserProfile";

const useCompleteUserProfile = () => {
  const queryClient = useQueryClient();
  const { fetchClientData } = useClientStore();

  return useMutation({
    mutationFn: (payload: Partial<CompleteUserProfilePayload>) =>
      completeUserProfile(payload as CompleteUserProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      fetchClientData();
    },
  });
};

export default useCompleteUserProfile;
