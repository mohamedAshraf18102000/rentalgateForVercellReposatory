import { payExtensionWithGateway } from "@/services/payment/gatewayPayment/payExtensionWithGateway.service";
import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayExtensionWithGateway = () => {
  return useMutation<PayWithGatewayResponse, Error, number>({
    mutationFn: (extensionId: number) =>
      payExtensionWithGateway(extensionId),
    onError: (error: Error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
