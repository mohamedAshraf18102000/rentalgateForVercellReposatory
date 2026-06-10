import { fetcher } from "../api";

export type PayExtensionWithWalletPayload = {
  extendId: number;
  amount: number;
};

export const payExtensionWithWallet = (
  payload: PayExtensionWithWalletPayload,
) => {
  return fetcher("/wallets/pay-reservation-extend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
