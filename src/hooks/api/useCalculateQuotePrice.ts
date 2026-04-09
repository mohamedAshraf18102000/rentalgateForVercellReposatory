import { calculateQuotePrice } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCalculateQuotePrice = () => {
  return useMutation({
    mutationFn: (payload: any) => calculateQuotePrice(payload),
    onError: (error) => {
      if (error.message === "FE-STOP-TOAST") return;
      toast.error(error.message, { position: "top-center" });
    },
  });
};
