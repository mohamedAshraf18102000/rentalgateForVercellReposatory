import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "@/services/wallet/walletTransactions.service";

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["walletTransactions"],
    queryFn: getWalletTransactions,
    staleTime: 5 * 60 * 1000,
  });
};
