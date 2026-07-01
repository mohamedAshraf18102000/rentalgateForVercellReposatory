import { fetcher } from "../../api";

export type PayChangeLocationWithWalletPayload = {
  changeLocationId: number;
  amount: number;
};

export const payChangeLocationWithWallet = (
  payload: PayChangeLocationWithWalletPayload,
) => {
  return fetcher("/wallets/pay-change-location", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
