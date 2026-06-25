import type { GetTelrPaymentStatusResponse } from "@/types/payment/gatewayPayment";
import { fetcher } from "../../api";

export const getTelrPaymentStatus = (
  paymentId: number,
  options?: { skipErrorToast?: boolean },
): Promise<GetTelrPaymentStatusResponse> => {
  return fetcher<GetTelrPaymentStatusResponse>(
    `/payments/telr/${paymentId}/status`,
    {
      method: "GET",
      skipErrorToast: options?.skipErrorToast,
    },
  );
};
