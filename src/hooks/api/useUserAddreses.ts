import { useQuery } from "@tanstack/react-query";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";

const useUserAddreses = (open?: boolean) => {
  return useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddress(),
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });
};

export default useUserAddreses;
