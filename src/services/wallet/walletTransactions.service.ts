import { fetcher } from "../api";
import { TransactionsResponse } from "@/types/wallet/wallet";

export const getWalletTransactions =
  async (): Promise<TransactionsResponse> => {
    return fetcher<TransactionsResponse>("/wallets/my-transactions");
  };
