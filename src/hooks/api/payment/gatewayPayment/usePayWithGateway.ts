import { payWithGateway } from "@/services/payment/gatewayPayment/payWithGateway.service";
import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayWithGateway = () => {
    return useMutation<PayWithGatewayResponse, Error, number>({
        mutationFn: (reservationId: number) => payWithGateway(reservationId),
        onError: (error: Error) => {
            if (error.message === "FE-STOP-TOAST") return;
            toast.error(error.message, { position: "top-center" });
        },
    });
};
