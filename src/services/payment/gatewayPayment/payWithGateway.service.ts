import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { fetcher } from "../../api";

export const payWithGateway = (
  reservationId: number,
): Promise<PayWithGatewayResponse> => {
  return fetcher<PayWithGatewayResponse>(
    `/payments/telr/reservations/${reservationId}/checkout`,
    {
      method: "POST",
    },
  );
};
