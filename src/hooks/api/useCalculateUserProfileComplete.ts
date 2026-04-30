import { getUserProfileCompletnessState } from "@/services/userProfile/getUserProfileCompletnessState.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCalculateUserProfileComplete = () => {
  return useMutation({
    mutationFn: () => getUserProfileCompletnessState(),
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });
};
