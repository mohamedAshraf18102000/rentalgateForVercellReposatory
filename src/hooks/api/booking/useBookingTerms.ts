import { useQuery } from "@tanstack/react-query";
import { getBookingTerms } from "@/services/termsAndConditions/cancelationTerms.service";

export const useBookingTerms = () => {
  return useQuery({
    queryKey: ["booking-terms"],
    queryFn: () => getBookingTerms(),
  });
};
