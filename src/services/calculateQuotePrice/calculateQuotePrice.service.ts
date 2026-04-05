import { fetcher } from "../api";

export const calculateQuotePrice = (payload: any) => {
    return fetcher<any>("/reservations/quote", {
        method: "POST",
        body: JSON.stringify(payload),
    });
};
