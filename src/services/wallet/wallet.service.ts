import { fetcher } from "../api";
import { WalletInfo } from "@/types/wallet/wallet";

export const getWalletInfo = async (): Promise<WalletInfo> => {
  return fetcher<WalletInfo>("/wallets/my-balance");
};
