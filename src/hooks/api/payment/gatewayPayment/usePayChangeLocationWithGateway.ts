import { payChangeLocationWithGateway } from "@/services/payment/gatewayPayment/payChangeLocationWithGateway.service";
import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayChangeLocationWithGateway = () => {
  return useMutation<PayWithGatewayResponse, Error, number>({
    mutationFn: (changeLocationId: number) =>
      payChangeLocationWithGateway(changeLocationId),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
