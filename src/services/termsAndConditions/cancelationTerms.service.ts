import { TermsResponse } from "@/types/termsAndConditions/cancelationTerms";
import { fetcher } from "../api";

export const getCancelationTerms = () => {
    return fetcher<TermsResponse>("/cancellation-terms?page=0&size=100");
};

export const getBookingTerms = () => {
    return fetcher<TermsResponse>("/booking-terms?page=0&size=100");
};

export const getPaymentTerms = () => {
    return fetcher<TermsResponse>("/payment-terms?page=0&size=100");
};


