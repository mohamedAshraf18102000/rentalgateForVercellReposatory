import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";
import { updateUserProfile } from "@/services/userProfile/updateUserProfile.service";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export default useUpdateUserProfile;
