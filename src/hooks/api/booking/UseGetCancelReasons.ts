import { useQuery } from "@tanstack/react-query";
import { getCancelReasons } from "@/services/mybookings/cancelReasons.service";

export const UseGetCancelReasons = () => {
    return useQuery({
        queryKey: ["cancel-reasons"],
        queryFn: () => getCancelReasons(),
    });
};
