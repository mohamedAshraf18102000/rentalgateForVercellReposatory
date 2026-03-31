import { useQuery } from "@tanstack/react-query";
import { getWalletInfo } from "@/services/wallet/wallet.service";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: getWalletInfo,
    staleTime: 5 * 60 * 1000,
  });
};
