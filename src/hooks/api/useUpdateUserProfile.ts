import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/services/userProfile/updateUserProfile.service";
import { UpdateUserProfilePayload } from "@/types/userProfile/updateUserProfile";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UpdateUserProfilePayload>) => 
      updateUserProfile(payload as UpdateUserProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export default useUpdateUserProfile;
