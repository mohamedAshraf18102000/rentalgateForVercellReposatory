import {
  payExtensionWithWallet,
  type PayExtensionWithWalletPayload,
} from "@/services/payment/walletPayment/payExtensionWithWallet.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayExtensionWithWallet = () => {
  return useMutation({
    mutationFn: (payload: PayExtensionWithWalletPayload) =>
      payExtensionWithWallet(payload),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
