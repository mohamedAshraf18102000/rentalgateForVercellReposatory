import type { PayWithGatewayResponse } from "@/types/payment/gatewayPayment";
import { fetcher } from "../../api";

export const payExtensionWithGateway = (
  extensionId: number,
): Promise<PayWithGatewayResponse> => {
  return fetcher<PayWithGatewayResponse>(
    `/payments/telr/extensions/${extensionId}/checkout`,
    {
      method: "POST",
    },
  );
};
