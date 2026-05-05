import { useQuery } from "@tanstack/react-query";
import { getUserAddress } from "@/services/userProfile/getUserAddress.service";
import { getAuthToken } from "@/util/auth";

const useUserAddreses = (open?: boolean) => {
  const hasAuthToken = !!getAuthToken();

  return useQuery({
    queryKey: ["userAddresses"],
    queryFn: () => getUserAddress(),
    staleTime: 5 * 60 * 1000,
    enabled: !!open && hasAuthToken,
  });
};

export default useUserAddreses;
