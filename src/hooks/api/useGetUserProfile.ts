import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/userProfile/getUserProfile.service";
import { getAuthToken } from "@/util/auth";

const useGetUserProfile = (enabled = true) => {
  const hasAuthToken = !!getAuthToken();

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    enabled: enabled && hasAuthToken,
  });
};

export default useGetUserProfile;
