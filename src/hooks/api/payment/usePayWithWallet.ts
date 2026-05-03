import {
  payWithWallet,
  type PayReservationWithWalletPayload,
} from "@/services/payment/payWithWallet.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayWithWallet = () => {
  return useMutation({
    mutationFn: (payload: PayReservationWithWalletPayload) =>
      payWithWallet(payload),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
