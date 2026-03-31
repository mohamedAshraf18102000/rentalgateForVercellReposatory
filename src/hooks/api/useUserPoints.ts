import { useQuery } from "@tanstack/react-query";
import { getUserPoints } from "@/services/userProfile/getUserPoints.service";

export const useUserPoints = () => {
  return useQuery({
    queryKey: ["userPoints"],
    queryFn: getUserPoints,
    staleTime: 5 * 60 * 1000,
  });
};
