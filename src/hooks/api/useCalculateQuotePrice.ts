import { calculateQuotePrice } from "@/services/calculateQuotePrice/calculateQuotePrice.service";
import { useMutation } from "@tanstack/react-query";

export const useCalculateQuotePrice = () => {
    return useMutation({
        mutationFn: (payload: any) => calculateQuotePrice(payload),
    });
};