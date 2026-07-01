import {
  payChangeLocationWithWallet,
  type PayChangeLocationWithWalletPayload,
} from "@/services/payment/walletPayment/payChangeLocationWithWallet.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayChangeLocationWithWallet = () => {
  return useMutation({
    mutationFn: (payload: PayChangeLocationWithWalletPayload) =>
      payChangeLocationWithWallet(payload),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
