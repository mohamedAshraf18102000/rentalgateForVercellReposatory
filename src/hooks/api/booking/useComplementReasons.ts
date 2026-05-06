import { useQuery } from "@tanstack/react-query";
import { getComplementReasons } from "@/services/mybookings/complementReasons.service";

export const useComplementReasons = () => {
  return useQuery({
    queryKey: ["complement-reasons"],
    queryFn: () => getComplementReasons(),
  });
};

