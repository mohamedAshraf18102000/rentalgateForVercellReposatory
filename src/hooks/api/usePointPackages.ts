import { useQuery } from "@tanstack/react-query";
import { getPointPackages } from "@/services/promotion/pointsPackage.service";

export const usePointPackages = () => {
  return useQuery({
    queryKey: ["point-packages"],
    queryFn: getPointPackages,
  });
};
