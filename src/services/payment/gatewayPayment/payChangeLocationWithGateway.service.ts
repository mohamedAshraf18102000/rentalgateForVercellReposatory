import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { fetcher } from "../../api";

export const payChangeLocationWithGateway = (
  changeLocationId: number,
): Promise<PayWithGatewayResponse> => {
  return fetcher<PayWithGatewayResponse>(
    `/payments/telr/change-location/${changeLocationId}/checkout`,
    {
      method: "POST",
    },
  );
};
