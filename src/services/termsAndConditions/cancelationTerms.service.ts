import { TermsResponse } from "@/types/termsAndConditions/cancelationTerms";
import { fetcher } from "../api";

export const getCancelationTerms = () => {
    return fetcher<TermsResponse>("/cancellation-terms?page=0&size=100");
};

export const getBookingTerms = (options?: RequestInit) => {
    return fetcher<TermsResponse>("/booking-terms?page=0&size=100", options);
};


